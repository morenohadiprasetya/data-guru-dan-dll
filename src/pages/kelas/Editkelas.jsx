import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { CCard, CCardBody, CFormInput, CFormSelect, CButton } from "@coreui/react";
import { useNavigate, useParams } from "react-router-dom";

export default function EditKelas() {
  const { id } = useParams();
  const navigate = useNavigate();

  const API = "http://localhost:5000/kelas";

  const [data, setData] = useState({
    namaKelas: "",
    tingkat: "",
    jurusan: ""
  });

  const tingkatList = ["X", "XI", "XII"];
  const jurusanList = ["TKJ", "TSM", "Akutansi", "Multimedia", "RPL"];

  // FETCH DATA KELAS BERDASARKAN ID
  useEffect(() => {
    axios.get(`${API}/${id}`)
      .then(res => {
        if (!res.data) {
          Swal.fire("Error", "Data kelas tidak ditemukan", "error");
          navigate("/kelas");
          return;
        }
        setData(res.data);
      })
      .catch(() => {
        Swal.fire("Error", "Gagal mengambil data kelas", "error");
        navigate("/kelas");
      });
  }, [id, navigate]);

  const submit = (e) => {
    e.preventDefault();

    if (!data.namaKelas.trim()) {
      return Swal.fire("Oops!", "Nama kelas wajib diisi!", "warning");
    }

    axios.put(`${API}/${id}`, data)
      .then(() => {
        Swal.fire("Berhasil!", "Kelas berhasil diperbarui", "success")
          .then(() => navigate("/kelas"));
      })
      .catch(() => {
        Swal.fire("Error", "Gagal memperbarui kelas", "error");
      });
  };

  return (
    <div className="flex-1 ml-48 mr-10 p-6 bg-gradient-to-br from-blue-50 to-blue-100 min-h-screen">
      
      <h2 className="text-2xl font-bold text-blue-700 mb-4">✏️ Edit Kelas</h2>

      <CCard className="shadow-md">
        <CCardBody>
          <form onSubmit={submit}>

            {/* Nama Kelas */}
            <label>Nama Kelas</label>
            <CFormInput
              className="mb-3"
              value={data.namaKelas}
              onChange={(e) => setData({ ...data, namaKelas: e.target.value })}
            />

            {/* Tingkat */}
            <label>Tingkat</label>
            <CFormSelect
              className="mb-3"
              value={data.tingkat}
              onChange={(e) => setData({ ...data, tingkat: e.target.value })}
            >
              <option value="">-- Pilih Tingkat --</option>
              {tingkatList.map((t, i) => (
                <option key={i} value={t}>{t}</option>
              ))}
            </CFormSelect>

            {/* Jurusan */}
            <label>Jurusan</label>
            <CFormSelect
              className="mb-3"
              value={data.jurusan}
              onChange={(e) => setData({ ...data, jurusan: e.target.value })}
            >
              <option value="">-- Pilih Jurusan --</option>
              {jurusanList.map((j, i) => (
                <option key={i} value={j}>{j}</option>
              ))}
            </CFormSelect>

            <CButton color="primary" type="submit">Simpan Perubahan</CButton>
            <CButton color="secondary" className="ms-2" onClick={() => navigate("/kelas")}>
              Batal
            </CButton>

          </form>
        </CCardBody>
      </CCard>
    </div>
  );
}
