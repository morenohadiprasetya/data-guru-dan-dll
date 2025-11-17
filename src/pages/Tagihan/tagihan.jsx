import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const API = "http://localhost:5000/tagihan";

export default function Tagihan() {
  const navigate = useNavigate();
  const [tagihan, setTagihan] = useState([]);
  const [loading, setLoading] = useState(true);

  // DATA UNTUK EDIT
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

  // ====================================================================
  // FETCH DATA
  // ====================================================================
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(API);
      setTagihan(response.data);
    } catch {
      Swal.fire("Error", "Gagal memuat data", "error");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ====================================================================
  // OPEN / CLOSE SLIDE FORM
  // ====================================================================
  const openSlide = (item = null) => {
    if (item) {
      setFormData({
        id: item.id,
        nama: item.nama,
        kelas: item.kelas,
        bulan: item.bulan,
        jumlah: item.jumlah,
        status: item.status,
        kategori: item.kategori,
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

  // ====================================================================
  // SAVE DATA (EDIT + TAMBAH)
  // ====================================================================
  const saveForm = async () => {
    const dataToSave = {
      ...formData,
      jumlah: Number(formData.jumlah),
    };

    try {
      if (formData.id) {
        await axios.put(`${API}/${formData.id}`, dataToSave);
      } else {
        dataToSave.id = Date.now();
        await axios.post(API, dataToSave);
      }

      closeSlide();
      fetchData();
      Swal.fire("Berhasil!", "Data berhasil disimpan.", "success");
    } catch {
      Swal.fire("Error", "Gagal menyimpan data", "error");
    }
  };

  // ====================================================================
  // DELETE DATA
  // ====================================================================
  const handleDelete = (id) => {
    Swal.fire({
      title: "Hapus data?",
      text: "Data yang dihapus tidak dapat dikembalikan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Hapus",
      cancelButtonText: "Batal",
    }).then(async (res) => {
      if (res.isConfirmed) {
        try {
          await axios.delete(`${API}/${id}`);
          fetchData();
          Swal.fire("Dihapus!", "Data berhasil dihapus.", "success");
        } catch {
          Swal.fire("Error", "Gagal menghapus data", "error");
        }
      }
    });
  };

  // ====================================================================
  // BAYAR (RECOMMENDED VERSION)
  // ====================================================================
  const handleBayar = (item) => {
    Swal.fire({
      title: "Pilih Metode Pembayaran",
      text: `${item.nama} - ${formatRp(item.jumlah)}`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Bayar Semua",
      cancelButtonText: "Bayar Sebagian",
      showDenyButton: true,
      denyButtonText: "Batal",
    }).then(async (result) => {
      // ==============================
      // BAYAR LUNAS
      // ==============================
      if (result.isConfirmed) {
        try {
          await axios.put(`${API}/${item.id}`, {
            ...item,
            jumlah: 0,
            status: "Lunas",
          });

          fetchData();
          Swal.fire("Berhasil!", "Tagihan sudah dibayar lunas.", "success");
        } catch {
          Swal.fire("Error", "Gagal memproses pembayaran", "error");
        }
      }

      // ==============================
      // BAYAR SEBAGIAN
      // ==============================
      else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire({
          title: "Masukkan jumlah pembayaran",
          input: "number",
          inputLabel: `Sisa: ${formatRp(item.jumlah)}`,
          inputAttributes: {
            min: 1000,
            max: item.jumlah,
          },
          showCancelButton: true,
          confirmButtonText: "Bayar",
          cancelButtonText: "Batal",
        }).then(async (res) => {
          if (!res.value) return;

          const bayar = Number(res.value);

          if (bayar <= 0 || bayar > item.jumlah) {
            return Swal.fire("Error", "Jumlah tidak valid!", "error");
          }

          const sisa = item.jumlah - bayar;

          try {
            await axios.put(`${API}/${item.id}`, {
              ...item,
              jumlah: sisa,
              status: sisa === 0 ? "Lunas" : "Belum Lunas",
            });

            fetchData();

            Swal.fire(
              "Berhasil!",
              sisa === 0
                ? "Tagihan telah lunas."
                : `Sisa tagihan: ${formatRp(sisa)}`,
              "success"
            );
          } catch {
            Swal.fire("Error", "Gagal menyimpan pembayaran", "error");
          }
        });
      }
    });
  };

  // ====================================================================
  // UI
  // ====================================================================
  return (
    <div className="ml-50 p-8 bg-gradient-to-br from-blue-50 to-white min-h-screen">
      <h1 className="text-4xl font-extrabold text-blue-700 mb-6">📘 Data Tagihan</h1>

      <div className="bg-white p-6 rounded-2xl shadow-xl border border-blue-100">
        <button
          onClick={() => navigate("/garoet")}
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

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="p-6 text-center">⏳ Memuat data...</td>
                </tr>
              ) : tagihan.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-6 text-center text-gray-500">Tidak ada data</td>
                </tr>
              ) : (
                tagihan.map((t, i) => (
                  <tr
                    key={t.id}
                    className="border-b hover:bg-blue-50 transition"
                  >
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
                      {/* BAYAR */}
                      <button
                        onClick={() => handleBayar(t)}
                        className="p-2 rounded bg-green-600 hover:bg-green-700 text-white"
                      >
                        💰
                      </button>

                      {/* EDIT */}
                      <button
                        onClick={() => openSlide(t)}
                        className="p-2 rounded bg-yellow-400 hover:bg-yellow-500 text-white"
                      >
                        ✏
                      </button>

                      {/* DELETE */}
                      <button
                        onClick={() => handleDelete(t.id)}
                        className="p-2 rounded bg-red-600 hover:bg-red-700 text-white"
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

      {/* SLIDE FORM EDIT / TAMBAH */}
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
              onChange={(e) =>
                setFormData({ ...formData, kategori: e.target.value })
              }
            >
              <option value="SPP">SPP</option>
              <option value="Kegiatan">Kegiatan</option>
              <option value="Ujian">Ujian</option>
              <option value="Lainnya">Lainnya</option>
            </select>
          </div>

          <div className="mt-8 flex gap-3">
            <button
              onClick={saveForm}
              className="flex-1 bg-blue-600 text-white py-3 rounded-xl"
            >
              Simpan
            </button>

            <button
              onClick={closeSlide}
              className="flex-1 bg-gray-300 text-black py-3 rounded-xl"
            >
              Batal
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
