import React, { useState } from "react";
import Sidnav from "./Sidnav";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import "remixicon/fonts/remixicon.css";

export default function TagihanDashboard() {
  const [tagihan, setTagihan] = useState([
     
  ]);

  const [modal, setModal] = useState({ open: false, type: "", data: {} });
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const totalTagihan = tagihan.length;
  const totalLunas = tagihan.filter(t => t.status === "Lunas").length;
  const totalBelum = tagihan.filter(t => t.status === "Belum Lunas").length;
  const totalNominal = tagihan.reduce((sum, t) => sum + t.jumlah, 0);

  
 const handleBayar = (id) => {
  const tagihanDipilih = tagihan.find(t => t.id === id);

  Swal.fire({
    title: "Masukkan Jumlah Pembayaran",
    text: `Tagihan atas nama ${tagihanDipilih.nama} sebesar Rp ${tagihanDipilih.jumlah.toLocaleString()}`,
    input: "number",
    inputAttributes: {
      min: 0,
      max: tagihanDipilih.jumlah,
      step: 1000,
    },
    inputPlaceholder: "Masukkan jumlah yang dibayar...",
    showCancelButton: true,
    confirmButtonText: "Bayar",
    cancelButtonText: "Batal",
    confirmButtonColor: "#16a34a",
    cancelButtonColor: "#d33",
    preConfirm: (value) => {
      if (!value || value <= 0) {
        Swal.showValidationMessage("Masukkan jumlah yang valid!");
        return false;
      }
      if (value > tagihanDipilih.jumlah) {
        Swal.showValidationMessage("Jumlah tidak boleh melebihi total tagihan!");
        return false;
      }
      return value;
    },
  }).then((result) => {
    if (result.isConfirmed) {
      const jumlahBayar = parseInt(result.value);
      const sisa = tagihanDipilih.jumlah - jumlahBayar;

      if (sisa === 0) {
        setTagihan(tagihan.map(t => (t.id === id ? { ...t, status: "Lunas" } : t)));
        Swal.fire("Lunas!", "Tagihan telah dibayar penuh.", "success");
      } else {
        setTagihan(tagihan.map(t => (
          t.id === id ? { ...t, jumlah: sisa, status: "Belum Lunas" } : t
        )));
        Swal.fire(
          "Sebagian Terbayar",
          `Pembayaran sebesar Rp ${jumlahBayar.toLocaleString()} berhasil.\nSisa tagihan: Rp ${sisa.toLocaleString()}`,
          "info"
        );
      }
    }
  });
};


   
  const handleHapus = (id) => {
    Swal.fire({
      title: "Hapus Data?",
      text: "Data tagihan ini akan dihapus secara permanen!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Hapus",
      cancelButtonText: "Batal",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6b7280",
    }).then((result) => {
      if (result.isConfirmed) {
        setTagihan(tagihan.filter(t => t.id !== id));
        Swal.fire("Terhapus!", "Data berhasil dihapus.", "success");
      }
    });
  };

 
  const handleAdd = () => setModal({ open: true, type: "add", data: {} });
  const handleEdit = (item) => setModal({ open: true, type: "edit", data: item });

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const data = {
      nama: form.nama.value,
      kelas: form.kelas.value,
      bulan: form.bulan.value,
      jumlah: parseInt(form.jumlah.value),
      status: form.status.value,
    };

    if (modal.type === "add") {
      setTagihan([...tagihan, { ...data, id: Date.now() }]);
      Swal.fire("Berhasil!", "Tagihan baru berhasil ditambahkan.", "success");
    } else {
      setTagihan(tagihan.map(t => (t.id === modal.data.id ? { ...t, ...data } : t)));
      Swal.fire("Diperbarui!", "Data tagihan berhasil diperbarui.", "success");
    }

    setModal({ open: false, type: "", data: {} });
  };

  const filtered = tagihan
    .filter(t => t.nama.toLowerCase().includes(search.toLowerCase()))
    .filter(t => (filterStatus ? t.status === filterStatus : true));

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <Sidnav />

      <main className="flex-1 ml-48 p-8 transition-all duration-300">
      
        <header className="mb-6">
          <h1 className="text-3xl font-bold text-blue-900 flex items-center">
            <i className="ri-money-dollar-circle-line text-blue-700 mr-2"></i>
           Tagihan Siswa
          </h1>
          <p className="text-gray-600 mt-1">
            Kelola data tagihan siswa: lihat status, tambah, ubah, atau hapus.
          </p>
        </header>

     
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Total Tagihan", value: totalTagihan, color: "bg-blue-100 text-blue-800" },
            { label: "Lunas", value: totalLunas, color: "bg-green-100 text-green-800" },
            { label: "Belum Lunas", value: totalBelum, color: "bg-red-100 text-red-800" },
            { label: "Total Nominal", value: `Rp ${totalNominal.toLocaleString()}`, color: "bg-yellow-100 text-yellow-800" },
          ].map((card, i) => (
            <div key={i} className={`${card.color} p-5 rounded-lg shadow-sm text-center`}>
              <p className="text-sm font-medium">{card.label}</p>
              <h2 className="text-2xl font-bold mt-1">{card.value}</h2>
            </div>
          ))}
        </section>

    
        <div className="flex flex-col md:flex-row gap-3 mb-4 items-center">
          <input
            type="text"
            placeholder="🔍 Cari nama siswa..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-blue-300 px-4 py-2 rounded w-full md:w-1/3 focus:ring focus:ring-blue-200 outline-none"
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border border-blue-300 px-4 py-2 rounded w-full md:w-1/4 focus:ring focus:ring-blue-200 outline-none"
          >
            <option value="">Semua Status</option>
            <option value="Belum Lunas">Belum Lunas</option>
            <option value="Lunas">Lunas</option>
          </select>
          <button
            onClick={handleAdd}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2 transition"
          >
            <i className="ri-add-circle-line text-lg"></i> Tambah
          </button>
        </div>

        {/* === TABEL === */}
        <div className="overflow-x-auto bg-white rounded-lg shadow border border-blue-100">
          <table className="min-w-full text-sm border-collapse">
            <thead className="bg-blue-50 text-blue-900 font-semibold">
              <tr>
                {["No", "Nama", "Kelas", "Bulan", "Jumlah", "Status", "Aksi"].map((h, i) => (
                  <th key={i} className="border border-blue-200 px-4 py-2 text-center">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length ? (
                filtered.map((t, i) => (
                  <tr key={t.id} className="even:bg-blue-50 hover:bg-blue-100 transition">
                    <td className="border border-blue-200 px-4 py-2 text-center">{i + 1}</td>
                    <td className="border border-blue-200 px-4 py-2">{t.nama}</td>
                    <td className="border border-blue-200 px-4 py-2">{t.kelas}</td>
                    <td className="border border-blue-200 px-4 py-2">{t.bulan}</td>
                    <td className="border border-blue-200 px-4 py-2 text-right">{t.jumlah.toLocaleString()}</td>
                    <td
                      className={`border border-blue-200 px-4 py-2 font-semibold ${
                        t.status === "Lunas" ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {t.status}
                    </td>
                    <td className="border border-blue-200 px-4 py-2 text-center">
                      <div className="flex justify-center gap-2">
                        {t.status === "Belum Lunas" && (
                          <button
                            onClick={() => handleBayar(t.id)}
                            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                          >
                            Bayar
                          </button>
                        )}
                        <button
                          onClick={() => handleEdit(t)}
                          className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleHapus(t.id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                        >
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-6 text-gray-600">
                    Tidak ada data
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* === MODAL === */}
        {modal.open && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 animate-fadeIn">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md transform scale-100 transition">
              <h2 className="text-xl mb-4 font-semibold text-blue-800 text-center">
                {modal.type === "add" ? "Tambah Tagihan" : "Edit Tagihan"}
              </h2>
              <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <input name="nama" defaultValue={modal.data.nama || ""} placeholder="Nama" className="border px-3 py-2 rounded" required />
                <input name="kelas" defaultValue={modal.data.kelas || ""} placeholder="Kelas" className="border px-3 py-2 rounded" required />
                <input name="bulan" defaultValue={modal.data.bulan || ""} placeholder="Bulan" className="border px-3 py-2 rounded" required />
                <input name="jumlah" type="number" defaultValue={modal.data.jumlah || ""} placeholder="Jumlah" className="border px-3 py-2 rounded" required />
                <select name="status" defaultValue={modal.data.status || "Belum Lunas"} className="border px-3 py-2 rounded">
                  <option value="Belum Lunas">Belum Lunas</option>
                  <option value="Lunas">Lunas</option>
                </select>
                <div className="flex justify-end gap-3 mt-4">
                  <button
                    type="button"
                    onClick={() => setModal({ open: false, type: "", data: {} })}
                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                  >
                    Batal
                  </button>
                  <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                    Simpan
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
