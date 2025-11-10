import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { CCard, CCardBody, CFormInput, CButton } from "@coreui/react";
import { useNavigate, useParams } from "react-router-dom";

export default function EditLevel() {
  const { id } = useParams();
  const [name, setName] = useState("");
  const navigate = useNavigate();
  const API = "http://localhost:5000/level";

  useEffect(() => {
    axios.get(`${API}/${id}`).then((res) => {
      setName(res.data.name);
    });
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      Swal.fire("Oops!", "Nama level tidak boleh kosong!", "warning");
      return;
    }

    await axios.put(`${API}/${id}`, { name });

    Swal.fire("Berhasil!", "Data level berhasil diperbarui!", "success").then(
      () => navigate("/kategoril")
    );
  };

  return (
    <div className="flex-1 ml-48 mr-10 p-6 bg-gradient-to-br from-blue-50 to-blue-100 min-h-screen">
      <h4 className="mb-3">✏️ Edit Level</h4>

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
              Update
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
