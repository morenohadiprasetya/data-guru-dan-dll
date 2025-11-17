import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { CCard, CCardBody, CFormInput, CFormSelect, CFormTextarea, CButton } from "@coreui/react";
import { useNavigate } from "react-router-dom";

export default function TambahKategoriTagihan() {
  const navigate = useNavigate();
  const API = "http://localhost:5000/kategoriTagihan";

  const [data, setData] = useState({
    nama: "",
    tipe: "",
    deskripsi: "",
    kelas: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!data.nama.trim()) {
      return Swal.fire("Oops!", "Nama kategori wajib diisi!", "warning");
    }

    try {
      await axios.post(API, {
        ...data,
        id: Date.now().toString() // ID unik otomatis
      });

      Swal.fire("Berhasil", "Kategori berhasil ditambahkan!", "success").then(() => {
        navigate("/kategori-tagihan");
      });

    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Gagal menambahkan kategori", "error");
    }
  };

  return (
    <div className="flex-1 ml-48 mr-10 p-6 bg-gradient-to-br from-blue-50 to-blue-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-4 text-blue-700">➕ Tambah Kategori Tagihan</h2>

      <CCard>
        <CCardBody>
          <form onSubmit={handleSubmit}>

            <label>Nama Kategori</label>
            <CFormInput
              value={data.nama}
              onChange={(e) => setData({ ...data, nama: e.target.value })}
              className="mb-3"
              placeholder="Contoh: SPP, Uang Bangunan..."
            />

            <label>Tipe</label>
            <CFormInput
              value={data.tipe}
              onChange={(e) => setData({ ...data, tipe: e.target.value })}
              className="mb-3"
              placeholder="Contoh: Bulanan / Tahunan / Bebas"
            />

            <label>Deskripsi</label>
            <CFormTextarea
              value={data.deskripsi}
              onChange={(e) => setData({ ...data, deskripsi: e.target.value })}
              className="mb-3"
              rows={3}
              placeholder="Deskripsi tambahan kategori"
            />

            <label>Kelas</label>
            <CFormInput
              value={data.kelas}
              onChange={(e) => setData({ ...data, kelas: e.target.value })}
              className="mb-3"
              placeholder="Contoh: X / XI / XII / Semua"
            />

            <CButton type="submit" color="primary">Simpan</CButton>
            <CButton type="button" color="secondary" className="ms-2" onClick={() => navigate("/kategoril")}>
              Batal
            </CButton>

          </form>
        </CCardBody>
      </CCard>
    </div>
  );
}
