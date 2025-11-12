import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom"; // Untuk navigasi ke form tambah

const API = "http://localhost:5000/tagihan";  // Endpoint JSON Server

export default function Tagihan() {
  const navigate = useNavigate(); // Hook untuk navigasi ke halaman tambah tagihan
  const [tagihan, setTagihan] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    id: "",
    nama: "",
    kelas: "",
    bulan: "",
    jumlah: "",
    status: "Belum Lunas",
    kategori: "SPP",
  });
  const [isSlideOpen, setIsSlideOpen] = useState(false);

  const formatRp = (n) => "Rp " + Number(n).toLocaleString("id-ID");

  // Ambil data tagihan dari API
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(API);
      setTagihan(response.data);
    } catch (error) {
      Swal.fire("Error", "Gagal memuat data", "error");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Fungsi untuk membuka form untuk tambah atau edit tagihan
  const openSlide = (item = null) => {
    if (item) {
      setFormData({
        id: item.id,
        nama: item.nama ?? "",
        kelas: item.kelas ?? "",
        bulan: item.bulan ?? "",
        jumlah: item.jumlah ?? "",
        status: item.status ?? "Belum Lunas",
        kategori: item.kategori ?? "SPP",
      });
    } else {
      setFormData({
        id: "",
        nama: "",
        kelas: "",
        bulan: "",
        jumlah: "",
        status: "Belum Lunas",
        kategori: "SPP",
      });
    }
    setIsSlideOpen(true);
  };

  const closeSlide = () => setIsSlideOpen(false);

  // Fungsi untuk menyimpan data (Tambah/Edit)
  const saveForm = async () => {
    const dataToSave = { ...formData, jumlah: Number(formData.jumlah) };

    try {
      if (formData.id) {
        // Edit tagihan
        await axios.put(`${API}/${formData.id}`, dataToSave);
      } else {
        // Tambah tagihan baru
        dataToSave.id = Date.now();  // ID unik berdasarkan timestamp
        await axios.post(API, dataToSave);
      }

      closeSlide();
      fetchData();
      Swal.fire("Berhasil", "Data disimpan", "success");
    } catch (error) {
      Swal.fire("Error", "Gagal menyimpan", "error");
    }
  };

  // Fungsi untuk menghapus tagihan
  const handleDelete = (id) => {
    Swal.fire({
      title: "Yakin ingin menghapus?",
      text: "Data tidak dapat dikembalikan setelah dihapus!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${API}/${id}`);
          Swal.fire("Berhasil!", "Data telah dihapus.", "success");
          fetchData();
        } catch (error) {
          Swal.fire("Error", "Gagal menghapus data", "error");
        }
      }
    });
  };

  return (
    <div className="ml-56 p-8 bg-gradient-to-br from-blue-50 to-white min-h-screen">
      <h1 className="text-4xl font-extrabold text-blue-700 mb-6">📘 Data Tagihan</h1>

      {/* Tabel Tagihan */}
      <div className="bg-white p-6 rounded-2xl shadow-xl border border-blue-100">
        {/* Ganti tombol tambah dengan navigasi ke halaman form */}
        <button
          onClick={() => navigate("/tambahkategoril")} // Arahkan ke form tambah tagihan
          className="mb-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl shadow active:scale-95 transition"
        >
          + Tambah Tagihan
        </button>

        <div className="overflow-hidden rounded-xl border border-blue-200">
          <table className="w-full">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="p-3">No</th>
                <th className="p-3">Nama</th>
                <th className="p-3">Kelas</th>
                <th className="p-3">Bulan</th>
                <th className="p-3">Jumlah</th>
                <th className="p-3">Status</th>
                <th className="p-3">Kategori</th>
                <th className="p-3 text-center">Aksi</th>
              </tr>
            </thead>

            <tbody className="bg-white">
              {loading ? (
                <tr>
                  <td colSpan={8} className="p-6 text-center">
                    ⏳ Memuat data...
                  </td>
                </tr>
              ) : tagihan.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-6 text-center text-gray-500">
                    Tidak ada data
                  </td>
                </tr>
              ) : (
                tagihan.map((t, i) => (
                  <tr key={t.id} className="border-b hover:bg-blue-50 transition">
                    <td className="p-3">{i + 1}</td>
                    <td className="p-3 font-semibold text-blue-700">{t.nama}</td>
                    <td className="p-3">{t.kelas}</td>
                    <td className="p-3">{t.bulan}</td>
                    <td className="p-3">{formatRp(t.jumlah)}</td>
                    <td className="p-3">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          t.status === "Lunas"
                            ? "bg-green-100 text-green-600"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {t.status}
                      </span>
                    </td>
                    <td className="p-3">{t.kategori}</td>

                    <td className="p-3 flex justify-center gap-3">
                      <button
                        onClick={() => openSlide(t)}
                        className="p-2 rounded-lg bg-yellow-400 hover:bg-yellow-500 text-white"
                      >
                        ✏
                      </button>
                      <button
                        onClick={() => handleDelete(t.id)}
                        className="p-2 rounded-lg bg-red-600 hover:bg-red-700 text-white"
                      >
                        🗑
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-3 text-gray-600">
          Menampilkan {tagihan.length} item
        </div>
      </div>

      {/* Form untuk Tambah/Edit Tagihan */}
      {isSlideOpen && (
        <div className="fixed top-0 right-0 w-96 h-full bg-white shadow-2xl border-l border-blue-200 p-6 z-50 animate-slide-left">
          <h2 className="text-3xl font-extrabold text-blue-700 mb-6">
            {formData.id ? "Edit Tagihan" : "Tambah Tagihan"}
          </h2>

          <div className="flex flex-col gap-4">
            <input
              className="border p-3 rounded-xl bg-blue-50"
              placeholder="Nama"
              value={formData.nama}
              onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
            />
            <input
              className="border p-3 rounded-xl bg-blue-50"
              placeholder="Kelas"
              value={formData.kelas}
              onChange={(e) => setFormData({ ...formData, kelas: e.target.value })}
            />
            <input
              className="border p-3 rounded-xl bg-blue-50"
              placeholder="Bulan"
              value={formData.bulan}
              onChange={(e) => setFormData({ ...formData, bulan: e.target.value })}
            />
            <input
              type="number"
              className="border p-3 rounded-xl bg-blue-50"
              placeholder="Jumlah"
              value={formData.jumlah}
              onChange={(e) => setFormData({ ...formData, jumlah: e.target.value })}
            />
            <select
              className="border p-3 rounded-xl bg-blue-50"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            >
              <option value="Belum Lunas">Belum Lunas</option>
              <option value="Lunas">Lunas</option>
            </select>

            <select
              className="border p-3 rounded-xl bg-blue-50"
              value={formData.kategori}
              onChange={(e) => setFormData({ ...formData, kategori: e.target.value })}
            >
              <option value="SPP">SPP</option>
              <option value="Kegiatan">Kegiatan</option>
              <option value="Ujian">Ujian</option>
              <option value="Lainnya">Lainnya</option>
            </select>
          </div>

          <div className="mt-8 flex gap-3">
            <button onClick={saveForm} className="flex-1 bg-blue-600 text-white py-3 rounded-xl">
              Simpan
            </button>

            <button onClick={closeSlide} className="flex-1 bg-gray-300 text-black py-3 rounded-xl">
              Batal
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
