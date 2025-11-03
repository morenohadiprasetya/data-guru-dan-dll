import React, { useEffect, useState } from "react";
import Sidnav from "./Sidnav";
import { useNavigate } from "react-router-dom";
import "remixicon/fonts/remixicon.css";

export default function Dashboard() {
  const nav = useNavigate();
  const [data, setData] = useState({
    siswa: [],
    guru: [],
    karyawan: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function fetchAll() {
      try {
        setLoading(true);
        const [resSiswa, resGuru, resKaryawan] = await Promise.all([
          fetch("http://localhost:5000/siswa").then((r) => (r.ok ? r.json() : [])),
          fetch("http://localhost:5000/guru").then((r) => (r.ok ? r.json() : [])),
          fetch("http://localhost:5000/karyawan").then((r) => (r.ok ? r.json() : [])),
        ]);
        if (!mounted) return;
        setData({
          siswa: Array.isArray(resSiswa) ? resSiswa : [],
          guru: Array.isArray(resGuru) ? resGuru : [],
          karyawan: Array.isArray(resKaryawan) ? resKaryawan : [],
        });
      } catch (err) {
        console.error("Fetch dashboard error:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    fetchAll();
    return () => (mounted = false);
  }, []);

  const stats = [
    { title: "Total Siswa", value: data.siswa.length, icon: "ri-user-3-line", color: "from-blue-500 to-blue-600" },
    { title: "Total Guru", value: data.guru.length, icon: "ri-user-star-line", color: "from-indigo-500 to-indigo-600" },
    { title: "Total Karyawan", value: data.karyawan.length, icon: "ri-building-4-line", color: "from-emerald-500 to-emerald-600" },
    { title: "Total Tagihan", value: 0, icon: "ri-wallet-3-line", color: "from-yellow-500 to-yellow-600" },
    { title: "Total Lunas", value: 0, icon: "ri-check-double-line", color: "from-green-500 to-green-600" },
    { title: "Total Belum Lunas", value: 0, icon: "ri-close-circle-line", color: "from-red-500 to-red-600" },
  ];

  return (
    <div className="flex ">
      <Sidnav />

      
      <div className="flex-1 ml-48 p-1 bg-gradient-to-b from-blue-50 to-white min-h-screen">
        <h1 className="text-3xl font-extrabold text-blue-300 mb-6 flex items-center gap-2">
          <i className="ri-dashboard-3-line text-blue-700"></i> Dashboard Sekolah
        </h1>

        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
          {stats.map((s, i) => (
            <div
              key={i}
              className={`rounded-xl p-5 shadow bg-gradient-to-br ${s.color} text-white flex items-center gap-4`}
            >
              <div className="p-3 mr-1 bg-white/20 rounded-lg">
                <i className={`${s.icon} text-2xl`}></i>
              </div>
              <div>
                <p className="text-sm font-medium">{s.title}</p>
                <h2 className="text-2xl font-extrabold">{loading ? "..." : s.value}</h2>
              </div>
            </div>
          ))}
        </div>

       
        <div className="space-y-8">
          <DataPreview
            title="Data Siswa"
            data={data.siswa}
            kategori="Siswa"
            loading={loading}
            onSelengkapnya={() => nav("/Apo?kategori=Siswa")}
          />
          <DataPreview
            title="Data Guru"
            data={data.guru}
            kategori="Guru"
            loading={loading}
            onSelengkapnya={() => nav("/Apo?kategori=Guru")}
          />
          <DataPreview
            title="Data Karyawan"
            data={data.karyawan}
            kategori="Karyawan"
            loading={loading}
            onSelengkapnya={() => nav("/Apo?kategori=Karyawan")}
          />
        </div>
      </div>
    </div>
  );
}

function DataPreview({ title, data, kategori, loading, onSelengkapnya }) {
  return (
    <div className="bg-white border border-blue-100 rounded-xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-blue-900 flex items-center gap-2">
          <i className="ri-file-list-3-line text-blue-600"></i> {title}
        </h3>
        <button
          onClick={onSelengkapnya}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm"
        >
          Selengkapnya
        </button>
      </div>

      {loading ? (
        <div className="text-center text-blue-600 py-6">⏳ Memuat data...</div>
      ) : data.length === 0 ? (
        <div className="text-center text-blue-500 py-6">Tidak ada data.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-blue-900 border border-blue-200">
            <thead className="bg-blue-50 text-blue-800">
              <tr>
                <th className="p-3 text-left border border-blue-200">No</th>
                <th className="p-3 text-left border border-blue-200">Nama</th>
                <th className="p-3 text-left border border-blue-200">
                  {kategori === "Siswa"
                    ? "Kelas"
                    : kategori === "Guru"
                    ? "Mapel"
                    : "Jabatan"}
                </th>
                <th className="p-3 text-left border border-blue-200">Alamat</th>
                <th className="p-3 text-left border border-blue-200">No HP</th>
              </tr>
            </thead>
            <tbody>
              {data.slice(0, 5).map((item, i) => (
                <tr
                  key={i}
                  className={`${
                    i % 2 === 0 ? "bg-white" : "bg-blue-50"
                  } hover:bg-blue-100 transition`}
                >
                  <td className="p-3 border border-blue-200">{i + 1}</td>
                  <td className="p-3 border border-blue-200">{item.nama}</td>
                  <td className="p-3 border border-blue-200">{item.ket}</td>
                  <td className="p-3 border border-blue-200">{item.alamat}</td>
                  <td className="p-3 border border-blue-200">{item.hp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
