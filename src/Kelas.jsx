import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";

export default function Kelas() {
  const [kelas, setKelas] = useState([]);
  const [form, setForm] = useState({ id: "", nama: "", kelas: "", jurusan: "" });
  const [isEdit, setIsEdit] = useState(false);
  const api = "http://localhost:5000/kelas";

  useEffect(() => {
    getKelas();
  }, []);

  const getKelas = async () => {
    try {
      const res = await fetch(api);
      const data = await res.json();
      setKelas(data);
    } catch (err) {
      console.error("Gagal memuat data kelas:", err);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.nama || !form.kelas) {
      Swal.fire("Peringatan", "Nama dan Kelas wajib diisi!", "warning");
      return;
    }

    try {
      if (isEdit) {
        await fetch(`${api}/${form.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        Swal.fire("Berhasil", "Data kelas berhasil diubah!", "success");
      } else {
        await fetch(api, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        Swal.fire("Berhasil", "Data kelas berhasil ditambahkan!", "success");
      }
      setForm({ id: "", nama: "", kelas: "", jurusan: "" });
      setIsEdit(false);
      getKelas();
    } catch (error) {
      Swal.fire("Error", "Gagal menyimpan data kelas!", "error");
    }
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Hapus data?",
      text: "Data tidak bisa dikembalikan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Hapus",
      cancelButtonText: "Batal",
    });

    if (confirm.isConfirmed) {
      await fetch(`${api}/${id}`, { method: "DELETE" });
      Swal.fire("Terhapus!", "Data kelas sudah dihapus.", "success");
      getKelas();
    }
  };

  const handleEdit = (data) => {
    setForm(data);
    setIsEdit(true);
  };

  return (
    <div className=" ml-50">
      <div className="max-w-5xl mx-auto bg-white p-8 rounded-2xl shadow-lg border border-blue-100">
        <h1 className="text-3xl font-extrabold text-blue-800 text-center mb-6">
          📘 Master Data Kelas
        </h1>
 
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
        >
          <input
            type="text"
            name="nama"
            placeholder="Nama (misal: Andi)"
            value={form.nama}
            onChange={handleChange}
            className="border border-blue-300 focus:ring-2 focus:ring-blue-400 p-3 rounded-lg outline-none bg-blue-50"
          />
          <input
            type="text"
            name="kelas"
            placeholder="Kelas (misal: 10A)"
            value={form.kelas}
            onChange={handleChange}
            className="border border-blue-300 focus:ring-2 focus:ring-blue-400 p-3 rounded-lg outline-none bg-blue-50"
          />
          <input
            type="text"
            name="jurusan"
            placeholder="Jurusan (misal: IPA/IPS)"
            value={form.jurusan}
            onChange={handleChange}
            className="border border-blue-300 focus:ring-2 focus:ring-blue-400 p-3 rounded-lg outline-none bg-blue-50"
          />
          <button
            type="submit"
            className={`col-span-full py-3 rounded-lg text-white font-semibold transition-all ${
              isEdit
                ? "bg-yellow-500 hover:bg-yellow-600"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isEdit ? "💾 Simpan Perubahan" : "➕ Tambah Kelas"}
          </button>
        </form>

      
        <div className="overflow-x-auto rounded-xl border border-blue-200 shadow-sm">
          <table className="w-full text-sm text-blue-900 border-collapse">
            <thead className="bg-blue-200 text-blue-900">
              <tr>
                <th className="p-3 text-left font-semibold border">No</th>
                <th className="p-3 text-left font-semibold border">Nama</th>
                <th className="p-3 text-left font-semibold border">Kelas</th>
                <th className="p-3 text-left font-semibold border">Jurusan</th>
                <th className="p-3 text-center font-semibold border">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {kelas.length > 0 ? (
                kelas.map((item, i) => (
                  <tr
                    key={item.id}
                    className={`${
                      i % 2 === 0 ? "bg-white" : "bg-blue-50"
                    } hover:bg-blue-100 transition-colors`}
                  >
                    <td className="p-3 border">{i + 1}</td>
                    <td className="p-3 border font-medium">{item.nama}</td>
                    <td className="p-3 border">{item.kelas}</td>
                    <td className="p-3 border">{item.jurusan}</td>
                    <td className="p-3 border text-center">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handleEdit(item)}
                          className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded-md transition-all"
                        >
                          <i className="ri-edit-2-line"></i>
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md transition-all"
                        >
                          <i className="ri-delete-bin-6-line"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center p-6 text-gray-500">
                    Belum ada data kelas
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
