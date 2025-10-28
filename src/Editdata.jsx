import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import "remixicon/fonts/remixicon.css";

export default function Edit() {
  const nav = useNavigate();
  const loc = useLocation();
  const q = new URLSearchParams(loc.search);

  const id = q.get("id");
  const kategori = q.get("kategori") || "Siswa";

  const [form, setForm] = useState({
    nama: "",
    ket: "",
    alamat: "",
    hp: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // === LOAD DATA ===
  useEffect(() => {
    let mounted = true;

    async function load() {
      if (!id) {
        setLoading(false);
        return;
      }

      try {
        const resp = await fetch(`http://localhost:5000/${kategori.toLowerCase()}/${id}`);
        if (!resp.ok) throw new Error("not found");

        const json = await resp.json();
        if (!mounted) return;

        setForm({
          nama: json.nama || "",
          ket: json.ket || "",
          alamat: json.alamat || "",
          hp: json.hp || "",
        });
      } catch (err) {
        console.error("Edit load error:", err);
        Swal.fire({
          icon: "error",
          title: "Data tidak ditemukan",
        }).then(() => nav(`/Apo?kategori=${kategori}`));
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => (mounted = false);
  }, [id, kategori, nav]);

  // === HANDLE INPUT ===
  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  // === HANDLE SUBMIT ===
  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.nama || !form.ket || !form.alamat || !form.hp) {
      Swal.fire({ icon: "warning", title: "Semua kolom harus diisi" });
      return;
    }

    try {
      setSaving(true);
      const resp = await fetch(`http://localhost:5000/${kategori.toLowerCase()}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!resp.ok) throw new Error("update failed");

      Swal.fire({ icon: "success", title: "Data diperbarui" }).then(() =>
        nav(`/Apo?kategori=${kategori}`)
      );
    } catch (err) {
      console.error(err);
      Swal.fire({ icon: "error", title: "Gagal memperbarui data" });
    } finally {
      setSaving(false);
    }
  }

  // === LOADING STATE ===
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blue-50 p-6">
        <div className="text-blue-600">⏳ Memuat data...</div>
      </div>
    );
  }

   
  return (
    <div className="flex justify-center items-center min-h-screen bg-blue-50 p-6">
      <div className="max-w-3xl w-full mx-auto">
        <div className="bg-white rounded-xl p-6 border border-blue-100 shadow">
         
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-blue-900 flex items-center gap-2">
              <i className="ri-edit-box-line text-yellow-500"></i>
              Edit Data {kategori}
            </h2>
 
            <button
              onClick={() => nav(-1)}
              className="text-sm text-blue-600 bg-blue-50 px-3 py-2 rounded-md"
            >
              <i className="ri-arrow-left-line"></i> Kembali
            </button>
          </div>

   
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-blue-700 mb-1">
                Nama
              </label>
              <input
                name="nama"
                value={form.nama}
                onChange={handleChange}
                className="w-full rounded-md border border-blue-200 p-2"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-blue-700 mb-1">
                {kategori === "Siswa"
                  ? "Kelas"
                  : kategori === "Guru"
                  ? "Mapel"
                  : "Jabatan"}
              </label>
              <input
                name="ket"
                value={form.ket}
                onChange={handleChange}
                className="w-full rounded-md border border-blue-200 p-2"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-blue-700 mb-1">
                Alamat
              </label>
              <input
                name="alamat"
                value={form.alamat}
                onChange={handleChange}
                className="w-full rounded-md border border-blue-200 p-2"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-blue-700 mb-1">
                Nomor HP
              </label>
              <input
                name="hp"
                value={form.hp}
                onChange={handleChange}
                className="w-full rounded-md border border-blue-200 p-2"
              />
            </div>
 
            <div className="flex items-center justify-end gap-3 mt-4">
               

              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 rounded-md bg-blue-600 text-white"
              >
                {saving ? (
                  "Menyimpan..."
                ) : (
                  <>
                    <i className="ri-save-3-line"></i> Simpan Perubahan
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
