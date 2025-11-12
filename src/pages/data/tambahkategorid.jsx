import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { CCard, CCardBody, CFormInput, CButton } from "@coreui/react";
import { useNavigate } from "react-router-dom";

export default function TambahKategori() {
  const navigate = useNavigate();
  const API = "http://localhost:5000/kategoriTagihan";

  const [nama, setNama] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nama.trim()) {
      Swal.fire("Oops!", "Nama kategori wajib diisi!", "warning");
      return;
    }

    try {
      const newData = {
        id: Date.now().toString(),
        nama,
      };

      await axios.post(API, newData);
      Swal.fire("Berhasil!", "Kategori baru berhasil ditambahkan!", "success").then(() =>
        navigate("/kategori-tagihan")
      );
    } catch (error) {
      Swal.fire("Error", "Gagal menyimpan kategori!", "error");
    }
  };

  return (
    <div className="flex-1 ml-48 mr-10 p-6 bg-gradient-to-br from-blue-50 to-blue-100 min-h-screen">
      <h2 className="text-2xl font-bold text-blue-700 mb-4">➕ Tambah Kategori Tagihan</h2>

      <CCard className="shadow-md border-0">
        <CCardBody>
          <form onSubmit={handleSubmit}>
            <label>Nama Kategori</label>
            <CFormInput
              placeholder="Masukkan nama kategori..."
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              className="mb-3"
            />

            <div className="flex gap-3 mt-4">
              <CButton color="primary" type="submit">
                Simpan
              </CButton>
              <CButton color="secondary" onClick={() => navigate("/kategori-tagihan")}>
                Batal
              </CButton>
            </div>
          </form>
        </CCardBody>
      </CCard>
    </div>
  );
}
