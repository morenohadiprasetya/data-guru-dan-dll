import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { CCard, CCardBody, CFormInput, CButton } from "@coreui/react";
import { useNavigate } from "react-router-dom";

export default function TambahLevel() {
  const [name, setName] = useState("");
  const navigate = useNavigate();
  const API = "http://localhost:5000/level";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      Swal.fire("Oops!", "Nama level tidak boleh kosong!", "warning");
      return;
    }

    await axios.post(API, { name });

    Swal.fire("Berhasil!", "Level baru berhasil ditambahkan!", "success").then(
      () => navigate("/kategoril")
    );
  };

  return (
    <div className="flex-1 ml-48 mr-10 p-6 bg-gradient-to-br from-blue-50 to-blue-100 min-h-screen">
      <h4 className="mb-3">➕ Tambah Level Baru</h4>

      <CCard className="p-3">
        <CCardBody>
          <form onSubmit={handleSubmit}>
            <label>Nama Level</label>
            <CFormInput
              placeholder="Masukkan nama level..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mb-3"
            />

            <CButton color="primary" type="submit" className="me-2">
              Simpan
            </CButton>
            <CButton color="secondary" onClick={() => navigate("/level")}>
              Batal
            </CButton>
          </form>
        </CCardBody>
      </CCard>
    </div>
  );
}
