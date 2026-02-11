import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import {
  CCard,
  CCardBody,
  CFormInput,
  CFormTextarea,
  CButton,
} from "@coreui/react";
import { useNavigate, useParams } from "react-router-dom";

export default function EditKategoriTagihan() {
  const { id } = useParams();
  const navigate = useNavigate();

  // ✅ DISESUAIKAN KE BACKEND
  const API = "http://localhost:8080/api/kategori-tagihan";

  const [data, setData] = useState({
    nama: "",
    tipe: "",
    keterangan: "",
  });

  const [loading, setLoading] = useState(true);

  /* ================= LOAD DATA ================= */
  useEffect(() => {
    axios
      .get(`${API}/${id}`)
      .then((res) => {
        if (!res.data) {
          Swal.fire("Error", "Data tidak ditemukan", "warning");
          navigate("/kategori-tagihan");
          return;
        }

        setData({
          nama: res.data.nama ?? "",
          tipe: res.data.tipe ?? "",
          keterangan: res.data.keterangan ?? "",
        });

        setLoading(false);
      })
      .catch(() => {
        Swal.fire("Error", "Gagal mengambil data", "error");
        navigate("/kategori-tagihan");
      });
  }, [id, navigate]);

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!data.nama.trim()) {
      return Swal.fire("Oops!", "Nama wajib diisi!", "warning");
    }

    try {
      await axios.put(`${API}/${id}`, data);

      Swal.fire("Berhasil", "Kategori berhasil diperbarui", "success")
        .then(() => navigate("/kategori-tagihan"));
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Gagal memperbarui data", "error");
    }
  };

  if (loading) {
    return <div className="p-6 ml-55">Memuat data...</div>;
  }

  /* ================= UI ================= */
  return (
    <div className="flex-1 ml-55 mr-10 p-6 bg-gradient-to-br from-blue-50 to-blue-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-4 text-blue-700">
        ✏️ Edit Kategori Tagihan
      </h2>

      <CCard className="shadow">
        <CCardBody>
          <form onSubmit={handleSubmit}>
            <label>Nama</label>
            <CFormInput
              className="mb-3"
              value={data.nama}
              onChange={(e) =>
                setData({ ...data, nama: e.target.value })
              }
            />

            <label>Tipe</label>
            <CFormInput
              className="mb-3"
              value={data.tipe}
              onChange={(e) =>
                setData({ ...data, tipe: e.target.value })
              }
            />

            <label>Keterangan</label>
            <CFormTextarea
              className="mb-3"
              rows={3}
              value={data.keterangan}
              onChange={(e) =>
                setData({ ...data, keterangan: e.target.value })
              }
            />

            <CButton type="submit" color="primary">
              Simpan Perubahan
            </CButton>
            <CButton
              type="button"
              color="secondary"
              className="ms-2"
              onClick={() => navigate("/kategori-tagihan")}
            >
              Batal
            </CButton>
          </form>
        </CCardBody>
      </CCard>
    </div>
  );
}
