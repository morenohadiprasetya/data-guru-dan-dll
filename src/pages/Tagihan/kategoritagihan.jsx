 
import React, { useEffect, useState } from "react";
import Sidnav from "../../Komponen/sidnav";
import Swal from "sweetalert2";
import "remixicon/fonts/remixicon.css";

export default function KategoriTagihan() {
  const API = "http://localhost:5000";

  const [kategori, setKategori] = useState("Siswa");
  const [dataTagihan, setDataTagihan] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

   
  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API}/tagihan`);
      const t = await res.json();
      setDataTagihan(t);
    } catch (err) {
      Swal.fire("Error", "Gagal memuat data", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredData = dataTagihan.filter(
    (t) =>
      (t.nama || "").toLowerCase().includes(search.toLowerCase()) ||
      (t.ket || "").toLowerCase().includes(search.toLowerCase())
  );

 
  const handleEdit = (item = null) => {
    const isEdit = !!item;
    const swalTitle = isEdit ? "Edit Tagihan" : "Tambah Tagihan";

    Swal.fire({
      title: swalTitle,
      html: `
        <div class="grid gap-3 text-left">
          <label>Nama</label>
          <input id="swal-nama" class="border p-2 rounded w-full"
            value="${item?.nama || ""}" placeholder="Masukkan nama..." />

          <label>Keterangan</label>
          <input id="swal-ket" class="border p-2 rounded w-full"
            value="${item?.ket || ""}" placeholder="Masukkan keterangan..." />

          <label>Kategori</label>
          <input id="swal-kategori" type="text" class="border p-2 rounded w-full"
            value="${item?.kategori || kategori}" placeholder="Kategori..." />
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Simpan",
      preConfirm: () => {
        const nama = document.getElementById("swal-nama").value;
        const ket = document.getElementById("swal-ket").value;
        const kategoriVal = document.getElementById("swal-kategori").value;

        if (!nama || !ket || !kategoriVal) {
          Swal.showValidationMessage("Semua field harus diisi!");
        }

        return { nama, ket, kategori: kategoriVal };
      },
    }).then(async (result) => {
      if (!result.isConfirmed) return;

      try {
        if (isEdit) {
          await fetch(`${API}/tagihan/${item.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...item, ...result.value }),
          });
          Swal.fire("Berhasil", "Data diperbarui", "success");
        } else {
          await fetch(`${API}/tagihan`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ...result.value,
              id: Date.now(),
            }),
          });
          Swal.fire("Berhasil", "Data ditambahkan", "success");
        }
        fetchData();
      } catch (err) {
        Swal.fire("Error", "Gagal menyimpan data", "error");
      }
    });
  };

 
  const handleHapus = async (id) => {
    const res = await Swal.fire({
      title: "Hapus data?",
      text: "Data tidak bisa dikembalikan",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya",
      cancelButtonText: "Batal",
    });

    if (!res.isConfirmed) return;

    try {
      await fetch(`${API}/tagihan/${id}`, { method: "DELETE" });
      Swal.fire("Berhasil", "Data dihapus", "success");
      fetchData();
    } catch (err) {
      Swal.fire("Error", "Gagal menghapus data", "error");
    }
  };

  return (
    <div className="flex">
      <Sidnav />

      <div className="flex-1 ml-48 p-6 bg-gradient-to-br from-blue-50 to-blue-100 min-h-screen">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-blue-900">
          <i className="ri-list-check"></i> Kategori Tagihan
        </h2>

        <div className="mb-4 flex gap-4 items-center">
          <input
            type="text"
            placeholder="Cari nama atau keterangan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border rounded-md px-3 py-2 flex-1"
          />

          <button
            onClick={() => handleEdit(null)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2"
          >
            <i className="ri-add-circle-line"></i> Tambah Tagihan
          </button>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-md border border-blue-100 overflow-x-auto">
          {loading ? (
            <p className="text-center text-blue-600 py-6">⏳ Memuat data...</p>
          ) : filteredData.length === 0 ? (
            <p className="text-center text-blue-600 py-6">Belum ada data</p>
          ) : (
            <table className="min-w-full text-sm text-blue-900 border border-blue-200">
              <thead className="bg-blue-50 text-blue-800">
                <tr>
                  <th className="p-3 border">No</th>
                  <th className="p-3 border">Nama</th>
                  <th className="p-3 border">Keterangan</th>
                  <th className="p-3 border">Kategori</th>
                  <th className="p-3 border text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
               {filteredData
  .filter(d => d && d.nama)  
  .map((d, i) => (
    <tr
      key={d.id || i}  
      className={i % 2 === 0 ? "bg-white" : "bg-blue-50"}
    >
      <td className="p-3 border text-center">{i + 1}</td>
      <td className="p-3 border">{d.nama}</td>
      <td className="p-3 border">{d.ket}</td>
      <td className="p-3 border">{d.kategori}</td>
      <td className="p-3 border text-center space-x-2">
        <button
          onClick={() => handleEdit(d)}
          className="px-2 py-1 bg-yellow-500 hover:bg-yellow-600 text-white rounded-md"
        >
          <i className="ri-edit-line"></i>
        </button>
        <button
          onClick={() => handleHapus(d.id)}
          className="px-2 py-1 bg-red-500 hover:bg-red-600 text-white rounded-md"
        >
          <i className="ri-delete-bin-line"></i>
        </button>
      </td>
    </tr>
  ))}

              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
