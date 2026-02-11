import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

const API_TAGIHAN = "http://localhost:8080/api/tagihan";
const API_KATEGORI = "http://localhost:8080/api/kategori-tagihan";

export default function EditTagihan() {
  const { id } = useParams(); // ambil ID dari URL
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nama: "",
    bulan: "",
    jumlah: 0,
    dibayar: 0,
    sisa: 0,
    status: "",
    kategori: "",
  });

  const [kategoriList, setKategoriList] = useState([]);

  // Ambil data tagihan lama dan kategori
  useEffect(() => {
    const fetchData = async () => {
      try {
        // ambil tagihan
        const resTagihan = await axios.get(`${API_TAGIHAN}/${id}`);
        setFormData(resTagihan.data);

        // ambil kategori
        const resKategori = await axios.get(API_KATEGORI);
        setKategoriList(resKategori.data || []);
      } catch (err) {
        Swal.fire("Error", "Gagal mengambil data", "error");
        console.error(err);
      }
    };
    fetchData();
  }, [id]);

  // Handle perubahan input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API_TAGIHAN}/${id}`, formData);
      Swal.fire("Berhasil", "Data tagihan diperbarui", "success");
      navigate("/tagihan"); // kembali ke daftar tagihan
    } catch (err) {
      Swal.fire("Error", "Gagal memperbarui data", "error");
      console.error(err);
    }
  };

  return (
    <div className="ml-55 mr-10 p-6">
      <h1 className="text-3xl font-semibold mb-6">Edit Tagihan</h1>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-md max-w-lg">
        <div className="mb-4">
          <label className="block mb-1 font-semibold">Nama</label>
          <input
            type="text"
            name="nama"
            value={formData.nama}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-semibold">Bulan</label>
          <input
            type="text"
            name="bulan"
            value={formData.bulan}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            placeholder="Januari, Februari, ..."
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-semibold">Jumlah</label>
          <input
            type="number"
            name="jumlah"
            value={formData.jumlah}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-semibold">Dibayar</label>
          <input
            type="number"
            name="dibayar"
            value={formData.dibayar}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-semibold">Sisa</label>
          <input
            type="number"
            name="sisa"
            value={formData.sisa}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-semibold">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          >
            <option value="">-- Pilih Status --</option>
            <option value="Lunas">Lunas</option>
            <option value="Belum Lunas">Belum Lunas</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-semibold">Kategori</label>
          <select
            name="kategori"
            value={formData.kategori}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          >
            <option value="">-- Pilih Kategori --</option>
            {kategoriList.map((k) => (
              <option key={k.id} value={k.nama}>
                {k.nama}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Simpan
          </button>

          <button
            type="button"
            onClick={() => navigate("/tagihan")}
            className="bg-gray-400 text-white px-6 py-2 rounded hover:bg-gray-500"
          >
            Batal
          </button>
        </div>
      </form>
    </div>
  );
}
