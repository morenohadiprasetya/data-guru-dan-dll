import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import "remixicon/fonts/remixicon.css";

 

export default function Ta() {
  const nav = useNavigate();
  const loc = useLocation();
  const q = new URLSearchParams(loc.search);
  const kategori = q.get("kategori") || "Siswa";

  const [form, setForm] = useState({ nama: "", ket: "", alamat: "", hp: "" });
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
     
    if (!form.nama || !form.ket || !form.alamat || !form.hp) {
      Swal.fire({ icon: "warning", title: "Lengkapi semua kolom!" });
      return;
    }

    try {
      setLoading(true);
      const resp = await fetch(`http://localhost:5000/${kategori.toLowerCase()}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nama: form.nama, ket: form.ket, alamat: form.alamat, hp: form.hp }),
      });
      if (!resp.ok) throw new Error("gagal");
      Swal.fire({ icon: "success", title: "Data tersimpan!" });
      nav(`/Apo?kategori=${kategori}`);
    } catch (err) {
      console.error(err);
      Swal.fire({ icon: "error", title: "Gagal menyimpan", text: "Periksa koneksi ke server." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-blue-50 p-6">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-xl shadow border border-blue-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-blue-900 flex items-center gap-2">
              <i className="ri-add-circle-line text-green-600"></i>
              Tambah Data {kategori}
            </h2>
            <button onClick={() => nav(-1)} className="text-sm text-blue-600 bg-blue-50 px-3 py-2 rounded-md">
              <i className="ri-arrow-left-line"></i> Kembali
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-blue-700 mb-1">Nama</label>
              <input name="nama" value={form.nama} onChange={handleChange} className="w-full rounded-md border border-blue-200 p-2" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-blue-700 mb-1">
                {kategori === "Siswa" ? "Kelas" : kategori === "Guru" ? "Mapel" : "Jabatan"}
              </label>
              <input name="ket" value={form.ket} onChange={handleChange} className="w-full rounded-md border border-blue-200 p-2" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-blue-700 mb-1">Alamat</label>
              <input name="alamat" value={form.alamat} onChange={handleChange} className="w-full rounded-md border border-blue-200 p-2" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-blue-700 mb-1">Nomor HP</label>
              <input name="hp" value={form.hp} onChange={handleChange} className="w-full rounded-md border border-blue-200 p-2" />
            </div>

            <div className="flex items-center justify-end gap-3 mt-4">
              <button type="button" onClick={() => nav(-1)} className="px-4 py-2 rounded-md bg-gray-100 text-gray-700">
                <i className="ri-close-circle-line"></i> Batal
              </button>
              <button type="submit" disabled={loading} className="px-4 py-2 rounded-md bg-blue-600 text-white">
                {loading ? "Menyimpan..." : <><i className="ri-save-3-line"></i> Simpan</>}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
