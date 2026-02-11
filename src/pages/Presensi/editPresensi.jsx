import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate, useParams } from "react-router-dom";

const API_PRESENSI = "http://localhost:8080/presensi";

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
    keterangan: "",
  });

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
        keterangan: d.keterangan || "",
      });
    } catch {
      Swal.fire("Error", "Data tidak ditemukan", "error");
      navigate(-1);
    } finally {
      setLoading(false);
    }
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (
      (form.kategori === "izin" || form.kategori === "sakit") &&
      !form.keterangan.trim()
    ) {
      Swal.fire("Peringatan", "Keterangan wajib diisi", "warning");
      return;
    }

    try {
      await axios.put(`${API_PRESENSI}/${id}`, {
        kategori: form.kategori,
        masuk: form.masuk,
        pulang: form.pulang,
        keterangan: form.keterangan,
      });

      Swal.fire("Berhasil", "Presensi berhasil diperbarui", "success");
      navigate("/rekappresensi");
    } catch {
      Swal.fire("Error", "Gagal menyimpan", "error");
    }
  }

  return (
    <div className="p-6 max-w-3xl min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Edit Presensi</h1>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow">
          <input value={form.nama} disabled className="border p-2 w-full bg-gray-100" />
          <input value={form.kelas} disabled className="border p-2 w-full bg-gray-100" />

          <select
            name="kategori"
            value={form.kategori}
            onChange={handleChange}
            className="border p-2 w-full"
          >
            <option value="hadir">Hadir</option>
            <option value="izin">Izin</option>
            <option value="sakit">Sakit</option>
          </select>

          {(form.kategori === "izin" || form.kategori === "sakit") && (
            <textarea
              name="keterangan"
              value={form.keterangan}
              onChange={handleChange}
              className="border p-2 w-full"
              placeholder="Keterangan"
            />
          )}

          <div className="grid grid-cols-2 gap-4">
            <input type="datetime-local" name="masuk" value={form.masuk} onChange={handleChange} className="border p-2" />
            <input type="datetime-local" name="pulang" value={form.pulang} onChange={handleChange} className="border p-2" />
          </div>

          <button className="bg-blue-600 text-white px-4 py-2 rounded">
            Simpan Perubahan
          </button>
        </form>
      )}
    </div>
  );
}
