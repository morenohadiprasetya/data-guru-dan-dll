import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const API = "http://localhost:5000/kategoriData";

export default function Tambahkategoridata() {
  const [form, setForm] = useState({ nama: "", ket: "", alamat: "", hp: "" });
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.nama.trim()) return Swal.fire("Nama wajib diisi", "", "warning");
    try {
      setSaving(true);
      await axios.post(API, form); // json-server auto id
      Swal.fire("Berhasil", "Data tersimpan", "success");
      navigate("/kategoril");
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Gagal menyimpan", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 ml-50">
      <h2 className="text-2xl font-bold mb-4">Tambah Kategori Data</h2>
      <form onSubmit={handleSubmit} className="max-w-lg bg-white p-4 rounded shadow">
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
