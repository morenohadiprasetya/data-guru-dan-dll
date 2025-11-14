import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const API = "http://localhost:5000/kategoriData";

export default function Ambatigori() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 8;

  const navigate = useNavigate();

  const fetchAll = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(API);
      setList(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
      setError("Gagal memuat data master.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return list.slice();
    return list.filter(
      (i) =>
        (i.nama || "").toLowerCase().includes(s) ||
        (i.ket || "").toLowerCase().includes(s) ||
        (i.alamat || "").toLowerCase().includes(s) ||
        (i.hp || "").toLowerCase().includes(s)
    );
  }, [list, q]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [totalPages]);

  const pageItems = useMemo(() => {
    const start = (page - 1) * perPage;
    return filtered.slice(start, start + perPage);
  }, [filtered, page]);

  const handleDelete = async (id) => {
    const ok = await Swal.fire({
      title: "Hapus data?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Hapus",
    });
    if (!ok.isConfirmed) return;
    try {
      await axios.delete(`${API}/${id}`);
      Swal.fire("Dihapus", "", "success");
      fetchAll();
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Gagal menghapus", "error");
    }
  };

  return (
    <div className="p-6 ml-50">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Kategori Data</h2>
        <div className="flex gap-2">
          <button onClick={() => navigate("/tambahkategori")} className="px-4 py-2 bg-blue-600 text-white rounded">+ Tambah</button>
        </div>
      </div>

      <div className="mb-4">
        <input value={q} onChange={(e)=>{setQ(e.target.value); setPage(1);}} placeholder="Cari nama/ket/alamat/hp..." className="border p-2 rounded w-72" />
        <button onClick={()=>{setQ(""); setPage(1);}} className="ml-2 px-3 py-1 border rounded">Reset</button>
      </div>

      {loading ? (
        <div className="p-6 text-center text-gray-600">Memuat...</div>
      ) : error ? (
        <div className="p-4 text-red-600">{error}</div>
      ) : filtered.length === 0 ? (
        <div className="p-6 text-gray-600">Belum ada data.</div>
      ) : (
        <>
          <div className="overflow-x-auto bg-white rounded shadow">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2">No</th>
                  <th className="p-2">Nama</th>
                  <th className="p-2">Keterangan</th>
                  <th className="p-2">Alamat</th>
                  <th className="p-2">HP</th>
                  <th className="p-2">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {pageItems.map((d, i) => (
                  <tr key={d.id} className="border-t">
                    <td className="p-2">{(page-1)*perPage + i + 1}</td>
                    <td className="p-2">{d.nama}</td>
                    <td className="p-2">{d.ket}</td>
                    <td className="p-2">{d.alamat}</td>
                    <td className="p-2">{d.hp}</td>
                    <td className="p-2">
                      <div className="inline-flex gap-2">
                        <button onClick={()=>navigate(`/editkategori/${d.id}`)} className="px-3 py-1 bg-yellow-400 rounded">Edit</button>
                        <button onClick={()=>handleDelete(d.id)} className="px-3 py-1 bg-red-600 text-white rounded">Hapus</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-gray-600">Menampilkan {filtered.length} item — halaman {page}/{totalPages}</div>
            <div className="flex gap-2">
              <button onClick={()=>setPage(1)} disabled={page===1} className="px-3 py-1 border rounded">⏮</button>
              <button onClick={()=>setPage(p=>Math.max(1,p-1))} disabled={page===1} className="px-3 py-1 border rounded">◀</button>
              <button onClick={()=>setPage(p=>Math.min(totalPages,p+1))} disabled={page===totalPages} className="px-3 py-1 border rounded">▶</button>
              <button onClick={()=>setPage(totalPages)} disabled={page===totalPages} className="px-3 py-1 border rounded">⏭</button>
            </div>
          </div>
        </>
      )}
    </div>
  );    
}
