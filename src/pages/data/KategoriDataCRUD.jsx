// ==== CRUD LEVEL: LIST + FORM TAMBAH + FORM EDIT (1 FILE SAJA) ====
// AUTO DETECT MODE: ADD OR EDIT

import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate, useParams } from "react-router-dom";

export default function KategoriDataCRUD() {
  const API = "http://localhost:5000/kategoridata";
  const { id } = useParams();        // <-- untuk deteksi edit
  const navigate = useNavigate();

  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  // FORM STATE
  const [nama, setNama] = useState("");

  // ================= FETCH LIST ====================
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

  // =============== FETCH DATA SAAT EDIT ===============
  const loadEditData = async () => {
    if (!id) return;
    try {
      const res = await axios.get(`${API}/${id}`);
      setNama(res.data.nama || "");
    } catch {
      Swal.fire("Error", "Gagal memuat data edit!", "error");
    }
  };

  useState(() => {
    fetchData();
    loadEditData();
  }, [id]);

  // ============== FILTER PENCARIAN ===============
  const [q, setQ] = useState("");
  const filtered = useMemo(() => {
    const s = q.toLowerCase();
    return list.filter((i) => i.nama.toLowerCase().includes(s));
  }, [q, list]);

  // ============== DELETE ===============
  const remove = async (id) => {
    const ok = await Swal.fire({
      icon: "warning",
      title: "Hapus Level?",
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

  // ============== SIMPAN (TAMBAH / EDIT) ===============
  const save = async () => {
    if (!nama) {
      Swal.fire("Peringatan", "Nama level wajib diisi!", "warning");
      return;
    }

    try {
      if (id) {
        // MODE EDIT
        await axios.put(`${API}/${id}`, { nama });
        Swal.fire("Berhasil", "Level berhasil diperbarui!", "success");
      } else {
        // MODE TAMBAH
        await axios.post(API, { nama });
        Swal.fire("Berhasil", "Level ditambahkan!", "success");
      }

      setNama("");
      navigate("/kategori-data"); // balik ke list
      fetchData();
    } catch {
      Swal.fire("Error", "Gagal menyimpan level!", "error");
    }
  };

  return (
    <div className="p-6 ml-55 min-h-screen bg-gray-50">

      {/* ===================== TITLE ======================= */}
      <h2 className="text-3xl font-bold text-blue-700 mb-6">
        📂 CRUD Level
      </h2>

      {/* ===================== FORM TAMBAH / EDIT ======================= */}
      <div className="bg-white shadow-lg rounded-xl p-5 border mb-6">
        <h3 className="text-xl font-semibold text-blue-600 mb-4">
          {id ? "✏ Edit Level" : "➕ Tambah Level"}
        </h3>

        <input
          value={nama}
          onChange={(e) => setNama(e.target.value)}
          placeholder="Nama Level (contoh: siswa, guru, karyawan)"
          className="border p-3 rounded-xl w-full mb-4 shadow-sm"
        />

        <button
          onClick={save}
          className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded shadow"
        >
          💾 Simpan
        </button>

        {id && (
          <button
            onClick={() => navigate("/kategori-data")}
            className="ml-3 px-6 py-2 bg-gray-400 text-white rounded shadow"
          >
            ↩ Batal
          </button>
        )}
      </div>

      {/* ===================== SEARCH ======================= */}
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="🔍 Cari level..."
        className="border p-3 rounded-xl w-80 mb-4 shadow-sm"
      />

      {/* ===================== LIST TABLE ======================= */}
      <div className="bg-white shadow-lg rounded-xl border overflow-hidden">
        {loading ? (
          <div className="p-5 text-center text-gray-500">Memuat...</div>
        ) : filtered.length === 0 ? (
          <div className="p-5 text-center text-gray-500">
            Tidak ada level.
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="p-3 w-16 text-left">No</th>
                <th className="p-3 text-left">Nama Level</th>
                <th className="p-3 text-center">Aksi</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((d, i) => (
                <tr key={d.id} className="border-b hover:bg-blue-50">
                  <td className="p-3 font-bold">{i + 1}</td>
                  <td className="p-3">{d.nama}</td>

                  <td className="p-3">
                    <div className="flex justify-center gap-3">

                      <button
                        onClick={() => navigate(`/kategori-data/${d.id}`)}
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
