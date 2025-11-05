import React, { useState, useEffect } from "react";
import Sidnav from "./Sidnav";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import "remixicon/fonts/remixicon.css";

export default function Masterdata() {
  const [kelas, setKelas] = useState([]);

  const [modal, setModal] = useState({ open: false, type: "", data: {} });
  const [search, setSearch] = useState("");

  // 🟢 Ambil data dari localStorage saat pertama kali render
  useEffect(() => {
    const stored = localStorage.getItem("dataKelas");
    if (stored) setKelas(JSON.parse(stored));
  }, []);

  // 🟡 Simpan ke localStorage setiap kali data berubah
  useEffect(() => {
    localStorage.setItem("dataKelas", JSON.stringify(kelas));
  }, [kelas]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const data = {
      nama: form.nama.value,
      wali: form.wali.value,
      jumlah: parseInt(form.jumlah.value),
    };

    if (modal.type === "add") {
      setKelas([...kelas, { ...data, id: Date.now() }]);
      Swal.fire("Berhasil!", "Kelas baru berhasil ditambahkan.", "success");
    } else {
      setKelas(
        kelas.map((k) => (k.id === modal.data.id ? { ...k, ...data } : k))
      );
      Swal.fire("Diperbarui!", "Data kelas berhasil diperbarui.", "success");
    }
    setModal({ open: false, type: "", data: {} });
  };

  const handleHapus = (id) => {
    Swal.fire({
      title: "Hapus Data?",
      text: "Data kelas ini akan dihapus permanen!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Hapus",
      cancelButtonText: "Batal",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6b7280",
    }).then((res) => {
      if (res.isConfirmed) {
        setKelas(kelas.filter((k) => k.id !== id));
        Swal.fire("Terhapus!", "Data berhasil dihapus.", "success");
      }
    });
  };

  const filtered = kelas.filter((k) =>
    k.nama.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <Sidnav />

      <main className="flex-1 ml-48 p-8 transition-all duration-300">
        <header className="mb-6">
          <h1 className="text-3xl font-bold text-blue-900 flex items-center">
            <i className="ri-database-2-line text-blue-700 mr-2"></i>
            Master Data Kelas
          </h1>
          <p className="text-gray-600 mt-1">
            Kelola data kelas dan wali kelas di sistem sekolah.
          </p>
        </header>

        {/* Ringkasan */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-100 p-5 rounded-lg text-center shadow">
            <p className="text-sm font-medium text-blue-800">Total Kelas</p>
            <h2 className="text-2xl font-bold text-blue-900 mt-1">
              {kelas.length}
            </h2>
          </div>
          <div className="bg-green-100 p-5 rounded-lg text-center shadow">
            <p className="text-sm font-medium text-green-800">Total Siswa</p>
            <h2 className="text-2xl font-bold text-green-900 mt-1">
              {kelas.reduce((sum, k) => sum + k.jumlah, 0)}
            </h2>
          </div>
          <div className="bg-yellow-100 p-5 rounded-lg text-center shadow">
            <p className="text-sm font-medium text-yellow-800">Wali Aktif</p>
            <h2 className="text-2xl font-bold text-yellow-900 mt-1">
              {kelas.length}
            </h2>
          </div>
        </section>

        {/* Pencarian dan Tambah */}
        <div className="flex flex-col md:flex-row gap-3 mb-4 items-center">
          <input
            type="text"
            placeholder="🔍 Cari nama kelas..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-blue-300 px-4 py-2 rounded w-full md:w-1/3 focus:ring focus:ring-blue-200 outline-none"
          />
          <button
            onClick={() => setModal({ open: true, type: "add", data: {} })}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2 transition"
          >
            <i className="ri-add-circle-line text-lg"></i> Tambah
          </button>
        </div>

        {/* Tabel Data */}
        <div className="overflow-x-auto bg-white rounded-lg shadow border border-blue-100">
          <table className="min-w-full text-sm border-collapse">
            <thead className="bg-blue-50 text-blue-900 font-semibold">
              <tr>
                {["No", "Nama Kelas", "Wali Kelas", "Jumlah Siswa", "Aksi"].map(
                  (h, i) => (
                    <th
                      key={i}
                      className="border border-blue-200 px-4 py-2 text-center"
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {filtered.length ? (
                filtered.map((k, i) => (
                  <tr
                    key={k.id}
                    className="even:bg-blue-50 hover:bg-blue-100 transition"
                  >
                    <td className="border border-blue-200 px-4 py-2 text-center">
                      {i + 1}
                    </td>
                    <td className="border border-blue-200 px-4 py-2">
                      {k.nama}
                    </td>
                    <td className="border border-blue-200 px-4 py-2">
                      {k.wali}
                    </td>
                    <td className="border border-blue-200 px-4 py-2 text-center">
                      {k.jumlah}
                    </td>
                    <td className="border border-blue-200 px-4 py-2 text-center">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() =>
                            setModal({ open: true, type: "edit", data: k })
                          }
                          className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleHapus(k.id)}
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
                  <td
                    colSpan="5"
                    className="text-center py-6 text-gray-600 italic"
                  >
                    Tidak ada data kelas.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Modal */}
        {modal.open && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 animate-fadeIn">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md transform scale-100 transition">
              <h2 className="text-xl mb-4 font-semibold text-blue-800 text-center">
                {modal.type === "add" ? "Tambah Kelas" : "Edit Kelas"}
              </h2>
              <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <input
                  name="nama"
                  defaultValue={modal.data.nama || ""}
                  placeholder="Nama Kelas"
                  className="border px-3 py-2 rounded"
                  required
                />
                <input
                  name="wali"
                  defaultValue={modal.data.wali || ""}
                  placeholder="Wali Kelas"
                  className="border px-3 py-2 rounded"
                  required
                />
                <input
                  name="jumlah"
                  type="number"
                  defaultValue={modal.data.jumlah || ""}
                  placeholder="Jumlah Siswa"
                  className="border px-3 py-2 rounded"
                  required
                />
                <div className="flex justify-end gap-3 mt-4">
                  <button
                    type="button"
                    onClick={() => setModal({ open: false, type: "", data: {} })}
                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
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
