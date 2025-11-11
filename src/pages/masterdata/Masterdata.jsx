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
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

export default function TabelDataPegawai() {
  const [kategori, setKategori] = useState("siswa");
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const API_LIST = {
    siswa: "http://localhost:3000/siswa",
    guru: "http://localhost:3000/guru",
    karyawan: "http://localhost:3000/karyawan",
  };

  const fetchData = async () => {
    try {
      const response = await axios.get(API_LIST[kategori]);
      setData(response.data);
    } catch (error) {
      console.log("Gagal mengambil data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [kategori]);

  const filteredData = data.filter((item) =>
    item.nama?.toLowerCase().includes(search.toLowerCase()) ||
    item.alamat?.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (id) => {
    Swal.fire({
      title: "Yakin ingin menghapus?",
      text: "Data tidak dapat dikembalikan setelah dihapus!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(`${API_LIST[kategori]}/${id}`).then(() => {
          Swal.fire("Berhasil!", "Data telah dihapus.", "success");
          fetchData();
        });
      }
    });
  };

  const handleEdit = (id) => {
    navigate(`/edit/${id}`);
  };
  return (
    <div className="flex-1 ml-48 mr-10 p-6 bg-gradient-to-br from-blue-50 to-blue-100 min-h-screen">
      <h4 className="mb-3">📋 Tabel Data {kategori.toUpperCase()}</h4>

      {/* Filter & Search */}
      <div className="d-flex gap-3 align-items-center mb-3">
        <span>Kategori:</span>

        <CFormSelect
          value={kategori}
          onChange={(e) => setKategori(e.target.value)}
          style={{ width: "180px" }}
        >
          <option value="siswa">Siswa</option>
          <option value="guru">Guru</option>
          <option value="karyawan">Karyawan</option>
        </CFormSelect>

        <CFormInput
          placeholder="Cari nama / alamat..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: "340px" }}
        />

        <CButton color="primary" onClick={() => navigate("/Tambahdata")}>
          Tambah Data
        </CButton>
      </div>

      {/* Table */}
      <CCard>
        <CCardBody>
          <table className="table table-hover text-center">
            <thead style={{ backgroundColor: "#E9F3FF" }}>
              <tr>
                <th>No</th>
                <th>Nama</th>
                <th>Kelas</th>
                <th>Jabatan</th>
                <th>Alamat</th>
                <th>No HP</th>
                <th>Aksi</th>
              </tr>
            </thead>

            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((item, index) => (
                  <tr key={item.id}>
                    <td>{index + 1}</td>
                    <td>{item.nama}</td>

                    <td>
                      {kategori === "guru"
                        ? "-"
                        : item.kelas || "-"}
                    </td>

                    <td>
                      {kategori === "siswa"
                        ? "-"
                        : item.ket || "-"}
                    </td>

                    <td>{item.alamat}</td>
                    <td>{item.hp}</td>

                    <td>
                      <button
                        className="btn btn-warning btn-sm me-2"
                        onClick={() => handleEdit(item.id)}
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </button>

                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(item.id)}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-3 text-secondary">
                    Tidak ada data ditemukan
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </CCardBody>
      </CCard>
    </div>
  );
}
