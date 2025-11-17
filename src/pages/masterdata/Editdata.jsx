import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { CFormInput, CFormSelect, CButton, CCard, CCardBody } from "@coreui/react";
import { useNavigate, useParams, useLocation } from "react-router-dom";

export default function EditData() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const kategori = new URLSearchParams(location.search).get("kategori");

  const API = {
    siswa: "http://localhost:5000/siswa",
    guru: "http://localhost:5000/guru",
    karyawan: "http://localhost:5000/karyawan",
  };

  const [data, setData] = useState({
    nama: "",
    alamat: "",
    hp: "",
    kelas: "",
    ket: "",
  });

  useEffect(() => {
    axios.get(`${API[kategori]}/${id}`)
      .then(res => {
        if (!res.data) {
          Swal.fire("Error", "Data tidak ditemukan", "error");
          navigate("/masterdata");
          return;
        }
        setData(res.data);
      })
      .catch(() => {
        Swal.fire("Error", "Gagal mengambil data", "error");
        navigate("/masterdata");
      });
  }, [id, kategori, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!data.nama.trim()) {
      return Swal.fire("Nama wajib diisi", "", "warning");
    }

    axios
      .put(`${API[kategori]}/${id}`, data)
      .then(() => {
        Swal.fire("Berhasil", "Data berhasil diperbarui", "success").then(() => {
          navigate("/masterdata");
        });
      })
      .catch(() => Swal.fire("Error", "Gagal menyimpan", "error"));
  };

  return (
    <div className="flex-1 ml-48 mr-10 p-6 bg-gradient-to-br from-blue-50 to-blue-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-4">✏️ Edit Data {kategori.toUpperCase()}</h2>

      <CCard>
        <CCardBody>
          <form onSubmit={handleSubmit}>
            <label>Nama</label>
            <CFormInput
              value={data.nama}
              onChange={(e) => setData({ ...data, nama: e.target.value })}
              className="mb-3"
            />

            <label>Alamat</label>
            <CFormInput
              value={data.alamat}
              onChange={(e) => setData({ ...data, alamat: e.target.value })}
              className="mb-3"
            />

            <label>Nomor HP</label>
            <CFormInput
              value={data.hp}
              onChange={(e) => setData({ ...data, hp: e.target.value })}
              className="mb-3"
            />

            {kategori === "siswa" && (
              <>
                <label>Kelas</label>
                <CFormInput
                  value={data.kelas}
                  onChange={(e) => setData({ ...data, kelas: e.target.value })}
                  className="mb-3"
                />
              </>
            )}

            {kategori !== "siswa" && (
              <>
                <label>Jabatan</label>
                <CFormInput
                  value={data.ket}
                  onChange={(e) => setData({ ...data, ket: e.target.value })}
                  className="mb-3"
                />
              </>
            )}

            <CButton type="submit" color="primary">Simpan</CButton>
            <CButton className="ms-2" color="secondary" onClick={() => navigate("/apo")}>Batal</CButton>
          </form>
        </CCardBody>
      </CCard>
    </div>
  );
}
