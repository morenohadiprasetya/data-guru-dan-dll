import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { CCard, CCardBody, CFormInput, CFormSelect, CButton } from "@coreui/react";
import { useNavigate } from "react-router-dom";

export default function TambahTagihan() {
  const navigate = useNavigate();

  const API = {
    tagihan: "http://localhost:5000/tagihan",
    kelas: "http://localhost:5000/kelas", // API untuk ambil daftar kelas
  };

  const [data, setData] = useState({
    nama: "",
    kelas: "",
    bulan: "",
    jumlah: "",
    status: "Belum Lunas",
    kategori: "",
  });

  const [kelasList, setKelasList] = useState([]); // state untuk daftar kelas

  const kategoriList = ["SPP", "Uang Gedung", "Pendaftaran", "Lain-lain"];

  // Ambil daftar kelas dari API
  useEffect(() => {
    axios
      .get(API.kelas)
      .then((res) => setKelasList(res.data))
      .catch(() => Swal.fire("Error", "Gagal memuat daftar kelas", "error"));
  }, []);

  const submit = (e) => {
    e.preventDefault();

    if (!data.nama.trim()) {
      return Swal.fire("Nama tagihan wajib diisi", "", "warning");
    }

    if (!data.kelas) {
      return Swal.fire("Kelas wajib dipilih", "", "warning");
    }

    axios
      .post(API.tagihan, {
        ...data,
        id: Date.now().toString(),
      })
      .then(() => {
        Swal.fire("Berhasil!", "Tagihan berhasil ditambahkan", "success").then(() =>
          navigate("/tagihan")
        );
      })
      .catch(() => Swal.fire("Error", "Gagal menambah tagihan", "error"));
  };

  return (
    <div className="flex-1 ml-55 mr-10 p-6 bg-gradient-to-br from-blue-50 to-blue-100 min-h-screen">
      <h2 className="text-2xl font-bold text-blue-700 mb-4">➕ Tambah Tagihan Baru</h2>

      <CCard className="shadow-md">
        <CCardBody>
          <form onSubmit={submit}>

            {/* Nama Tagihan */}
            <label>Nama Siswa</label>
            <CFormInput
              className="mb-3"
              placeholder="Contoh: Ambatukam"
              value={data.nama}
              onChange={(e) => setData({ ...data, nama: e.target.value })}
            />

            {/* Kelas */}
            <label>Kelas</label>
            <CFormSelect
              className="mb-3"
              value={data.kelas}
              onChange={(e) => setData({ ...data, kelas: e.target.value })}
            >
              <option value="">-- Pilih Kelas --</option>
              {kelasList.map((k) => (
                <option key={k.id} value={k.nama}>{k.nama}</option>
              ))}
            </CFormSelect>

            {/* Kategori */}
            <label>Kategori Tagihan</label>
            <CFormSelect
              className="mb-3"
              value={data.kategori}
              onChange={(e) => setData({ ...data, kategori: e.target.value })}
            >
              <option value="">-- Pilih Kategori --</option>
              {kategoriList.map((k, i) => (
                <option key={i} value={k}>{k}</option>
              ))}
            </CFormSelect>

            {/* Bulan / Periode */}
            <label>Bulan / Periode</label>
            <CFormInput
              className="mb-3"
              placeholder="Contoh: Januari 2025"
              value={data.bulan}
              onChange={(e) => setData({ ...data, bulan: e.target.value })}
            />

            {/* Jumlah */}
            <label>Jumlah (Rp)</label>
            <CFormInput
              type="number"
              className="mb-3"
              value={data.jumlah}
              onChange={(e) => setData({ ...data, jumlah: e.target.value })}
            />

            {/* Status */}
            <label>Status</label>
            <CFormSelect
              className="mb-3"
              value={data.status}
              onChange={(e) => setData({ ...data, status: e.target.value })}
            >
              <option>Belum Lunas</option>
              <option>Lunas</option>
              <option>Pending</option>
            </CFormSelect>

            {/* Buttons */}
            <CButton type="submit" color="primary">
              Simpan
            </CButton>
            <CButton
              type="button"
              className="ms-2"
              color="secondary"
              onClick={() => navigate("/tagihan")}
            >
              Batal
            </CButton>
          </form>
        </CCardBody>
      </CCard>
    </div>
  );
}
