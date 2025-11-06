import React, { useEffect, useState } from "react";

export default function RekapTagihan() {
  const [rekap, setRekap] = useState([]);
  const [tagihan, setTagihan] = useState([]);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      const [tagihanRes, siswaRes] = await Promise.all([
        fetch("http://localhost:5000/tagihan"),
        fetch("http://localhost:5000/siswa"),
      ]);

      const tagihanData = await tagihanRes.json();
      const siswaData = await siswaRes.json();

      setTagihan(tagihanData);

      // Hanya siswa yang punya tagihan
      const grouped = siswaData
        .filter(s => tagihanData.some(t => t.siswaId === s.id))
        .map(s => {
          const tagihanSiswa = tagihanData.filter(t => t.siswaId === s.id);
          const total = tagihanSiswa.reduce((sum, t) => sum + t.jumlah, 0);
          const lunas = tagihanSiswa
            .filter(t => t.status === "Lunas")
            .reduce((sum, t) => sum + t.jumlah, 0);
          const sisa = total - lunas;
          const persen = total > 0 ? Math.round((lunas / total) * 100) : 0;

          return {
            id: s.id,
            nama: s.nama,
            total,
            lunas,
            sisa,
            persen,
          };
        });

      setRekap(grouped);
    } catch (error) {
      console.error("Gagal ambil data:", error);
    }
  };

  return (
    <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl p-8 shadow-lg">
        <h1 className="text-3xl font-bold text-blue-700 text-center mb-6">
          📊 Rekap Tagihan Siswa
        </h1>

        <table className="w-full border text-sm">
          <thead className="bg-blue-200 text-blue-900">
            <tr>
              <th className="p-2 border">No</th>
              <th className="p-2 border">Nama Siswa</th>
              <th className="p-2 border">Total Tagihan</th>
              <th className="p-2 border">Sudah Lunas</th>
              <th className="p-2 border">Sisa</th>
              <th className="p-2 border">Persentase</th>
            </tr>
          </thead>
          <tbody>
            {rekap.length > 0 ? (
              rekap.map((r, i) => (
                <tr key={r.id} className="hover:bg-blue-50">
                  <td className="border p-2 text-center">{i + 1}</td>
                  <td className="border p-2">{r.nama}</td>
                  <td className="border p-2">Rp {r.total.toLocaleString()}</td>
                  <td className="border p-2 text-green-600">Rp {r.lunas.toLocaleString()}</td>
                  <td className="border p-2 text-red-600">Rp {r.sisa.toLocaleString()}</td>
                  <td className="border p-2 text-center">{r.persen}%</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center p-4 text-gray-600">
                  Tidak ada siswa dengan tagihan
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
