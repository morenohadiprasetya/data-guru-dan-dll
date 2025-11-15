import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
export default function TambahKategori() {
  const API = "http://localhost:5000/kategoriTagihan";

  const navigate = useNavigate();   // <-- WAJIB ADA DI SINI

  const [formData, setFormData] = useState({
    nama: "",
    tipe: "",
    deskripsi: "",
    kelas: "",
  });


  // handle input
  const handleInput = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // simpan data
  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
   await axios.post(API, {
  id: Date.now().toString(),
  ...formData
});

    Swal.fire({
      icon: "success",
      title: "Berhasil",
      text: "Kategori berhasil disimpan!",
      timer: 1500,
      showConfirmButton: true,
    }).then(() => {
      navigate("/kategori-tagihan"); // <-- pindah halaman
    });

    setFormData({
      nama: "",
      tipe: "",
      deskripsi: "",
      kelas: "",
    });
  } catch (err) {
    Swal.fire({
      icon: "error",
      title: "Gagal",
      text: "Tidak dapat menyimpan kategori!",
    });
  }
};

  return (
    <div className="p-6 ml-50">
      <h2 className="text-2xl font-semibold mb-4">Tambah Kategori Baru</h2>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">

        {/* Nama */}
        <div>
          <label className="block mb-1">Nama</label>
          <input
            className="w-full p-3 border rounded"
            name="nama"
            value={formData.nama}
            onChange={handleInput}
            required
          />
        </div>

        {/* Tipe */}
        <div>
          <label className="block mb-1">Tipe</label>
          <input
            className="w-full p-3 border rounded"
            name="tipe"
            value={formData.tipe}
            onChange={handleInput}
            required
          />
        </div>

        {/* Deskripsi */}
        <div>
          <label className="block mb-1">Deskripsi</label>
          <textarea
            className="w-full p-3 border rounded"
            name="deskripsi"
            value={formData.deskripsi}
            onChange={handleInput}
            required
          ></textarea>
        </div>

        {/* Kelas */}
        <div>
          <label className="block mb-1">Kelas</label>
          <input
            className="w-full p-3 border rounded"
            name="kelas"
            value={formData.kelas}
            onChange={handleInput}
            required
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-5 py-3 rounded hover:bg-blue-700"
        >
          Simpan
        </button>
      </form>
    </div>
  );
}
