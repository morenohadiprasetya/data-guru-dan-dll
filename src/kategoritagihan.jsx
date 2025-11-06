// src/KategoriTagihan.jsx
import React, { useEffect, useState } from "react";
import Sidnav from "./Sidnav";
import Swal from "sweetalert2";
import "remixicon/fonts/remixicon.css";

export default function KategoriTagihan() {
  const API = "http://localhost:5000";

  const [kategori, setKategori] = useState("Siswa");
  const [dataSumber, setDataSumber] = useState({ Siswa: [], Guru: [], Karyawan: [] });
  const [dataTagihan, setDataTagihan] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      const [sRes, gRes, kRes, tRes] = await Promise.all([
        fetch(`${API}/siswa`),
        fetch(`${API}/guru`),
        fetch(`${API}/karyawan`),
        fetch(`${API}/tagihan`),
      ]);
      const [s, g, k, t] = await Promise.all([sRes.json(), gRes.json(), kRes.json(), tRes.json()]);
      setDataSumber({ Siswa: s, Guru: g, Karyawan: k });
      setDataTagihan(t);
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Gagal memuat data", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getListByKategori = (cat) => dataSumber[cat] || [];
  const getNamaUserById = (cat, id) => {
    const item = getListByKategori(cat).find((x) => x.id === id);
    return item ? item.nama : "-";
  };
  const getKetUserById = (cat, id) => {
    const item = getListByKategori(cat).find((x) => x.id === id);
    return item ? item.ket : "-";
  };

  const filteredData = dataTagihan.filter(
    (t) =>
      getNamaUserById(t.kategori, t.userId).toLowerCase().includes(search.toLowerCase()) ||
      (t.deskripsi || "").toLowerCase().includes(search.toLowerCase())
  );

  // Tambah / Edit Tagihan
  const handleEdit = (item = null) => {
    const isEdit = !!item;
    const swalTitle = isEdit ? "Edit Tagihan" : "Tambah Tagihan";

    Swal.fire({
      title: swalTitle,
      html: `
        <div class="grid gap-3 text-left">
          <label>Kategori</label>
          <select id="swal-kategori" class="border p-2 rounded w-full">
            <option value="Siswa" ${item?.kategori === "Siswa" ? "selected" : ""}>Siswa</option>
            <option value="Guru" ${item?.kategori === "Guru" ? "selected" : ""}>Guru</option>
            <option value="Karyawan" ${item?.kategori === "Karyawan" ? "selected" : ""}>Karyawan</option>
          </select>

          <label>Nama</label>
          <input id="swal-user" class="border p-2 rounded w-full" value="${item?.nama || ""}" placeholder="Masukkan nama..." />

          <label>Keterangan</label>
          <input id="swal-ket" class="border p-2 rounded w-full" value="${item?.ket || ""}" placeholder="Masukkan keterangan..." />
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Simpan",
      preConfirm: () => {
        const kategori = document.getElementById("swal-kategori").value;
        const nama = document.getElementById("swal-user").value;
        const ket = document.getElementById("swal-ket").value;
        if (!nama || !ket) Swal.showValidationMessage("Semua field harus diisi!");
        return { kategori, nama, ket };
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
            body: JSON.stringify({ ...result.value, id: Date.now() }),
          });
          Swal.fire("Berhasil", "Data ditambahkan", "success");
        }
        fetchData();
      } catch (err) {
        Swal.fire("Error", "Gagal menyimpan data", "error");
      }
    });
  };

  // Hapus tagihan
  const handleHapus = async (id) => {
    const res = await Swal.fire({
      title: "Hapus data ini?",
      text: "Data tidak bisa dikembalikan",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus",
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
        <h2 className="text-2xl font-bold text-blue-900 mb-6 flex items-center gap-2">
          <i className="ri-list-check text-blue-700"></i> Kategori Tagihan
        </h2>

        <div className="mb-4 flex gap-4 items-center">
          <select
            value={kategori}
            onChange={(e) => setKategori(e.target.value)}
            className="border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400"
          >
            <option value="Siswa">Siswa</option>
            <option value="Guru">Guru</option>
            <option value="Karyawan">Karyawan</option>
          </select>

          <input
            type="text"
            placeholder="Cari nama atau keterangan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border rounded-md px-3 py-2 flex-1 focus:ring-2 focus:ring-blue-400"
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
                {filteredData.map((d, i) => (
                  <tr key={d.id} className={i % 2 === 0 ? "bg-white" : "bg-blue-50"}>
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
