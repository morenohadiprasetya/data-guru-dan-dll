import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate, useLocation } from "react-router-dom";

export default function TambahData() {
  const nav = useNavigate();
  const loc = useLocation();

  // Level yg dipilih
  const q = new URLSearchParams(loc.search);
  const kategoriParam = (q.get("kategori") || "siswa").toLowerCase();

  const [form, setForm] = useState({
    nama: "",
    ket: "",
    alamat: "",
    hp: "",
    kelas: "",
    level: kategoriParam,
  });

  const [saving, setSaving] = useState(false);
  const [kelasList, setKelasList] = useState([]);
  const [levelList, setLevelList] = useState([]);

  // Ambil level dari CRUD Level
  useEffect(() => {
    axios.get("http://localhost:5000/kategoridata")
      .then(res => setLevelList(res.data || []))
      .catch(() => setLevelList([]));
  }, []);

  // Ambil kelas hanya jika level === siswa
  useEffect(() => {
    if (form.level === "siswa") {
      axios.get("http://localhost:5000/kelas")
        .then(res => setKelasList(Array.isArray(res.data) ? res.data : []))
        .catch(() => setKelasList([]));
    }
  }, [form.level]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.nama.trim())
      return Swal.fire({ icon: "warning", title: "Nama wajib diisi" });

    if (form.level === "siswa" && !form.kelas)
      return Swal.fire({ icon: "warning", title: "Pilih kelas untuk siswa" });

    try {
      setSaving(true);
      const api = `http://localhost:5000/${form.level}`;

      await axios.post(api, form);
      Swal.fire({ icon: "success", title: "Data tersimpan!" });
      nav(`/apo?kategori=${form.level}`);
    } catch (err) {
      Swal.fire({ icon: "error", title: "Gagal menyimpan" });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-blue-50 p-6">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-xl shadow-md p-6 border border-blue-100">

          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-blue-900">Tambah Data</h2>
            <button onClick={() => nav(-1)} className="text-sm bg-blue-600 text-white px-3 py-2 rounded-md">Kembali</button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* PILIH LEVEL */}
           

            {/* NAMA */}
            <div>
              <label className="block text-sm font-semibold text-blue-700 mb-1">Nama</label>
              <input
                name="nama"
                value={form.nama}
                onChange={handleChange}
                className="w-full rounded-lg border p-2"
              />
            </div>
 <div>
              <label className="block text-sm font-semibold text-blue-700 mb-1">Level</label>
              <select
                name="level"
                value={form.level}
                onChange={handleChange}
                className="w-full rounded-lg border p-2"
              >
                <option value="">-- Pilih Level --</option>
                {levelList.map(l => (
                  <option key={l.id} value={l.nama}>{l.nama}</option>
                ))}
              </select>
            </div>
           
            {form.level === "siswa" ? (
              <>
                <div>
                  <label className="block text-sm font-semibold text-blue-700 mb-1">Kelas</label>
                  <select
                    name="kelas"
                    value={form.kelas}
                    onChange={handleChange}
                    className="w-full rounded-lg border p-2"
                  >
                    <option value="">-- Pilih Kelas --</option>
                    {kelasList.map(k => (
                      <option key={k.id} value={k.namaKelas}>{k.namaKelas}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-blue-700 mb-1">Alamat</label>
                  <input name="alamat" value={form.alamat} onChange={handleChange} className="w-full rounded-lg border p-2" />
                </div>
              </>
            ) : (
              <>
                {/* guru = mapel, karyawan = jabatan */}
                <div>
                  <label className="block text-sm font-semibold text-blue-700 mb-1">{form.level === "guru" ? "Mapel" : "Jabatan"}</label>
                  <input name="ket" value={form.ket} onChange={handleChange} className="w-full rounded-lg border p-2" />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-blue-700 mb-1">Alamat</label>
                  <input name="alamat" value={form.alamat} onChange={handleChange} className="w-full rounded-lg border p-2" />
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-semibold text-blue-700 mb-1">Nomor HP</label>
              <input name="hp" value={form.hp} onChange={handleChange} className="w-full rounded-lg border p-2" />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-blue-100">
              <button type="submit" disabled={saving} className="px-4 py-2 rounded-md bg-blue-600 text-white">
                {saving ? "Menyimpan..." : "Simpan"}
              </button>
              <button type="button" onClick={() => nav(-1)} className="px-4 py-2 rounded-md border">Batal</button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}