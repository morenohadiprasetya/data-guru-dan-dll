import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate, useParams } from "react-router-dom";

const API_PRESENSI = "http://localhost:5000/presensi";

export default function EditPresensi() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    nama: "",
    kelas: "",
    kategori: "hadir",
    masuk: "",
    pulang: "",
    keteranganIzin: "",
  });

  // ================= AMBIL DATA =================
  useEffect(() => {
    ambilDetail();
  }, []);

  async function ambilDetail() {
    setLoading(true);
    try {
      const res = await axios.get(`${API_PRESENSI}/${id}`);
      const d = res.data;

      setForm({
        nama: d.nama || "",
        kelas: d.kelas || "",
        kategori: d.kategori || "hadir",
        masuk: d.masuk ? d.masuk.slice(0, 16) : "",
        pulang: d.pulang ? d.pulang.slice(0, 16) : "",
        keteranganIzin: d.keteranganIzin || "",
      });
    } catch {
      Swal.fire("Error", "Data presensi tidak ditemukan", "error");
      navigate(-1);
    } finally {
      setLoading(false);
    }
  }

  // ================= HANDLE INPUT =================
  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  // ================= SIMPAN =================
  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.nama || !form.kategori) {
      Swal.fire("Peringatan", "Nama dan kategori wajib diisi", "warning");
      return;
    }

    try {
      await axios.put(`${API_PRESENSI}/${id}`, form);
      Swal.fire("Berhasil", "Data presensi berhasil diperbarui", "success");
      navigate("/Rekappresensi");
    } catch {
      Swal.fire("Error", "Gagal menyimpan perubahan", "error");
    }
  }

  // ================= UI =================
  return (
    <div className="p-6 max-w-3xl bg-gray-10 min-h-screen ml-90 rounded ">

      <h1 className="text-2xl font-bold text-blue-700 mb-6">
        Edit Presensi
      </h1>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow space-y-4">

          <div>
            <label className="block font-semibold mb-1">Nama</label>
            <input
              name="nama"
              value={form.nama}
              onChange={handleChange}
              className="border p-2 rounded w-full"
              required
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Kelas</label>
            <input
              name="kelas"
              value={form.kelas}
              onChange={handleChange}
              className="border p-2 rounded w-full"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Kategori</label>
            <select
              name="kategori"
              value={form.kategori}
              onChange={handleChange}
              className="border p-2 rounded w-full"
            >
              <option value="hadir">Hadir</option>
              <option value="izin">Izin</option>
              <option value="sakit">Sakit</option>
            </select>
          </div>

          {form.kategori === "izin" && (
            <div>
              <label className="block font-semibold mb-1">Keterangan Izin</label>
              <textarea
                name="keteranganIzin"
                value={form.keteranganIzin}
                onChange={handleChange}
                className="border p-2 rounded w-full"
                rows="3"
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold mb-1">Jam Masuk</label>
              <input
                type="datetime-local"
                name="masuk"
                value={form.masuk}
                onChange={handleChange}
                className="border p-2 rounded w-full"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Jam Pulang</label>
              <input
                type="datetime-local"
                name="pulang"
                value={form.pulang}
                onChange={handleChange}
                className="border p-2 rounded w-full"
              />
            </div>
          </div>

          <div className="flex gap-3 justify-end pt-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-4 py-2 rounded bg-gray-400 text-white"
            >
              Batal
            </button>

            <button
              type="submit"
              className="px-4 py-2 rounded bg-blue-600 text-white"
            >
              Simpan Perubahan
            </button>
          </div>

        </form>
      )}
    </div>
  );
}
