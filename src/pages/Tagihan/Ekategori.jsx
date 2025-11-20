import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { CCard, CCardBody, CFormInput, CFormTextarea, CButton } from "@coreui/react";
import { useNavigate, useParams } from "react-router-dom";

export default function EditKategoriTagihan() {
  const { id } = useParams();
  const navigate = useNavigate();

  const API = "http://localhost:5000/kategoriTagihan";

  const [data, setData] = useState({
    nama: "",
    tipe: "",
    deskripsi: "",
    kelas: ""
  });

  useEffect(() => {
    axios.get(`${API}/${id}`)
      .then((res) => {
        if (!res.data) {
          Swal.fire("Error", "Data tidak ditemukan!", "warning");
          navigate("/kategori-tagihan");
          return;
        }
        setData(res.data);
      })
      .catch(() => {
        Swal.fire("Error", "Gagal mengambil data!", "error");
        navigate("/kategori-tagihan");
      });
  }, [id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!data.nama.trim()) {
      return Swal.fire("Oops!", "Nama wajib diisi!", "warning");
    }

    try {
      await axios.put(`${API}/${id}`, data);

      Swal.fire("Berhasil!", "Kategori diperbarui!", "success").then(() => {
        navigate("/kategori-tagihan");
      });

    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Gagal memperbarui data!", "error");
    }
  };

  return (
    <div className="flex-1 ml-53 mr-10 p-6 bg-gradient-to-br from-blue-50 to-blue-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-4 text-blue-700">✏️ Edit Kategori Tagihan</h2>

      <CCard>
        <CCardBody>
          <form onSubmit={handleSubmit}>

            <label>Nama</label>
            <CFormInput
              value={data.nama}
              onChange={(e) => setData({ ...data, nama: e.target.value })}
              className="mb-3"
            />

            <label>Tipe</label>
            <CFormInput
              value={data.tipe}
              onChange={(e) => setData({ ...data, tipe: e.target.value })}
              className="mb-3"
            />

            <label>Deskripsi</label>
            <CFormTextarea
              value={data.deskripsi}
              onChange={(e) => setData({ ...data, deskripsi: e.target.value })}
              className="mb-3"
              rows={3}
            />

            <label>Kelas</label>
            <CFormInput
              value={data.kelas}
              onChange={(e) => setData({ ...data, kelas: e.target.value })}
              className="mb-3"
            />

            <CButton type="submit" color="primary">Simpan Perubahan</CButton>
            <CButton color="secondary" className="ms-2" type="button" onClick={() => navigate("/kategori-tagihan")}>
              Batal
            </CButton>

          </form>
        </CCardBody>
      </CCard>
    </div>
  );
}
