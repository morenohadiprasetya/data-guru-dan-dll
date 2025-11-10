import React, { useEffect, useState } from "react";

const API = "http://localhost:5000";

function formatRp(n = 0) {
  try {
    return "Rp " + Number(n).toLocaleString();
  } catch {
    return "Rp 0";
  }
}

export default function RekapTagihan() {
  const [rekap, setRekap] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterNama, setFilterNama] = useState("");
  const [filterKelas, setFilterKelas] = useState("");
  const [sortBy, setSortBy] = useState("nama");
  const [sortOrder, setSortOrder] = useState("asc");

  useEffect(() => {
    loadRekap();
  }, []);

  const loadRekap = async () => {
    try {
      const [tagihanRes, siswaRes] = await Promise.all([
        fetch(`${API}/tagihan`),
        fetch(`${API}/siswa`),
      ]);

      const tagihan = await tagihanRes.json();
      const siswa = await siswaRes.json();

      const merged = tagihan.map((t) => {
        const sw = siswa.find((s) => s.id === t.siswaId) || {};
        return {
          ...t,
          namaSiswa: sw.nama || t.nama || "-",
          ket: sw.ket || t.kelas || "-",
        };
      });

      const perSiswa = Object.values(
        merged.reduce((acc, item) => {
          if (!acc[item.siswaId]) {
            acc[item.siswaId] = {
              siswaId: item.siswaId,
              nama: item.namaSiswa,
              ket: item.ket,
              total: 0,
              lunas: 0,
              sisa: 0,
              persen: 0,
              list: [],
            };
          }

          acc[item.siswaId].total += Number(item.jumlah || 0);

          if (item.status === "Lunas") {
            acc[item.siswaId].lunas += Number(item.jumlahAsli || item.jumlah || 0);
          }

          acc[item.siswaId].sisa = acc[item.siswaId].total - acc[item.siswaId].lunas;

          acc[item.siswaId].persen =
            acc[item.siswaId].total > 0
              ? Math.round((acc[item.siswaId].lunas / acc[item.siswaId].total) * 100)
              : 0;

          acc[item.siswaId].list.push(item);

          return acc;
        }, {})
      );

      setRekap(perSiswa);
      setLoading(false);
    } catch (err) {
      console.error("Gagal memuat rekap:", err);
      setLoading(false);
    }
  };

  const filteredRekap = rekap
    .filter((r) => r.nama.toLowerCase().includes(filterNama.toLowerCase()))
    .filter((r) => r.ket.toLowerCase().includes(filterKelas.toLowerCase()))
    .sort((a, b) => {
      const x = a[sortBy];
      const y = b[sortBy];

      if (typeof x === "string") {
        return sortOrder === "asc" ? x.localeCompare(y) : y.localeCompare(x);
      }

      return sortOrder === "asc" ? x - y : y - x;
    });

  const changeSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  return (
    <div className="p-6 bg-gradient-to-br from-blue-50 ml-45 to-blue-100 min-h-screen">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl p-8 shadow-lg border border-blue-200">
        <h1 className="text-3xl font-bold text-blue-700 text-center mb-6">📊 Rekap Tagihan Siswa</h1>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg shadow border border-blue-200">
            <p className="text-gray-600 text-sm">Jumlah Siswa</p>
            <h2 className="text-xl font-bold">{rekap.length}</h2>
          </div>

          <div className="bg-green-50 p-4 rounded-lg shadow border border-green-200">
            <p className="text-gray-600 text-sm">Total Lunas</p>
            <h2 className="text-xl font-bold">{formatRp(rekap.reduce((a, b) => a + b.lunas, 0))}</h2>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg shadow border border-yellow-300">
            <p className="text-gray-600 text-sm">Total Sisa</p>
            <h2 className="text-xl font-bold">{formatRp(rekap.reduce((a, b) => a + b.sisa, 0))}</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <input
            type="text"
            placeholder="Cari nama siswa..."
            value={filterNama}
            onChange={(e) => setFilterNama(e.target.value)}
            className="p-2 border rounded shadow-sm"
          />

          <input
            type="text"
            placeholder="Filter kelas / keterangan..."
            value={filterKelas}
            onChange={(e) => setFilterKelas(e.target.value)}
            className="p-2 border rounded shadow-sm"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead className="bg-blue-200 text-blue-900 select-none">
              <tr>
                <th className="p-2 border cursor-pointer" onClick={() => changeSort("nama")}>Nama</th>
                <th className="p-2 border cursor-pointer" onClick={() => changeSort("ket")}>Keterangan</th>
                <th className="p-2 border text-right cursor-pointer" onClick={() => changeSort("total")}>Total</th>
                <th className="p-2 border text-right cursor-pointer" onClick={() => changeSort("lunas")}>Lunas</th>
                <th className="p-2 border text-right cursor-pointer" onClick={() => changeSort("sisa")}>Sisa</th>
                <th className="p-2 border text-center cursor-pointer" onClick={() => changeSort("persen")}>%</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="p-4 text-center text-gray-500">Memuat...</td>
                </tr>
              ) : filteredRekap.length > 0 ? (
                filteredRekap.map((r, i) => (
                  <tr key={i} className="hover:bg-blue-50">
                    <td className="border p-2">{r.nama}</td>
                    <td className="border p-2">{r.ket}</td>
                    <td className="border p-2 text-right">{formatRp(r.total)}</td>
                    <td className="border p-2 text-right text-green-600">{formatRp(r.lunas)}</td>
                    <td className="border p-2 text-right text-red-600">{formatRp(r.sisa)}</td>
                    <td className="border p-2 text-center font-bold">{r.persen}%</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="p-4 text-center text-gray-500">Tidak ada data</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}