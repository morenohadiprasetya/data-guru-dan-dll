import React, { useEffect, useMemo, useState } from "react";

/**
 * RekapTagihan.jsx
 * - Mengumpulkan tagihan per nama
 * - Menampilkan total, lunas, sisa, persen
 * - Filter / search / small summary
 *
 * Endpoint expected: http://localhost:5000/tagihan
 */

const API = "http://localhost:5000/tagihan";

function formatRp(n = 0) {
  return "Rp " + Number(n).toLocaleString();
}

export default function RekapTagihan() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterPercentMin, setFilterPercentMin] = useState(0); // filter: show only > persen

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      try {
        const res = await fetch(API);
        if (!res.ok) throw new Error("Gagal memuat");
        const d = await res.json();
        if (mounted) setData(Array.isArray(d) ? d : []);
      } catch (err) {
        console.error(err);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => (mounted = false);
  }, []);

  const grouped = useMemo(() => {
    const map = {};
    data.forEach((t) => {
      const name = t.nama || "Unknown";
      if (!map[name]) map[name] = { nama: name, total: 0, lunas: 0, sisa: 0 };
      const jumlah = Number(t.jumlah || 0);
      map[name].total += jumlah;
      if ((t.status || "").toLowerCase() === "lunas") map[name].lunas += jumlah;
      map[name].sisa = map[name].total - map[name].lunas;
    });

    return Object.values(map).map((r) => ({
      ...r,
      persen: r.total > 0 ? Math.round((r.lunas / r.total) * 100) : 0,
    }));
  }, [data]);

  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase();
    return grouped
      .filter((g) => g.persen >= filterPercentMin)
      .filter((g) => (s ? g.nama.toLowerCase().includes(s) : true))
      .sort((a, b) => b.total - a.total); // largest first
  }, [grouped, search, filterPercentMin]);

  const totals = useMemo(() => {
    return grouped.reduce(
      (acc, cur) => {
        acc.totalAll += cur.total;
        acc.lunasAll += cur.lunas;
        acc.sisaAll += cur.sisa;
        return acc;
      },
      { totalAll: 0, lunasAll: 0, sisaAll: 0 }
    );
  }, [grouped]);

  return (
    <div className="p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Rekap Tagihan</h1>

        <div className="bg-white p-4 rounded shadow mb-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nama..."
              className="p-2 border rounded"
            />
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600">Minimal persen lunas:</label>
              <input
                type="number"
                value={filterPercentMin}
                onChange={(e) => setFilterPercentMin(Number(e.target.value || 0))}
                className="p-2 border rounded w-20"
                min={0}
                max={100}
              />
            </div>
            <div className="flex items-center gap-2">
              <div className="text-sm text-gray-600">Total siswa:</div>
              <div className="font-semibold">{grouped.length}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-3 bg-gray-50 rounded">
              <div className="text-sm text-gray-500">Total Semua Tagihan</div>
              <div className="text-xl font-bold">{formatRp(totals.totalAll)}</div>
            </div>
            <div className="p-3 bg-gray-50 rounded">
              <div className="text-sm text-gray-500">Total Terbayar</div>
              <div className="text-xl font-bold text-green-600">{formatRp(totals.lunasAll)}</div>
            </div>
            <div className="p-3 bg-gray-50 rounded">
              <div className="text-sm text-gray-500">Sisa</div>
              <div className="text-xl font-bold text-red-600">{formatRp(totals.sisaAll)}</div>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded shadow">
          {loading ? (
            <div className="p-6 text-center text-gray-600">Memuat rekap...</div>
          ) : filtered.length === 0 ? (
            <div className="p-6 text-center text-gray-600">Tidak ada hasil</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-2 border">No</th>
                    <th className="p-2 border">Nama</th>
                    <th className="p-2 border text-right">Total</th>
                    <th className="p-2 border text-right">Lunas</th>
                    <th className="p-2 border text-right">Sisa</th>
                    <th className="p-2 border text-center">%</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((r, i) => (
                    <tr key={r.nama} className="odd:bg-white even:bg-gray-50">
                      <td className="p-2 border">{i + 1}</td>
                      <td className="p-2 border">{r.nama}</td>
                      <td className="p-2 border text-right">{formatRp(r.total)}</td>
                      <td className="p-2 border text-right text-green-600">{formatRp(r.lunas)}</td>
                      <td className="p-2 border text-right text-red-600">{formatRp(r.sisa)}</td>
                      <td className="p-2 border text-center font-bold">{r.persen}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="mt-4 text-sm text-gray-500">
          Catatan: Rekap ini menghitung berdasarkan field <code>jumlah</code> dan <code>status</code> pada endpoint <code>/tagihan</code>.
        </div>
      </div>
    </div>
  );
}
