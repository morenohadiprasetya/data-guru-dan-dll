// ==== CRUD Level (KategoriDataCRUD.jsx) ====
import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

export default function KategoriDataCRUD() {
  const API = "http://localhost:5000/kategoridata";

  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const navigate = useNavigate();

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API);
      setList(Array.isArray(res.data) ? res.data : []);
    } catch {
      Swal.fire("Error", "Gagal memuat data level!", "error");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ========= FILTERING ========
  const filtered = useMemo(() => {
    const s = q.toLowerCase();
    if (!s) return list;
    return list.filter((i) => (i.nama || "").toLowerCase().includes(s));
  }, [q, list]);

  // ========= DELETE ========
  const remove = async (id) => {
    const ok = await Swal.fire({
      icon: "warning",
      title: "Hapus Level?",
      text: "Level akan hilang permanen!",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus",
    });
    if (!ok.isConfirmed) return;

    try {
      await axios.delete(`${API}/${id}`);
      Swal.fire("Berhasil", "Level terhapus!", "success");
      fetchData();
    } catch {
      Swal.fire("Error", "Gagal menghapus level!", "error");
    }
  };

  return (
    <div className="p-6 ml-55 min-h-screen bg-gray-50">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-blue-700">📂 CRUD Level</h2>
        <button
          onClick={() => navigate("/kategori-data/tambah")}
          className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded shadow"
        >
          + Tambah Level
        </button>
      </div>

      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="🔍 Cari level..."
        className="border p-3 rounded-xl w-80 mb-4 shadow-sm"
      />

      <div className="bg-white shadow-lg rounded-xl border overflow-hidden">
        {loading ? (
          <div className="p-5 text-center text-gray-500">Memuat...</div>
        ) : filtered.length === 0 ? (
          <div className="p-5 text-center text-gray-500">Tidak ada level.</div>
        ) : (
          <table className="w-full">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="p-3 text-left w-16">No</th>
                <th className="p-3 text-left">Nama Level</th>
                <th className="p-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((d, i) => (
                <tr key={d.id} className="border-b hover:bg-blue-50">
                  <td className="p-3 text-left font-bold">{i + 1}</td>

                  <td className="p-3 font-semibold">{d.nama}</td>

                  <td className="p-3">
                    <div className="flex justify-center gap-3">
                      <button
                        onClick={() => navigate(`/kategori-data/edit/${d.id}`)}
                        className="px-3 py-1 bg-yellow-400 hover:bg-yellow-500 text-white rounded"
                      >
                        ✏ Edit
                      </button>

                      <button
                        onClick={() => remove(d.id)}
                        className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded"
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
