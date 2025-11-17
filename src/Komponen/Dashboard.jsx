import React, { useEffect, useState } from "react";
import Sidnav from "./sidnav";
import { useNavigate } from "react-router-dom";
import "remixicon/fonts/remixicon.css";

export default function Dashboard() {
  const nav = useNavigate();
  const [data, setData] = useState({
    siswa: [],
    guru: [],
    karyawan: [],
  });

  useEffect(() => {
    async function fetchAll() {
      try {
        const [resSiswa, resGuru, resKaryawan] = await Promise.all([
          fetch("http://localhost:5000/siswa").then((r) => (r.ok ? r.json() : [])),
          fetch("http://localhost:5000/guru").then((r) => (r.ok ? r.json() : [])),
          fetch("http://localhost:5000/karyawan").then((r) => (r.ok ? r.json() : [])),
        ]);
        setData({ siswa: resSiswa, guru: resGuru, karyawan: resKaryawan });
      } catch (e) {
        console.error("Fetch error:", e);
      }
    }
    fetchAll();
  }, []);

  const totalSiswa = data.siswa.length || 0;
  const totalGuru = data.guru.length || 0;
  const totalKaryawan = data.karyawan.length || 0;
  const total = totalSiswa + totalGuru + totalKaryawan;

  const handleSelengkapnya = (kategori) => {
    nav(`/Apo?kategori=${kategori}`);
  };

  return (
    <div className="flex">
      <Sidnav />

      <div className="flex-1 ml-48 p-8 bg-gray-50 min-h-screen">
        {/* TITLE DASHBOARD */}
        <h1 className="text-3xl font-extrabold text-blue-700 mb-10 flex items-center gap-3">
          <i className="ri-dashboard-3-line text-blue-600"></i> Dashboard Sekolah
        </h1>

        {/* ======================= CARD SUMMARY ======================= */}
        <div className="flex flex-wrap justify-center gap-6 mb-12">

          {[
            { color: "bg-green-500", icon: "ri-user-3-line", label: "Siswa", total: totalSiswa },
            { color: "bg-blue-500", icon: "ri-user-star-line", label: "Guru", total: totalGuru },
            { color: "bg-yellow-500", icon: "ri-building-4-line", label: "Karyawan", total: totalKaryawan },
          ].map((item, i) => (
            <div
              key={i}
              className={`${item.color} text-white rounded-2xl shadow-lg p-6 w-44 flex flex-col justify-center items-center hover:scale-105 transition-transform duration-200`}
            >
              <i className={`${item.icon} text-4xl mb-2`}></i>
              <h2 className="font-semibold text-md">{item.label}</h2>
              <p className="text-3xl font-bold mt-1">{item.total}</p>
            </div>
          ))}

          {/* TOTAL */}
          <div className="bg-purple-500 text-white rounded-2xl shadow-lg p-6 w-44 flex flex-col justify-center items-center hover:scale-105 transition-transform duration-200">
            <i className="ri-equalizer-line text-4xl mb-2"></i>
            <h2 className="font-semibold text-md">Total</h2>
            <p className="text-3xl font-bold mt-1">{total}</p>
          </div>
        </div>

        {/* ======================= TABEL SISWA ======================= */}
        <div className="bg-white rounded shadow-md p-6 mb-10">
          <h3 className="font-bold text-lg text-gray-700 mb-3">Data Siswa</h3>
          <div className="max-h-56 overflow-y-auto border border-gray-200 rounded-lg">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 sticky top-0">
                <tr>
                  <th className="p-2 border border-gray-300 text-left">Nama</th>
                  <th className="p-2 border border-gray-300 text-left">Kelas</th>
                  <th className="p-2 border border-gray-300 text-left">Status</th>
                </tr>
              </thead>

              <tbody>
                {(data.siswa.length ? data.siswa : [
                  { nama: "Budi", kelas: "XII IPA 1", status: "Aktif" },
                  { nama: "Ani", kelas: "XI IPS 2", status: "Aktif" },
                ]).map((s, i) => (
                  <tr key={i} className="odd:bg-white even:bg-gray-50 hover:bg-blue-50">
                    <td className="p-2 border border-gray-200">{s.nama}</td>
                    <td className="p-2 border border-gray-200">{s.kelas || s.ket || "-"}</td>
                    <td className="p-2 border border-gray-200">{s.status || "Aktif"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button
            onClick={() => handleSelengkapnya("Siswa")}
            className="mt-3 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition text-sm"
          >
            Selengkapnya
          </button>
        </div>

        {/* ======================= TABEL GURU ======================= */}
        <div className="bg-white rounded shadow-md p-6 mb-10">
          <h3 className="font-bold text-lg text-gray-700 mb-3">Data Guru</h3>

          <div className="max-h-56 overflow-y-auto border border-gray-200 rounded-lg">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 sticky top-0">
                <tr>
                  <th className="p-2 border border-gray-300 text-left">Nama</th>
                  <th className="p-2 border border-gray-300 text-left">Mapel</th>
                  <th className="p-2 border border-gray-300 text-left">Status</th>
                </tr>
              </thead>

              <tbody>
                {(data.guru.length ? data.guru : [
                  { nama: "Ibu Siti", ket: "Matematika", status: "Aktif" },
                  { nama: "Pak Deni", ket: "Bahasa Inggris", status: "Aktif" },
                ]).map((g, i) => (
                  <tr key={i} className="odd:bg-white even:bg-gray-50 hover:bg-blue-50">
                    <td className="p-2 border border-gray-200">{g.nama}</td>
                    <td className="p-2 border border-gray-200">{g.ket}</td>
                    <td className="p-2 border border-gray-200">{g.status || "Aktif"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button
            onClick={() => handleSelengkapnya("Guru")}
            className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition text-sm"
          >
            Selengkapnya
          </button>
        </div>

        {/* ======================= TABEL KARYAWAN ======================= */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="font-bold text-lg text-gray-700 mb-3">Data Karyawan</h3>

          <div className="max-h-56 overflow-y-auto border border-gray-200 rounded-lg">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 sticky top-0">
                <tr>
                  <th className="p-2 border border-gray-300 text-left">Nama</th>
                  <th className="p-2 border border-gray-300 text-left">Jabatan</th>
                  <th className="p-2 border border-gray-300 text-left">Status</th>
                </tr>
              </thead>

              <tbody>
                {(data.karyawan.length ? data.karyawan : [
                  { nama: "Pak Joko", ket: "Staff TU", status: "Aktif" },
                  { nama: "Bu Nani", ket: "Kebersihan", status: "Aktif" },
                ]).map((k, i) => (
                  <tr key={i} className="odd:bg-white even:bg-gray-50 hover:bg-blue-50">
                    <td className="p-2 border border-gray-200">{k.nama}</td>
                    <td className="p-2 border border-gray-200">{k.ket || k.jabatan || "-"}</td>
                    <td className="p-2 border border-gray-200">{k.status || "Aktif"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button
            onClick={() => handleSelengkapnya("Karyawan")}
            className="mt-3 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition text-sm"
          >
            Selengkapnya
          </button>
        </div>
      </div>
    </div>
  );
}
