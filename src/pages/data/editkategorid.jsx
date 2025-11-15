import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate, useParams } from "react-router-dom";

const API = "http://localhost:5000/kategoridata";

export default function Editkategoridata() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ nama: "", ket: "", alamat: "", hp: "" });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    axios.get(`${API}/${id}`)
      .then(res => setForm(res.data || {}))
      .catch(err => {
        console.error(err);
        Swal.fire("Error", "Gagal memuat data", "error");
      })
      .finally(() => setLoading(false));
  }, [id]);

  const save = async (e) => {
    e.preventDefault();
    if (!form.nama.trim()) return Swal.fire("Nama wajib diisi", "", "warning");
    try {
      setSaving(true);
      await axios.put(`${API}/${id}`, form);
      Swal.fire("Berhasil", "Perubahan disimpan", "success");
      navigate("/kategoril");
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Gagal menyimpan", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-6">Memuat...</div>;

  return (
    <div className="p-6 ml-100">
      <h2 className="text-2xl font-bold mb-4">Edit Kategori Data</h2>
      <form onSubmit={save} className="max-w-lg bg-white p-4 rounded shadow">
        <label className="block mb-1">Nama</label>
        <input value={form.nama} onChange={(e)=>setForm({...form, nama:e.target.value})} className="w-full p-2 border mb-3 rounded" />

        <label className="block mb-1">Keterangan / Kelas</label>
        <input value={form.ket} onChange={(e)=>setForm({...form, ket:e.target.value})} className="w-full p-2 border mb-3 rounded" />

        <label className="block mb-1">Alamat</label>
        <input value={form.alamat} onChange={(e)=>setForm({...form, alamat:e.target.value})} className="w-full p-2 border mb-3 rounded" />

        <label className="block mb-1">HP</label>
        <input value={form.hp} onChange={(e)=>setForm({...form, hp:e.target.value})} className="w-full p-2 border mb-3 rounded" />

        <div className="flex gap-2">
          <button type="submit" disabled={saving} className="px-4 py-2 bg-blue-600 text-white rounded">{saving? "Menyimpan..." : "Simpan"}</button>
          <button type="button" onClick={() => navigate(-1)} className="px-4 py-2 border rounded">Batal</button>
        </div>
      </form>
    </div>
  );
}
