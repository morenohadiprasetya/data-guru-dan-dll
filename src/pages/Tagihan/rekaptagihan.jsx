import React, { useEffect, useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faReceipt } from "@fortawesome/free-solid-svg-icons";

const API = "http://localhost:5000/tagihan";

function formatRp(n = 0) {
  return "Rp " + Number(n).toLocaleString("id-ID");
}

export default function RekapTagihan() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

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

  // Grouping data
  const grouped = useMemo(() => {
    const map = {};

    data.forEach((t) => {
      const name = t.nama || "Unknown";

      if (!map[name]) {
        map[name] = { nama: name, total: 0, lunas: 0, sisa: 0 };
      }

      const jumlah = Number(t.jumlah || 0);
      map[name].total += jumlah;

      if ((t.status || "").toLowerCase() === "lunas") {
        map[name].lunas += jumlah;
      }

      map[name].sisa = map[name].total - map[name].lunas;
    });

    return Object.values(map).map((r) => ({
      ...r,
      persen: r.total > 0 ? Math.round((r.lunas / r.total) * 100) : 0,
    }));
  }, [data]);

  // Search filter
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return grouped
      .filter((r) => (q ? r.nama.toLowerCase().includes(q) : true))
      .sort((a, b) => b.total - a.total);
  }, [grouped, search]);

  // Total keseluruhan
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
    <div className="p-6 ml-55 mr-8">

      {/* HEADER */}
      <div className="flex items-center gap-3 mb-8">
        <FontAwesomeIcon icon={faReceipt} className="text-blue-600 text-3xl" />
        <h1 className="text-3xl font-semibold">Rekap Tagihan</h1>
      </div>

      {/* FILTER + SUMMARY */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-8">

        {/* Search */}
        <div className="mb-6">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="🔍 Cari nama siswa..."
            className="p-3 w-full rounded-xl bg-gray-100 border border-gray-300 
                       focus:ring-2 focus:ring-blue-400 outline-none transition"
          />
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <div className="p-6 bg-blue-50 border border-blue-200 rounded-xl shadow-sm">
            <p className="text-sm text-gray-600">Total Semua Tagihan</p>
            <p className="text-3xl font-bold">{formatRp(totals.totalAll)}</p>
          </div>

          <div className="p-6 bg-green-50 border border-green-200 rounded-xl shadow-sm">
            <p className="text-sm text-gray-600">Total Terbayar</p>
            <p className="text-3xl font-bold text-green-600">
              {formatRp(totals.lunasAll)}
            </p>
          </div>

          <div className="p-6 bg-red-50 border border-red-200 rounded-xl shadow-sm">
            <p className="text-sm text-gray-600">Total Sisa Pembayaran</p>
            <p className="text-3xl font-bold text-red-600">
              {formatRp(totals.sisaAll)}
            </p>
          </div>

        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-600">Memuat rekap...</div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center text-gray-600">Tidak ada data ditemukan</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">

              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="p-3">No</th>
                  <th className="p-3">Nama</th>
                  <th className="p-3 text-right">Total</th>
                  <th className="p-3 text-right">Lunas</th>
                  <th className="p-3 text-right">Sisa</th>
                  <th className="p-3 text-center">%</th>
                </tr>
              </thead>

              <tbody>
                {filtered.map((r, i) => (
                  <tr
                    key={r.nama}
                    className="odd:bg-white even:bg-gray-50 border-b 
                               hover:bg-blue-50 transition"
                  >
                    <td className="p-3">{i + 1}</td>
                    <td className="p-3 font-medium">{r.nama}</td>
                    <td className="p-3 text-right">{formatRp(r.total)}</td>
                    <td className="p-3 text-right text-green-600">{formatRp(r.lunas)}</td>
                    <td className="p-3 text-right text-red-600">{formatRp(r.sisa)}</td>
                    <td className="p-3 text-center font-bold">{r.persen}%</td>
                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        )}
      </div>

      {/* CATATAN */}
      <p className="mt-4 text-sm text-gray-500">
        Rekap dihitung berdasarkan field <code>jumlah</code> & <code>status</code> dari endpoint <code>/tagihan</code>.
      </p>
    </div>
  );
}
