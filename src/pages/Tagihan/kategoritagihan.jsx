import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const API = "http://localhost:5000/kategoriTagihan";

export default function KategoriTagihan() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [q, setQ] = useState("");
  const [sortBy, setSortBy] = useState("nama");
  const [order, setOrder] = useState("asc");
  const [page, setPage] = useState(1);
  const perPage = 8;

  const navigate = useNavigate();

  const fetchAll = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(API);
      setItems(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setError("Gagal mengambil data kategori tagihan.");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const filtered = useMemo(() => {
    let data = [...items];

    if (q.trim()) {
      const s = q.toLowerCase();
      data = data.filter(
        (x) =>
          (x.nama || "").toLowerCase().includes(s) ||
          (x.tipe || "").toLowerCase().includes(s) ||
          (x.deskripsi || "").toLowerCase().includes(s) ||
          (x.kelas || "").toLowerCase().includes(s)
      );
    }

    data.sort((a, b) => {
      let A = (a[sortBy] || "").toString().toLowerCase();
      let B = (b[sortBy] || "").toString().toLowerCase();

      if (A === B) return 0;
      return order === "asc" ? (A > B ? 1 : -1) : A < B ? 1 : -1;
    });

    return data;
  }, [items, q, sortBy, order]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const start = (page - 1) * perPage;
  const pageItems = filtered.slice(start, start + perPage);

  const toggleSort = (field) => {
    if (sortBy === field) {
      setOrder(order === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setOrder("asc");
    }
  };

  const handleDelete = async (id) => {
    const ok = await Swal.fire({
      title: "Hapus kategori?",
      text: "Data akan dihapus permanen.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Hapus",
    });

    if (!ok.isConfirmed) return;

    try {
      await axios.delete(`${API}/${id}`);
      Swal.fire("Berhasil", "Kategori berhasil dihapus", "success");
      fetchAll();
    } catch (err) {
      Swal.fire("Error", "Gagal menghapus kategori", "error");
    }
  };

  return (
    <div className="p-6 ml-55 min-h-screen bg-gray-50">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-extrabold text-blue-700">
          📑 Kategori Tagihan
        </h1>

        <button
          onClick={() => navigate("/tmbh")}
          className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded shadow active:scale-95 transition"
        >
          + Tambah
        </button>
      </div>

      {/* SEARCH CARD */}
      <div className="bg-white p-4 rounded-xl shadow-md border border-blue-100 mb-5">
        <div className="flex flex-col sm:flex-row justify-between gap-3">
          <input
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setPage(1);
            }}
            placeholder="🔍 Cari nama, tipe, kelas..."
            className="border p-3 rounded-xl w-72 shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />

           
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white shadow-xl rounded-2xl border border-blue-100 overflow-hidden">
        {loading ? (
          <div className="p-6 text-center text-gray-500">
            ⏳ Memuat kategori...
          </div>
        ) : error ? (
          <div className="p-6 text-red-500">{error}</div>
        ) : filtered.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            Belum ada kategori ditemukan.
          </div>
        ) : (
          <>
            <table className="w-full table-auto">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="p-3">No</th>
                  <th
                    onClick={() => toggleSort("nama")}
                    className="p-3 cursor-pointer"
                  >
                    Nama kategori
                  </th>
                  <th
                    onClick={() => toggleSort("tipe")}
                    className="p-3 cursor-pointer"
                  >
                    Tipe {sortBy === "tipe" ? (order === "asc" ? "⬆" : "⬇") : ""}
                  </th>
                  <th className="p-3">Keterangan</th>
                 
                  <th className="p-3 text-center">Aksi</th>
                </tr>
              </thead>

              <tbody>
                {pageItems.map((x, i) => (
                  <tr key={x.id} className="border-b hover:bg-blue-50 transition">
                    <td className="p-3">{start + i + 1}</td>
                    <td className="p-3 font-semibold text-blue-700">{x.nama}</td>
                    <td className="p-3">{x.tipe}</td>
                    <td className="p-3">{x.deskripsi}</td>
                

                    <td className="p-3 text-center">
                      <div className="inline-flex gap-2">
                        <button
                          onClick={() => navigate(`/Ekategori/${x.id}`)}
                          className="px-3 py-1 bg-yellow-400 hover:bg-yellow-500 text-white rounded shadow"
                        >
                          ✏ Edit
                        </button>

                        <button
                          onClick={() => handleDelete(x.id)}
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

            {/* PAGINATION */}
            <div className="p-4 flex justify-between items-center bg-gray-50">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className={`px-4 py-2 rounded-lg shadow ${
                  page === 1
                    ? "bg-gray-200"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              ></button>

              {/* Bagian angka 1/1 sudah DIHAPUS TOTAL */}

              <button
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
                className={`px-4 py-2 rounded-lg shadow ${
                  page === totalPages
                    ? "bg-gray-200"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              ></button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
