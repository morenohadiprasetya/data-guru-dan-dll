import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate, useParams } from "react-router-dom";

export default function LevelCRUDData() {
  const API = "http://localhost:5000/kategoridata";
  const { id } = useParams();
  const navigate = useNavigate();

  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  const [nama, setNama] = useState("");
  const [isCustom, setIsCustom] = useState(false);
  const [customNama, setCustomNama] = useState("");

  const [q, setQ] = useState("");

  // ================= FETCH DATA =================
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

  // ================= LOAD EDIT =================
  const loadEditData = async () => {
    if (!id) return;
    try {
      const res = await axios.get(`${API}/${id}`);
      setNama(res.data.nama || "");
      setIsCustom(false);
      setCustomNama("");
    } catch {
      Swal.fire("Error", "Gagal memuat data edit!", "error");
    }
  };

  useEffect(() => {
    fetchData();
    loadEditData();
  }, [id]);

  // ================= FILTER =================
  const filtered = useMemo(() => {
    const s = q.toLowerCase();
    return list.filter((i) => i.nama.toLowerCase().includes(s));
  }, [q, list]);

  // ================= DELETE =================
  const remove = async (id) => {
    const ok = await Swal.fire({
      icon: "warning",
      title: "Hapus Data Level?",
      text: "Data tidak bisa dikembalikan!",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus",
      cancelButtonText: "Batal",
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

  // ================= SAVE =================
  const save = async () => {
    const finalNama = isCustom ? customNama.trim() : nama.trim();

    if (!finalNama) {
      Swal.fire("Peringatan", "Level wajib diisi!", "warning");
      return;
    }

    // Cegah duplikat
    const exists = list.some(
      (l) => l.nama.toLowerCase() === finalNama.toLowerCase() && l.id !== id
    );
    if (exists) {
      Swal.fire("Peringatan", "Level sudah ada!", "warning");
      return;
    }

    try {
      if (id) {
        await axios.put(`${API}/${id}`, { nama: finalNama });
        Swal.fire("Berhasil", "Level diperbarui!", "success");
      } else {
        await axios.post(API, { nama: finalNama });
        Swal.fire("Berhasil", "Level ditambahkan!", "success");
      }

      setNama("");
      setCustomNama("");
      setIsCustom(false);
      navigate("/kategori-data");
      fetchData();
    } catch {
      Swal.fire("Error", "Gagal menyimpan level!", "error");
    }
  };

  // ================= RENDER =================
  return (
    <div className="p-6 ml-55 min-h-screen bg-gray-50">
      <h2 className="text-3xl font-bold text-blue-700 mb-6">
        CRUD Level Data (Siswa, Guru, Karyawan & Custom)
      </h2>

      {/* FORM */}
      <div className="bg-white shadow-lg rounded-xl p-5 border mb-6">
        <h3 className="text-xl font-semibold text-blue-600 mb-4">
          {id ? "Edit Level" : "Tambah Level"}
        </h3>

        <select
          value={isCustom ? "__custom__" : nama}
          onChange={(e) => {
            if (e.target.value === "__custom__") {
              setIsCustom(true);
              setNama("");
            } else {
              setIsCustom(false);
              setNama(e.target.value);
              setCustomNama("");
            }
          }}
          className="border p-3 rounded-xl w-full mb-4 shadow-sm"
        >
          <option value="">-- Pilih Level --</option>
          <option value="siswa">Siswa</option>
          <option value="guru">Guru</option>
          <option value="karyawan">Karyawan</option>
          <option value="__custom__">➕ Tambah Level Baru</option>
        </select>

        {isCustom && (
          <input
            type="text"
            placeholder="Masukkan nama level baru"
            value={customNama}
            onChange={(e) => setCustomNama(e.target.value)}
            className="border p-3 rounded-xl w-full mb-4 shadow-sm"
          />
        )}

        <button
          onClick={save}
          className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded shadow"
        >
          Simpan
        </button>

        {id && (
          <button
            onClick={() => navigate("/kategori-data")}
            className="ml-3 px-6 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded shadow"
          >
            Batal
          </button>
        )}
      </div>

      {/* SEARCH */}
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Cari level..."
        className="border p-3 rounded-xl w-80 mb-4 shadow-sm"
      />

      {/* TABLE */}
      <div className="bg-white shadow-lg rounded-xl border overflow-hidden">
        {loading ? (
          <div className="p-5 text-center text-gray-500">Memuat...</div>
        ) : filtered.length === 0 ? (
          <div className="p-5 text-center text-gray-500">
            Tidak ada data.
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="p-3 w-16 text-left">No</th>
                <th className="p-3 text-left">Level</th>
                <th className="p-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((d, i) => (
                <tr key={d.id} className="border-b hover:bg-blue-50">
                  <td className="p-3 font-bold">{i + 1}</td>
                  <td className="p-3 capitalize">{d.nama}</td>
                  <td className="p-3">
                    <div className="flex justify-center gap-3">
                      <button
                        onClick={() =>
                          navigate(`/kategori-data/${d.id}`)
                        }
                        className="px-3 py-1 bg-yellow-400 hover:bg-yellow-500 text-white rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => remove(d.id)}
                        className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded"
                      >
                        Hapus
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
