import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

 

const API = "http://localhost:5000/kategoriTagihan";

export default function KategoriTagihan() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // UI states
  const [q, setQ] = useState("");
  const [sortBy, setSortBy] = useState("nama"); // nama | tipe | kelas
  const [order, setOrder] = useState("asc"); // asc | desc
  const [page, setPage] = useState(1);
  const perPage = 8;

  const navigate = useNavigate();

  // fetch all
  const fetchAll = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(API);
      setItems(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
      setError("Gagal mengambil data kategori tagihan.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  // filtered & sorted list (memoized)
  const filtered = useMemo(() => {
    let out = items.slice();

    // search
    if (q.trim()) {
      const s = q.toLowerCase();
      out = out.filter(
        (it) =>
          (it.nama || "").toLowerCase().includes(s) ||
          (it.tipe || "").toLowerCase().includes(s) ||
          (it.deskripsi || "").toLowerCase().includes(s) ||
          (it.kelas || "").toLowerCase().includes(s)
      );
    }

    // sort
    out.sort((a, b) => {
      const A = ((a[sortBy] || "") + "").toString().toLowerCase();
      const B = ((b[sortBy] || "") + "").toString().toLowerCase();
      if (A === B) return 0;
      if (order === "asc") return A > B ? 1 : -1;
      return A < B ? 1 : -1;
    });

    return out;
  }, [items, q, sortBy, order]);

  // pagination logic
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [totalPages]);

  const pageItems = useMemo(() => {
    const start = (page - 1) * perPage;
    return filtered.slice(start, start + perPage);
  }, [filtered, page]);

  // actions
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
      Swal.fire("Dihapus", "Kategori berhasil dihapus", "success");
      fetchAll();
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Gagal menghapus kategori", "error");
    }
  };

  const toggleSort = (field) => {
    if (sortBy === field) setOrder((o) => (o === "asc" ? "desc" : "asc"));
    else {
      setSortBy(field);
      setOrder("asc");
    }
  };

  return (
    <div className="p-6 ml-50 ">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Kategori Tagihan</h1>
        <div className="flex gap-2">
          <button
            onClick={() => navigate("/tambahkategori")}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            + Tambah
          </button>
        </div>
      </div>

      <div className="bg-white shadow rounded p-4 mb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-2">
            <input
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                setPage(1);
              }}
              className="border rounded px-3 py-2 w-72"
              placeholder="Cari nama, tipe, kelas..."
            />
            <button
              onClick={() => {
                setQ("");
                setPage(1);
              }}
              className="px-3 py-2 border rounded"
            >
              Reset
            </button>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-600">Sort:</span>
            <button
              onClick={() => toggleSort("nama")}
              className="px-2 py-1 border rounded"
            >
              Nama {sortBy === "nama" ? (order === "asc" ? "↑" : "↓") : ""}
            </button>
            <button
              onClick={() => toggleSort("tipe")}
              className="px-2 py-1 border rounded"
            >
              Tipe {sortBy === "tipe" ? (order === "asc" ? "↑" : "↓") : ""}
            </button>
            <button
              onClick={() => toggleSort("kelas")}
              className="px-2 py-1 border rounded"
            >
              Kelas {sortBy === "kelas" ? (order === "asc" ? "↑" : "↓") : ""}
            </button>
          </div>
        </div>
      </div>

      <div>
        {loading ? (
          <div className="p-8 text-center text-gray-600">Memuat kategori...</div>
        ) : error ? (
          <div className="p-4 text-red-600">{error}</div>
        ) : filtered.length === 0 ? (
          <div className="p-6 text-center text-gray-600">Belum ada kategori.</div>
        ) : (
          <>
            <div className="overflow-x-auto bg-white rounded shadow">
              <table className="w-full table-auto">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-2 text-left">No</th>
                    <th className="p-2 text-left">Nama</th>
                    <th className="p-2 text-left">Tipe</th>
                    <th className="p-2 text-left">Deskripsi</th>
                    <th className="p-2 text-left">Kelas</th>
                    <th className="p-2 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {pageItems.map((it, idx) => (
                    <tr key={it.id} className="border-t">
                      <td className="p-2">{(page - 1) * perPage + idx + 1}</td>
                      <td className="p-2">{it.nama}</td>
                      <td className="p-2">{it.tipe}</td>
                      <td className="p-2">{it.deskripsi}</td>
                      <td className="p-2">{it.kelas}</td>
                      <td className="p-2 text-center">
                        <div className="inline-flex gap-2">
                          <button
                            onClick={() =>
                              navigate(`/editkategoritagihan/${it.id}`)
                            }
                            className="px-3 py-1 bg-yellow-400 rounded"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(it.id)}
                            className="px-3 py-1 bg-red-600 text-white rounded"
                          >
                            Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* pagination */}
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-gray-600">
                Menampilkan {filtered.length} item — halaman {page}/{totalPages}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage(1)}
                  disabled={page === 1}
                  className="px-3 py-1 border rounded disabled:opacity-50"
                >
                  ⏮
                </button>
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3 py-1 border rounded disabled:opacity-50"
                >
                  ◀
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-3 py-1 border rounded disabled:opacity-50"
                >
                  ▶
                </button>
                <button
                  onClick={() => setPage(totalPages)}
                  disabled={page === totalPages}
                  className="px-3 py-1 border rounded disabled:opacity-50"
                >
                  ⏭
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
