import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import {
  CCard,
  CCardBody,
  CFormSelect,
  CFormInput,
  CButton,
} from "@coreui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faFolderOpen } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

export default function Masterdata() {
  const [kategori, setKategori] = useState("siswa");
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const API = {
    siswa: "http://localhost:5000/siswa",
    guru: "http://localhost:5000/guru",
    karyawan: "http://localhost:5000/karyawan",
    level: "http://localhost:5000/level",
  };

  // =========================
  // FETCH DATA
  // =========================
  const fetchData = async () => {
    try {
      const res = await axios.get(API[kategori]);
      setData(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      Swal.fire("Error", "Gagal mengambil data", "error");
    }
  };

  useEffect(() => {
    fetchData();
  }, [kategori]);

  // =========================
  // FILTER SEARCH
  // =========================
  const filteredData = data.filter((item) => {
    const q = search.toLowerCase();
    return (
      item.nama?.toLowerCase().includes(q) ||
      item.alamat?.toLowerCase().includes(q) ||
      (item.ket || "").toLowerCase().includes(q) ||
      (item.kelas || "").toLowerCase().includes(q) ||
      (item.nomorUnik || "").toLowerCase().includes(q)
    );
  });

  // =========================
  // DELETE DATA
  // =========================
  const handleDelete = (id) => {
    Swal.fire({
      title: "Yakin ingin menghapus?",
      text: "Data tidak dapat dikembalikan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Hapus",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`${API[kategori]}/${id}`)
          .then(() => {
            Swal.fire("Berhasil", "Data terhapus", "success");
            fetchData();
          })
          .catch(() => Swal.fire("Error", "Gagal menghapus", "error"));
      }
    });
  };

  const handleEdit = (id) => {
    navigate(`/editdata/${id}?kategori=${kategori}`);
  };

  return (
    <div className="ml-55 mr-10 p-6">
      {/* ================= HEADER ================= */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <FontAwesomeIcon
            icon={faFolderOpen}
            className="text-yellow-600 text-3xl"
          />
          <h1 className="text-3xl font-semibold">Master Data</h1>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={kategori}
            onChange={(e) => setKategori(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="siswa">Siswa</option>
            <option value="guru">Guru</option>
            <option value="karyawan">Karyawan</option>
          </select>

          <button
            onClick={() => navigate(`/tambahdata?kategori=${kategori}`)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded shadow"
          >
            + Tambah Data
          </button>
        </div>
      </div>

      {/* ================= SEARCH ================= */}
      <div className="mb-4">
        <input
          className="w-96 p-3 rounded-xl bg-gray-100 border shadow-sm"
          placeholder="🔍 Cari nama, kelas, alamat, nomor unik..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* ================= TABLE ================= */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
        {/* TABLE HEADER */}
        <div className="w-full bg-blue-600 text-white font-semibold p-3 grid grid-cols-8">
          <div className="text-center">No</div>
          <div>Nama</div>
          <div>Keterangan</div>
          <div>Alamat</div>
          <div>HP</div>
          <div>Nomor Unik</div>
          <div className="text-center col-span-2">Aksi</div>
        </div>

        {/* TABLE BODY */}
        <div>
          {filteredData.length === 0 && (
            <div className="p-5 text-center text-gray-500">
              Data tidak ditemukan
            </div>
          )}

          {filteredData.map((x, index) => (
            <div
              key={x.id}
              className="grid grid-cols-8 border-t p-3 items-center hover:bg-gray-50"
            >
              {/* NOMOR */}
              <div className="text-center font-semibold text-gray-600">
                {index + 1}
              </div>

              <div className="font-medium text-blue-700">{x.nama}</div>
              <div>{x.ket || x.kelas || "-"}</div>
              <div>{x.alamat || "-"}</div>
              <div>{x.hp || "-"}</div>

              <div className="font-semibold text-green-700">
                {x.nomorUnik || "-"}
              </div>

              {/* AKSI */}
              <div className="flex gap-2 justify-center col-span-2">
                <button
                  onClick={() => handleEdit(x.id)}
                  className="flex items-center gap-2 bg-yellow-400 text-white px-4 py-2 rounded shadow hover:bg-yellow-500"
                >
                  <FontAwesomeIcon icon={faEdit} />
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(x.id)}
                  className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded shadow hover:bg-red-700"
                >
                  <FontAwesomeIcon icon={faTrash} />
                  Hapus
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
