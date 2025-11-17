import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const API = "http://localhost:5000/kategoridata";

export default function Ambatigori() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");

  const navigate = useNavigate();

  const fetchAll = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API);

      setList(Array.isArray(res.data) ? res.data : []);
    } catch {
      Swal.fire("Error", "Gagal memuat data", "error");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const filtered = useMemo(() => {
    const s = q.toLowerCase().trim();
    if (!s) return list;

    return list.filter((i) =>
      [i.nama, i.ket, i.alamat, i.hp].some((x) =>
        (x || "").toLowerCase().includes(s)
      )
    );
  }, [q, list]);

  const handleDelete = async (id) => {
    const ok = await Swal.fire({
      icon: "warning",
      title: "Hapus data ini?",
      text: "Data yang dihapus tidak bisa dikembalikan!",
      showCancelButton: true,
      confirmButtonText: "Ya, Hapus",
      cancelButtonText: "Batal",
    });

    if (!ok.isConfirmed) return;

    try {
      await axios.delete(`${API}/${id}`);
      Swal.fire("Berhasil!", "Data berhasil dihapus", "success");
      fetchAll();
    } catch {
      Swal.fire("Error", "Gagal menghapus data", "error");
    }
  };

  return (
    <div className="p-6 ml-55 min-h-screen bg-gray-50">
      
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-extrabold text-blue-700 flex items-center gap-2">
          📂 Kategori Data
        </h2>

        <button
          onClick={() => navigate("/kategori-data/tambah")}
          className="px-5 py-2 bg-blue-600 hover:bg-blue-700 transition text-white rounded-xl shadow active:scale-95"
        >
          + Tambah Data
        </button>
      </div>

      {/* Search Box */}
      <div className="mb-5">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="🔍 Cari kategori..."
          className="border p-3 rounded-xl w-80 shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
        />
      </div>

      {/* CARD CONTAINER */}
      <div className="bg-white shadow-xl rounded-2xl border border-blue-100 overflow-hidden">

        {/* LOADING */}
        {loading ? (
          <div className="p-6 text-center text-gray-500">⏳ Memuat data...</div>
        ) : filtered.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            Tidak ada data ditemukan.
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="p-3 text-left">Nama</th>
                <th className="p-3 text-left">Keterangan</th>
                <th className="p-3 text-left">Alamat</th>
                <th className="p-3 text-left">HP</th>
                <th className="p-3 text-center">Aksi</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((d, i) => (
                <tr
                  key={d.id}
                  className="border-b hover:bg-blue-50 transition"
                >
                  <td className="p-3 font-semibold text-blue-700">{d.nama}</td>
                  <td className="p-3">
                    {d.ket ? (
                      d.ket
                    ) : (
                      <span className="px-2 py-1 bg-gray-200 text-gray-600 rounded text-xs">
                        Tidak ada keterangan
                      </span>
                    )}
                  </td>
                  <td className="p-3">{d.alamat || "-"}</td>
                  <td className="p-3">{d.hp || "-"}</td>

                  <td className="p-3">
                    <div className="flex justify-center gap-3">

                      {/* EDIT BUTTON */}
                      <button
                        onClick={() => navigate(`/kategori-data/edit/${d.id}`)}
                        className="px-3 py-1 bg-yellow-400 hover:bg-yellow-500 text-white rounded shadow"
                      >
                        ✏ Edit
                      </button>

                      {/* DELETE BUTTON */}
                      <button
                        onClick={() => handleDelete(d.id)}
                        className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded shadow"
                      >
                        🗑 Hapus
                      </button>
                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        )}

      </div>
    </div>
  );
}
