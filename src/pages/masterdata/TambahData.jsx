import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate, useLocation } from "react-router-dom";

export default function TambahData() {
  const nav = useNavigate();
  const loc = useLocation();
  const q = new URLSearchParams(loc.search);
  // keep lowercase for consistency
  const kategoriParam = (q.get("kategori") || "siswa").toLowerCase();

  // ensure all fields default to empty strings (never undefined)
  const [form, setForm] = useState({
    nama: "",
    ket: "",     // untuk mapel/jabatan atau kelas teks fallback
    alamat: "",
    hp: "",
    kelas: "",   // for siswa: store namaKelas or id depending on your schema
  });
  const [saving, setSaving] = useState(false);
  const [kelasList, setKelasList] = useState([]);

  useEffect(() => {
    // load kelas only if needed (siswa)
    if (kategoriParam === "siswa") {
      axios.get("http://localhost:5000/kelas")
        .then(res => setKelasList(Array.isArray(res.data) ? res.data : []))
        .catch(() => setKelasList([]));
    }
    // ensure form shape when kategori changes
    setForm({
      nama: "",
      ket: "",
      alamat: "",
      hp: "",
      kelas: ""
    });
  }, [kategoriParam]);

  function handleChange(e) {
    const { name, value } = e.target;
    // always keep string values
    setForm(prev => ({ ...prev, [name]: value ?? "" }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    // basic validation
    if (!form.nama.trim()) return Swal.fire({ icon: "warning", title: "Nama wajib diisi" });
    // if siswa, require kelas (optional)
    if (kategoriParam === "siswa" && !form.kelas) {
      return Swal.fire({ icon: "warning", title: "Pilih kelas untuk siswa" });
    }

    try {
      setSaving(true);
      const api = `http://localhost:5000/${kategoriParam}`;
      // send payload — ensure all props exist (no undefined)
      const payload = {
        nama: form.nama || "",
        ket: form.ket || "",
        alamat: form.alamat || "",
        hp: form.hp || "",
        kelas: form.kelas || ""
      };
      await axios.post(api, payload);
      Swal.fire({ icon: "success", title: "Data tersimpan!" });
      // navigate back to masterdata (adjust route if you use /apo or /masterdata)
      nav(`/apo?kategori=${kategoriParam}`);
    } catch (err) {
      console.error(err);
      Swal.fire({ icon: "error", title: "Gagal menyimpan", text: "Periksa server atau koneksi." });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-blue-50 p-6">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-xl shadow-md border border-blue-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-blue-900">Tambah Data {kategoriParam.toUpperCase()}</h2>
            <button onClick={() => nav(-1)} className="text-sm bg-blue-600 text-white px-3 py-2 rounded-md">Kembali</button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-blue-700 mb-1">Nama</label>
              <input
                name="nama"
                value={form.nama || ""}
                onChange={handleChange}
                className="w-full rounded-lg border p-2"
              />
            </div>

            {/* For siswa show kelas select, otherwise ket input */}
            {kategoriParam === "siswa" ? (
              <>
                <div>
                  <label className="block text-sm font-semibold text-blue-700 mb-1">Kelas</label>
                  <select
                    name="kelas"
                    value={form.kelas || ""}
                    onChange={handleChange}
                    className="w-full rounded-lg border p-2"
                  >
                    <option value="">-- Pilih Kelas --</option>
                    {kelasList.map(k => (
                      // use k.id or k.namaKelas depending on your db; here we use namaKelas
                      <option key={k.id} value={k.namaKelas || k.id}>
                        {k.namaKelas}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-blue-700 mb-1">Alamat</label>
                  <input name="alamat" value={form.alamat || ""} onChange={handleChange} className="w-full rounded-lg border p-2" />
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="block text-sm font-semibold text-blue-700 mb-1">
                    {kategoriParam === "guru" ? "Mapel" : "Jabatan"}
                  </label>
                  <input name="ket" value={form.ket || ""} onChange={handleChange} className="w-full rounded-lg border p-2" />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-blue-700 mb-1">Alamat</label>
                  <input name="alamat" value={form.alamat || ""} onChange={handleChange} className="w-full rounded-lg border p-2" />
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-semibold text-blue-700 mb-1">Nomor HP</label>
              <input name="hp" value={form.hp || ""} onChange={handleChange} className="w-full rounded-lg border p-2" />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-blue-100">
              <button type="submit" disabled={saving} className="px-4 py-2 rounded-md bg-blue-600 text-white">
                {saving ? "Menyimpan..." : "Simpan"}
              </button>
              <button type="button" onClick={() => nav(-1)} className="px-4 py-2 rounded-md border">
                Batal
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
