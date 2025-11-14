import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { CCard, CCardBody, CFormInput, CFormSelect, CFormTextarea, CButton } from "@coreui/react";
import { useNavigate, useParams } from "react-router-dom";

export default function EditKategori() {
  const { id } = useParams();
  const navigate = useNavigate();
  const API = "http://localhost:5000/kategoriTagihan";

  const [data, setData] = useState({
    nama: "",
    tipe: "Bulanan",
    deskripsi: "",
    kelas: "Semua",
  });
  const [loading, setLoading] = useState(false);

  const fetchKategori = async () => {
    try {
      const res = await axios.get(`${API}/${id}`);
      setData({
        nama: res.data.nama || "",
        tipe: res.data.tipe || "Bulanan",
        deskripsi: res.data.deskripsi || "",
        kelas: res.data.kelas || "Semua",
      });
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Gagal mengambil data kategori.", "error");
    }
  };

  useEffect(() => {
    if (id) fetchKategori();
    // eslint-disable-next-line
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!data.nama.trim()) {
      Swal.fire("Oops!", "Nama kategori wajib diisi!", "warning");
      return;
    }

    try {
      setLoading(true);
      await axios.put(`${API}/${id}`, { ...data });
      setLoading(false);
      Swal.fire("Berhasil", "Kategori berhasil diperbarui.", "success").then(() => {
        navigate("/kategori-tagihan");
      });
    } catch (err) {
      setLoading(false);
      console.error(err);
      Swal.fire("Error", "Gagal memperbarui kategori.", "error");
    }
  };

  return (
    <div className="flex-1 ml-48 mr-10 p-6 bg-gradient-to-br from-blue-50 to-blue-100 min-h-screen">
      <h2 className="text-2xl font-bold text-blue-700 mb-4">✏️ Edit Kategori Tagihan</h2>

      <CCard className="shadow-md border-0">
        <CCardBody>
          <form onSubmit={handleSubmit}>
            <label className="block mb-1">Nama Kategori</label>
            <CFormInput
              placeholder="Contoh: SPP"
              value={data.nama}
              onChange={(e) => setData({ ...data, nama: e.target.value })}
              className="mb-3"
            />

            <label className="block mb-1">Tipe</label>
            <CFormSelect value={data.tipe} onChange={(e) => setData({ ...data, tipe: e.target.value })} className="mb-3">
              <option>Bulanan</option>
              <option>Tahunan</option>
              <option>Bebas</option>
              <option>Sekali</option>
            </CFormSelect>

            <label className="block mb-1">Deskripsi</label>
            <CFormTextarea
              placeholder="Deskripsi singkat kategori..."
              value={data.deskripsi}
              onChange={(e) => setData({ ...data, deskripsi: e.target.value })}
              className="mb-3"
              rows="3"
            />

            <label className="block mb-1">Kelas</label>
            <CFormInput
              placeholder="Semua / X / XI / XII / dsb"
              value={data.kelas}
              onChange={(e) => setData({ ...data, kelas: e.target.value })}
              className="mb-3"
            />

            <div className="flex gap-3 mt-4">
              <CButton color="primary" type="submit" disabled={loading}>
                {loading ? "Menyimpan..." : "Simpan Perubahan"}
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
