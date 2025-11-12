import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { CButton, CFormInput } from "@coreui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faTrash,
  faPlus,
  faSearch,
  faUserGraduate,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

export default function KategoriData() {
  const [kategori, setKategori] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

 const API = "http://localhost:5000/kategoriTagihan";

  
  const fetchData = async () => {
    try {
      const res = await axios.get(API);
      setKategori(res.data);
    } catch (error) {
      console.error("Gagal mengambil data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

   
  const filteredKategori = kategori.filter(
    (item) =>
      item.nama?.toLowerCase().includes(search.toLowerCase()) ||
      item.kelas?.toLowerCase().includes(search.toLowerCase()) ||
      item.alamat?.toLowerCase().includes(search.toLowerCase()) ||
      item.no_hp?.toLowerCase().includes(search.toLowerCase())
  );

   
  const handleDelete = (id) => {
    Swal.fire({
      title: "Hapus data?",
      text: "Data tidak dapat dikembalikan setelah dihapus!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e11d48",
      cancelButtonColor: "#3b82f6",
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await axios.delete(`${API}/${id}`);
        Swal.fire("Dihapus!", "Data telah dihapus.", "success");
        fetchData();
      }
    });
  };

  return (
    <div className="ml-56 mr-10 p-8 bg-gradient-to-br from-blue-100 via-white to-blue-50 min-h-screen transition-all duration-500">
    
      <div className="flex justify-between items-center mb-8 animate-fadeIn">
        <div>
          <h2 className="text-4xl font-extrabold text-blue-700 flex items-center gap-3 drop-shadow-sm">
            <FontAwesomeIcon icon={faUserGraduate} className="text-blue-600" />
            Data Kategori
          </h2>
          <p className="text-gray-500 mt-1">
            Kelola data siswa / kategori dengan mudah.
          </p>
        </div>

        <CButton
          onClick={() => navigate("/tambahkategori")}
          className="flex items-center gap-2 px-5 py-3 text-white text-base font-semibold rounded-xl shadow-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-indigo-600 hover:to-blue-700 hover:scale-[1.03] transition-transform duration-200"
        >
          <FontAwesomeIcon icon={faPlus} />
          Tambah Data
        </CButton>
      </div>

      {/* SEARCH */}
      <div className="relative mb-6 w-80">
        <FontAwesomeIcon
          icon={faSearch}
          className="absolute left-4 top-3.5 text-gray-400"
        />
        <CFormInput
          placeholder="Cari nama, kelas, atau alamat..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 py-3 rounded-2xl shadow-md border border-blue-200 bg-white/60 backdrop-blur-sm focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
        />
      </div>

      {/* TABLE */}
      <div className="backdrop-blur-md bg-white/70 rounded-3xl shadow-xl border border-blue-100 overflow-hidden transition-all">
      <table className="w-full text-center border-collapse">
  <thead className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm uppercase tracking-wide">
    <tr>
      <th className="py-4">No</th>
      <th className="py-4">Nama Kategori</th>
      <th className="py-4">Aksi</th>
    </tr>
  </thead>

  <tbody>
    {filteredKategori.length > 0 ? (
      filteredKategori.map((item, index) => (
        <tr
          key={item.id}
          className="border-b border-blue-100 hover:bg-blue-50/70 transition duration-200"
        >
          <td className="py-3 font-semibold text-blue-600">{index + 1}</td>
          <td className="py-3 text-gray-800">{item.nama}</td>
          <td className="py-3">
            <div className="flex justify-center gap-3">
              <button
                onClick={() => navigate(`/editkategori/${item.id}`)}
                className="p-2 bg-yellow-400 hover:bg-yellow-500 text-white rounded-lg shadow-md hover:scale-105 transition-transform"
              >
                <FontAwesomeIcon icon={faEdit} />
              </button>

              <button
                onClick={() => handleDelete(item.id)}
                className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow-md hover:scale-105 transition-transform"
              >
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </div>
          </td>
        </tr>
      ))
    ) : (
      <tr>
        <td colSpan="3" className="py-5 text-gray-500 italic">
          Tidak ada data kategori 😕
        </td>
      </tr>
    )}
  </tbody>
</table>

      </div>

 
      <div className="mt-5 text-gray-500 text-sm">
        Menampilkan <span className="font-bold">{filteredKategori.length}</span>{" "}
        data kategori
      </div>
    </div>
  );
}
