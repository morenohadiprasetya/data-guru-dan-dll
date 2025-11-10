import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

const API = "http://localhost:5000/tagihan"; 

function formatRp(n = 0) {
  try {
    return "Rp " + Number(n).toLocaleString();
  } catch {
    return "Rp 0";
  }
}

export default function Tagihan() {
  const [tagihan, setTagihan] = useState([]);
  const [input, setInput] = useState({
    nama: "",
    kelas: "",
    bulan: "",
    jumlah: "",
    status: "Belum Lunas",
  });
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const res = await fetch(API);
    const data = await res.json();
    setTagihan(data);
  };

  const handleChange = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (!input.nama || !input.kelas || !input.bulan || !input.jumlah) {
      Swal.fire({
        icon: "warning",
        title: "Data belum lengkap!",
        text: "Semua field wajib diisi!",
      });
      return;
    }

    const newTagihan = { ...input, id: Date.now() }; // pastikan id unik

    await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTagihan),
    });

    Swal.fire({
      title: "Berhasil!",
      text: "Data tagihan ditambahkan.",
      icon: "success",
      timer: 1500,
      showConfirmButton: false,
    });

    setInput({
      nama: "",
      kelas: "",
      bulan: "",
      jumlah: "",
      status: "Belum Lunas",
    });

    setModalOpen(false);
    loadData(); // refresh data dari server
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Hapus data?",
      text: "Data yang dihapus tidak bisa dikembalikan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Hapus",
      cancelButtonText: "Batal",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await fetch(`http://localhost:5000/tagihan/${id}`, { method: "DELETE" }); // hapus dari server
        Swal.fire({
          title: "Dihapus!",
          icon: "success",
          timer: 1200,
          showConfirmButton: false,
        });
        loadData(); // refresh data
      }
    });
  };

  const openBayarModal = (id) => {
    const item = tagihan.find((t) => t.id === id);
    if (!item) return;

    Swal.fire({
      title: `Tagihan ${item.nama}`,
      text: `Jumlah: ${formatRp(item.jumlah)}`,
      showCancelButton: true,
      showDenyButton: true,
      confirmButtonText: "Bayar Semua",
      denyButtonText: "Bayar Sebagian",
      cancelButtonText: "Batal",
      icon: "question",
    }).then(async (result) => {
      if (result.isConfirmed) {
        // bayar semua
        await fetch(`${API}/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...item, jumlah: 0, status: "Lunas" }),
        });

        Swal.fire({
          icon: "success",
          title: "Pembayaran Lunas!",
          timer: 1500,
          showConfirmButton: false,
        });
        loadData();
      } else if (result.isDenied) {
        // bayar sebagian
        Swal.fire({
          title: "Masukkan jumlah yang ingin dibayar",
          input: "number",
          inputPlaceholder: "Contoh: 50000",
          showCancelButton: true,
          confirmButtonText: "Bayar Sebagian",
          cancelButtonText: "Batal",
        }).then(async (res) => {
          if (res.isConfirmed && res.value) {
            const bayar = Number(res.value);
            const sisa = item.jumlah - bayar;
            const status = sisa <= 0 ? "Lunas" : "Belum Lunas";

            await fetch(`${API}/${id}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ ...item, jumlah: sisa, status }),
            });

            Swal.fire({
              icon: "success",
              title: `Pembayaran Sebagian Berhasil! Sisa: ${formatRp(sisa)}`,
              timer: 1500,
              showConfirmButton: false,
            });

            loadData();
          }
        });
      }
    });
  };

  return (
    <div className="p-6 bg-gray-100 ml-39 min-h-screen">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold text-blue-600">📄 Data Tagihan</h1>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
            onClick={() => setModalOpen(true)}
          >
            Tambah Tagihan
          </button>
        </div>

        <table className="w-full border text-sm">
          <thead className="bg-blue-500 text-white">
            <tr>
              <th className="p-2 border">No</th>
              <th className="p-2 border">Nama</th>
              <th className="p-2 border">Kelas</th>
              <th className="p-2 border">Bulan</th>
              <th className="p-2 border">Jumlah</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {tagihan.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center p-4 text-gray-500">
                  Belum ada data
                </td>
              </tr>
            ) : (
              tagihan.map((t, i) => (
                <tr key={t.id} className="hover:bg-gray-100">
                  <td className="p-2 border text-center">{i + 1}</td>
                  <td className="p-2 border">{t.nama}</td>
                  <td className="p-2 border">{t.kelas}</td>
                  <td className="p-2 border">{t.bulan}</td>
                  <td className="p-2 border">{formatRp(t.jumlah)}</td>
                  <td className="p-2 border font-semibold">
                    {t.status === "Lunas" ? (
                      <span className="text-green-600">Lunas</span>
                    ) : (
                      <span className="text-red-600">Belum Lunas</span>
                    )}
                  </td>
                  <td className="p-2 border text-center space-x-2">
                    {t.status !== "Lunas" && (
                      <button
                        onClick={() => openBayarModal(t.id)}
                        className="px-3 py-1 bg-green-600 text-white rounded"
                      >
                        Bayar
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(t.id)}
                      className="px-3 py-1 bg-red-600 text-white rounded"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white w-96 p-6 rounded-xl shadow-lg animate-fadeIn">
            <h2 className="text-xl font-bold text-blue-600 mb-4">Tambah Tagihan</h2>
            <input
              type="text"
              name="nama"
              placeholder="Nama"
              value={input.nama}
              onChange={handleChange}
              className="w-full p-2 border rounded mb-3"
            />
            <input
              type="text"
              name="kelas"
              placeholder="Kelas"
              value={input.kelas}
              onChange={handleChange}
              className="w-full p-2 border rounded mb-3"
            />
            <input
              type="text"
              name="bulan"
              placeholder="Bulan"
              value={input.bulan}
              onChange={handleChange}
              className="w-full p-2 border rounded mb-3"
            />
            <input
              type="number"
              name="jumlah"
              placeholder="Jumlah"
              value={input.jumlah}
              onChange={handleChange}
              className="w-full p-2 border rounded mb-3"
            />
            <div className="flex justify-end space-x-3 mt-4">
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 bg-gray-400 text-white rounded"
              >
                Batal
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
