import React, { useEffect, useState, useMemo } from "react";
import Swal from "sweetalert2";

 
const API = "http://localhost:5000/kategoriTagihan";

function genId() {
  try {
    return typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : "kt_" + Date.now();
  } catch {
    return "kt_" + Date.now();
  }
}

export default function KategoriTagihan() {
  const [kategori, setKategori] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // UI states
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("nama"); // nama or id
  const [sortOrder, setSortOrder] = useState("asc"); // asc or desc
  const [page, setPage] = useState(1);
  const perPage = 8;

  // fetch data
  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(API);
        if (!res.ok) throw new Error("Gagal memuat kategori");
        const data = await res.json();
        if (mounted) setKategori(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message || "Error saat memuat");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);

  // derived filtered/sorted list
  const filtered = useMemo(() => {
    let out = kategori.slice();

    if (search.trim()) {
      const s = search.trim().toLowerCase();
      out = out.filter((k) => (k.nama || "").toLowerCase().includes(s) || (String(k.id) || "").toLowerCase().includes(s));
    }

    out.sort((a, b) => {
      const A = (a[sortBy] || "").toString().toLowerCase();
      const B = (b[sortBy] || "").toString().toLowerCase();
      if (A === B) return 0;
      if (sortOrder === "asc") return A > B ? 1 : -1;
      return A < B ? 1 : -1;
    });

    return out;
  }, [kategori, search, sortBy, sortOrder]);

  // pagination
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [totalPages]);

  const pageData = useMemo(() => {
    const start = (page - 1) * perPage;
    return filtered.slice(start, start + perPage);
  }, [filtered, page]);

  // actions: add / edit via swal modal
  const openAdd = async () => {
    const { value: nama } = await Swal.fire({
      title: "Tambah Kategori",
      input: "text",
      inputLabel: "Nama kategori",
      inputPlaceholder: "Contoh: SPP",
      showCancelButton: true,
      confirmButtonText: "Simpan",
      preConfirm: (v) => {
        if (!v || !v.trim()) {
          Swal.showValidationMessage("Nama kategori wajib diisi");
          return;
        }
        return v.trim();
      },
    });

    if (!nama) return;

    try {
      setLoading(true);
      const newItem = { id: genId(), nama };
      const res = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newItem),
      });
      if (!res.ok) throw new Error("Gagal menambahkan kategori");
      const created = await res.json();
      setKategori((p) => [created, ...p]);
      Swal.fire("Berhasil", "Kategori ditambahkan", "success");
    } catch (err) {
      Swal.fire("Error", err.message || "Gagal menambahkan", "error");
    } finally {
      setLoading(false);
    }
  };

  const openEdit = async (item) => {
    const { value } = await Swal.fire({
      title: "Edit Kategori",
      input: "text",
      inputLabel: "Nama kategori",
      inputValue: item.nama || "",
      showCancelButton: true,
      confirmButtonText: "Simpan",
      preConfirm: (v) => {
        if (!v || !v.trim()) {
          Swal.showValidationMessage("Nama kategori wajib diisi");
          return;
        }
        return v.trim();
      },
    });

    if (!value) return;

    try {
      setLoading(true);
      const res = await fetch(`${API}/${item.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...item, nama: value }),
      });
      if (!res.ok) throw new Error("Gagal memperbarui");
      const updated = await res.json();
      setKategori((p) => p.map((k) => (k.id === updated.id ? updated : k)));
      Swal.fire("Berhasil", "Kategori diperbarui", "success");
    } catch (err) {
      Swal.fire("Error", err.message || "Gagal menyimpan", "error");
    } finally {
      setLoading(false);
    }
  };

  const doDelete = async (id) => {
    const ok = await Swal.fire({
      title: "Hapus kategori?",
      text: "Data akan dihapus permanen",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Hapus",
    });
    if (!ok.isConfirmed) return;

    try {
      setLoading(true);
      const res = await fetch(`${API}/${id}`, { method: "DELETE" });
      if (res.status === 404) throw new Error("Data tidak ditemukan (sudah dihapus?)");
      if (!res.ok) throw new Error("Gagal menghapus");
      setKategori((p) => p.filter((k) => k.id !== id));
      Swal.fire("Dihapus", "Kategori berhasil dihapus", "success");
    } catch (err) {
      Swal.fire("Error", err.message || "Gagal menghapus", "error");
    } finally {
      setLoading(false);
    }
  };

  // tiny UI helpers
  const toggleSort = (field) => {
    if (sortBy === field) setSortOrder((o) => (o === "asc" ? "desc" : "asc"));
    else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Kategori Tagihan</h1>
          <div className="flex items-center gap-3">
            <button
              onClick={openAdd}
              className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700"
            >
              + Tambah
            </button>
          </div>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
            <div className="flex items-center gap-2">
              <input
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Cari nama atau id..."
                className="border p-2 rounded w-56"
              />
              <button
                onClick={() => {
                  setSearch("");
                  setPage(1);
                }}
                className="text-sm px-2 py-1 border rounded"
              >
                Reset
              </button>
            </div>

            <div className="flex items-center gap-2">
              <div className="text-sm text-gray-600">Sort:</div>
              <button
                onClick={() => toggleSort("nama")}
                className="px-2 py-1 border rounded text-sm"
              >
                Nama {sortBy === "nama" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
              </button>
              <button
                onClick={() => toggleSort("id")}
                className="px-2 py-1 border rounded text-sm"
              >
                ID {sortBy === "id" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
              </button>
            </div>
          </div>

          {loading ? (
            <div className="p-8 text-center text-gray-600">Memuat kategori...</div>
          ) : error ? (
            <div className="p-4 text-red-600">{error}</div>
          ) : filtered.length === 0 ? (
            <div className="p-6 text-center text-gray-600">Belum ada data</div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full table-auto border">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="p-2 border text-left">No</th>
                      <th className="p-2 border text-left">Nama</th>
                      <th className="p-2 border text-left">Keterangan</th>
                      <th className="p-2 border text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pageData.map((k, idx) => (
                      <tr key={k.id} className="odd:bg-white even:bg-gray-50">
                        <td className="p-2 border">{(page - 1) * perPage + idx + 1}</td>
                        <td className="p-2 border">{k.nama}</td>
                        <td className="p-2 border text-sm text-gray-500">{k.id}</td>
                        <td className="p-2 border text-center">
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={() => openEdit(k)}
                              className="px-2 py-1 bg-yellow-500 text-white rounded"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => doDelete(k.id)}
                              className="px-2 py-1 bg-red-600 text-white rounded"
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

              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-gray-600">
                  Menampilkan {filtered.length} item — halaman {page}/{totalPages}
                </div>

                <div className="flex items-center gap-2">
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

        <div className="mt-6 text-sm text-gray-500">
          Tips: gunakan tombol <span className="font-semibold">Tambah</span> untuk menambahkan kategori.
        </div>
      </div>
    </div>
  );
}
