import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { CCard, CCardBody, CFormInput, CFormSelect, CButton } from "@coreui/react";
import { useNavigate } from "react-router-dom";

export default function TambahTagihan() {
  const navigate = useNavigate();

  const API = {
    tagihan: "http://localhost:5000/tagihan",
    siswa: "http://localhost:5000/siswa",
  };

  const [data, setData] = useState({
    siswaId: "",
    nama: "",
    kelas: "",
    kategori: "",
    bulan: "",
    jumlah: "",
    status: "Belum Lunas",
  });

  const [siswaList, setSiswaList] = useState([]);

  const kategoriList = ["SPP", "Uang Gedung", "Pendaftaran", "Lain-lain"];

  // Ambil data siswa
  useEffect(() => {
    axios.get(API.siswa)
      .then(res => setSiswaList(res.data))
      .catch(() => Swal.fire("Error", "Gagal memuat data siswa", "error"));
  }, []);

  // Ketika siswa dipilih
  const handleSelectSiswa = (id) => {
    const siswa = siswaList.find(s => s.id === id);
    if (!siswa) return;

    setData({
      ...data,
      siswaId: siswa.id,
      nama: siswa.nama,
      kelas: siswa.kelas, // otomatis isi kelas dari masterdata
    });
  };

  const submit = (e) => {
    e.preventDefault();

    if (!data.siswaId)
      return Swal.fire("Pilih siswa dulu!", "", "warning");

    if (!data.kategori)
      return Swal.fire("Pilih kategori tagihan!", "", "warning");

    if (!data.jumlah)
      return Swal.fire("Jumlah wajib diisi!", "", "warning");

    axios.post(API.tagihan, {
      ...data,
      id: Date.now().toString(),
      terbayar: data.status === "Lunas" ? Number(data.jumlah) : 0,
      sisa: data.status === "Lunas" ? 0 : Number(data.jumlah),
    })
      .then(() => {
        Swal.fire("Berhasil!", "Tagihan berhasil ditambahkan", "success")
          .then(() => navigate("/tagihan"));
      })
      .catch(() => Swal.fire("Error", "Gagal menambah tagihan", "error"));
  };

  return (
    <div className="flex-1 ml-55 mr-10 p-6 bg-gradient-to-br from-blue-50 to-blue-100 min-h-screen">

      <h2 className="text-2xl font-bold text-blue-700 mb-4">
        ➕ Tambah Tagihan Baru
      </h2>

      <CCard className="shadow-md">
        <CCardBody>
          <form onSubmit={submit}>

            {/* Pilih Siswa */}
            <label>Pilih Siswa</label>
            <CFormSelect
              className="mb-3"
              value={data.siswaId}
              onChange={(e) => handleSelectSiswa(e.target.value)}
            >
              <option value="">-- Pilih Siswa --</option>
              {siswaList.map(s => (
                <option key={s.id} value={s.id}>
                  {s.nama} — {s.kelas}
                </option>
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

            {/* Bulan */}
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

            <CButton type="submit" color="primary">Simpan</CButton>
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
