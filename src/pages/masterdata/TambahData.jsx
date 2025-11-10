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
        body: JSON.stringify(form),
      });
      if (!resp.ok) throw new Error("Gagal menyimpan data");
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
        <div className="bg-white rounded-xl shadow-md border border-blue-100 p-6">
           
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-blue-900 flex items-center gap-2">
              <i className="ri-add-circle-line text-green-600"></i>
              Tambah Data {kategori}
            </h2>
            <button
              onClick={() => nav(-1)}
              className="flex items-center gap-1 text-sm  bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700 transition"
            >
              <i className="ri-arrow-left-line"></i> Kembali
            </button>
          </div>

          
          <form onSubmit={handleSubmit} className="space-y-5">
            {[
              { name: "nama", label: "Nama" },
              {
                name: "ket",
                label:
                  kategori === "Siswa"
                    ? "Kelas"
                    : kategori === "Guru"
                    ? "Mapel"
                    : "Jabatan",
              },
              { name: "alamat", label: "Alamat" },
              { name: "hp", label: "Nomor HP" },
            ].map((field) => (
              <div key={field.name}>
                <label className="block text-sm font-semibold text-blue-700 mb-1">
                  {field.label}
                </label>
                <input
                  name={field.name}
                  value={form[field.name]}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-blue-200 p-2.5 focus:ring-2 focus:ring-blue-300 focus:outline-none transition bg-white"
                />
              </div>
            ))}

            
            <div className="flex justify-end gap-3 pt-4 border-t border-blue-100">
               
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-1 px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-70"
              >
                {loading ? (
                  "Menyimpan..."
                ) : (
                  <>
                    <i className="ri-save-3-line"></i> Simpan
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
  