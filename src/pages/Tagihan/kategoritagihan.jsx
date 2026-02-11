import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../api/api";

const API = `${BASE_URL}/api/kategori-tagihan`;

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
          (x.deskripsi || "").toLowerCase().includes(s)
      );
    }

    data.sort((a, b) => {
      const A = (a[sortBy] ?? "").toString().toLowerCase();
      const B = (b[sortBy] ?? "").toString().toLowerCase();
      return order === "asc" ? A.localeCompare(B) : B.localeCompare(A);
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
    } catch {
      Swal.fire("Error", "Gagal menghapus kategori", "error");
    }
  };

  return (
    <div className="p-6 ml-55 min-h-screen bg-gray-50">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-extrabold text-blue-700">
          Kategori Tagihan
        </h1>

        <button
          onClick={() => navigate("/tmbh")}
          className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded shadow"
        >
          + Tambah
        </button>
      </div>

      {/* SEARCH */}
      <div className="bg-white p-4 rounded-xl shadow-md mb-5">
        <input
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setPage(1);
          }}
          placeholder="Cari nama, tipe, keterangan..."
          className="border p-3 rounded-xl w-72"
        />
      </div>

      {/* TABLE */}
      <div className="bg-white shadow rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-6 text-center">Memuat data...</div>
        ) : error ? (
          <div className="p-6 text-red-500">{error}</div>
        ) : filtered.length === 0 ? (
          <div className="p-6 text-center">Data kosong</div>
        ) : (
          <>
            <table className="w-full">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="p-3">No</th>
                  <th className="p-3 cursor-pointer" onClick={() => toggleSort("nama")}>
                    Nama
                  </th>
                  <th className="p-3 cursor-pointer" onClick={() => toggleSort("tipe")}>
                    Tipe
                  </th>
                  <th className="p-3">Keterangan</th>
                  <th className="p-3">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {pageItems.map((x, i) => (
                  <tr key={x.id} className="border-b">
                    <td className="p-3">{start + i + 1}</td>
                    <td className="p-3">{x.nama}</td>
                    <td className="p-3">{x.tipe}</td>
                    <td className="p-3">{x.deskripsi}</td>
                    <td className="p-3">
                      <button
                        onClick={() => navigate(`/Ekategori/${x.id}`)}
                        className="bg-yellow-400 px-3 py-1 rounded text-white mr-2"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(x.id)}
                        className="bg-red-600 px-3 py-1 rounded text-white"
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* PAGINATION */}
          
          </>
        )}
      </div>
    </div>
  );
}
