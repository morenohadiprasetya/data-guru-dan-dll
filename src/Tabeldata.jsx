import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "remixicon/fonts/remixicon.css";

export default function Apo() {
  const nav = useNavigate();
  const loc = useLocation();
  const q = new URLSearchParams(loc.search);
  const activeKategori = q.get("kategori") || "Siswa";

  const [data, setData] = useState({ Siswa: [], Guru: [], Karyawan: [] });
  const [loading, setLoading] = useState(true);
  const [kategori, setKategori] = useState(activeKategori);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setKategori(activeKategori);
  }, [activeKategori]);

  useEffect(() => {
    let mounted = true;
    async function fetchData() {
      try {
        setLoading(true);
        const [s, g, k] = await Promise.all([
          fetch("http://localhost:5000/siswa").then((r) => (r.ok ? r.json() : [])),
          fetch("http://localhost:5000/guru").then((r) => (r.ok ? r.json() : [])),
          fetch("http://localhost:5000/karyawan").then((r) => (r.ok ? r.json() : [])),
        ]);
        if (!mounted) return;
        setData({
          Siswa: Array.isArray(s) ? s : [],
          Guru: Array.isArray(g) ? g : [],
          Karyawan: Array.isArray(k) ? k : [],
        });
      } catch (err) {
        console.error("Apo fetch error:", err);
        setData({ Siswa: [], Guru: [], Karyawan: [] });
      } finally {
        if (mounted) setLoading(false);
      }
    }
    fetchData();
    return () => (mounted = false);
  }, []);

  const list = data[kategori] || [];
  const filtered = list.filter((it) =>
    `${it.nama ?? ""} ${it.ket ?? ""} ${it.alamat ?? ""} ${it.hp ?? ""}`
      .toLowerCase()
      .includes(search.trim().toLowerCase())
  );

  function handleKategoriChange(k) {
    setKategori(k);
    nav(`/Apo?kategori=${k}`);
  }

  async function handleDelete(id, name) {
    const res = await Swal.fire({
      title: `Hapus ${name}?`,
      text: "Data akan dihapus permanen",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus",
      cancelButtonText: "Batal",
    });

    if (!res.isConfirmed) return;

    try {
      const resp = await fetch(`http://localhost:5000/${kategori.toLowerCase()}/${id}`, {
        method: "DELETE",
      });
      if (!resp.ok) throw new Error("Gagal menghapus");
      Swal.fire("Terhapus", `${name} berhasil dihapus`, "success");

      setData((prev) => ({
        ...prev,
        [kategori]: prev[kategori].filter((x) => x.id !== id),
      }));
    } catch (err) {
      console.error(err);
      Swal.fire("Gagal", "Tidak dapat menghapus data.", "error");
    }
  }

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="max-w-full mx-auto">
       
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <h2 className="text-2xl font-bold text-blue-900 flex items-center gap-2">
            <i className="ri-file-list-3-line text-blue-700"></i>
           Tabel Data {kategori}
          </h2>

          <button
            onClick={() => nav(`/Ta?kategori=${kategori}`)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow"
          >
            <i className="ri-add-circle-line text-lg"></i>
            Tambah Data
          </button>
        </div>

        
        <div className="bg-white p-4 rounded-xl shadow-md border border-blue-100 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 text-sm text-blue-700 font-medium">
                <i className="ri-filter-3-line text-blue-600"></i> Kategori:
              </label>
              <select
                className="rounded-md border border-blue-300 px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                value={kategori}
                onChange={(e) => handleKategoriChange(e.target.value)}
              >
                <option value="Siswa">Siswa</option>
                <option value="Guru">Guru</option>
                <option value="Karyawan">Karyawan</option>
              </select>
            </div>

            <div className="relative w-full md:w-72">
              <input
                placeholder="Cari nama / keterangan / alamat..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 pr-3 py-2 rounded-md border border-blue-300 w-full bg-blue-50 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
              <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-blue-500"></i>
            </div>
          </div>
        </div>

    
        <div className="bg-white p-5 rounded-xl shadow-md border border-blue-100">
          {loading ? (
            <div className="py-12 text-center text-blue-600">⏳ Memuat data...</div>
          ) : filtered.length === 0 ? (
            <div className="py-12 text-center text-blue-600">Tidak ada data ditemukan.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-blue-900 border border-blue-200">
                <thead className="bg-blue-50 text-blue-800">
                  <tr>
                    <th className="p-3 text-left font-bold border border-blue-200">No</th>
                    <th className="p-3 text-left font-bold border border-blue-200">Nama</th>
                    <th className="p-3 text-left font-bold border border-blue-200">
                      {kategori === "Siswa"
                        ? "Kelas"
                        : kategori === "Guru"
                        ? "Mapel"
                        : "Jabatan"}
                    </th>
                    <th className="p-3 text-left font-semibold border border-blue-200">Alamat</th>
                    <th className="p-3 text-left font-semibold border border-blue-200">No HP</th>
                    <th className="p-3 text-center font-semibold border border-blue-200">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((item, idx) => (
                    <tr
                      key={item.id ?? idx}
                      className={`transition-all duration-150 ${
                        idx % 2 === 0 ? "bg-white" : "bg-blue-50"
                      } hover:bg-blue-100`}
                    >
                      <td className="p-3 border border-blue-200">{idx + 1}</td>
                      <td className="p-3 border border-blue-200 font-medium">{item.nama}</td>
                      <td className="p-3 border border-blue-200">{item.ket}</td>
                      <td className="p-3 border border-blue-200">{item.alamat}</td>
                      <td className="p-3 border border-blue-200">{item.hp}</td>
                      <td className="p-3 border border-blue-200 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Link
                            to={`/Edit?id=${item.id}&kategori=${kategori}`}
                            className="px-2 py-1 rounded-md bg-yellow-400 hover:bg-yellow-500 text-white transition-all"
                          >
                            <i className="ri-edit-2-line"></i>
                          </Link>
                          <button
                            onClick={() => handleDelete(item.id, item.nama)}
                            className="px-2 py-1 rounded-md bg-red-500 hover:bg-red-600 text-white transition-all"
                          >
                            <i className="ri-delete-bin-6-line"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
