import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import {
  CCard,
  CCardBody,
  CFormInput,
  CFormSelect,
  CButton,
} from "@coreui/react";
import { useNavigate } from "react-router-dom";

export default function TambahTagihan() {
  const navigate = useNavigate();

  const API = {
    tagihan: "http://localhost:8080/api/tagihan",
    siswa: "http://localhost:8080/siswa",
    kategori: "http://localhost:8080/api/kategori-tagihan",
  };

  const [data, setData] = useState({
    nama: "",
    kelas: "",
    bulan: "",
    jumlah: "",
    status: "Belum Lunas",
    kategori: "",
  });

  const [siswaList, setSiswaList] = useState([]);
  const [kategoriList, setKategoriList] = useState([]);

  // =====================
  // LOAD SISWA
  // =====================
  useEffect(() => {
    axios.get(API.siswa)
      .then(res => setSiswaList(res.data))
      .catch(() => Swal.fire("Error", "Gagal memuat data siswa", "error"));
  }, []);

  // =====================
  // LOAD KATEGORI
  // =====================
  useEffect(() => {
    axios.get(API.kategori)
      .then(res => setKategoriList(res.data))
      .catch(() => Swal.fire("Error", "Gagal memuat kategori", "error"));
  }, []);

  // =====================
  // PILIH SISWA
  // =====================
  const handleSelectSiswa = (id) => {
    const s = siswaList.find(x => x.id == id);
    if (!s) return;

    setData({
      ...data,
      nama: s.nama,
      kelas: s.kelas
    });
  };

  // =====================
  // SUBMIT
  // =====================
  const submit = async (e) => {
    e.preventDefault();

    if (!data.nama) return Swal.fire("Pilih siswa!", "", "warning");
    if (!data.kategori) return Swal.fire("Pilih kategori!", "", "warning");
    if (!data.jumlah) return Swal.fire("Jumlah wajib diisi!", "", "warning");

    const jumlah = Number(data.jumlah);

    const payload = {
      nama: data.nama,
      kelas: data.kelas,
      bulan: data.bulan,
      jumlah: jumlah,
      dibayar: data.status === "Lunas" ? jumlah : 0,
      sisa: data.status === "Lunas" ? 0 : jumlah,
      status: data.status,
      kategori: data.kategori,
    };

    try {
      await axios.post(API.tagihan, payload);
      Swal.fire("Berhasil", "Tagihan berhasil ditambahkan", "success")
        .then(() => navigate("/tagihan"));
    } catch {
      Swal.fire("Error", "Gagal menyimpan tagihan", "error");
    }
  };

  return (
    <div className="flex-1 ml-55 mr-10 p-6 bg-gradient-to-br from-blue-50 to-blue-100 min-h-screen">
      <h2 className="text-2xl font-bold text-blue-700 mb-4">
        ➕ Tambah Tagihan Baru
      </h2>

      <CCard className="shadow-md">
        <CCardBody>
          <form onSubmit={submit}>

            <label>Pilih Siswa</label>
            <CFormSelect className="mb-3" onChange={e => handleSelectSiswa(e.target.value)}>
              <option value="">-- Pilih Siswa --</option>
              {siswaList.map(s => (
                <option key={s.id} value={s.id}>
                  {s.nama} — {s.kelas}
                </option>
              ))}
            </CFormSelect>

            <label>Kategori Tagihan</label>
            <CFormSelect
              className="mb-3"
              value={data.kategori}
              onChange={e => setData({ ...data, kategori: e.target.value })}
            >
              <option value="">-- Pilih Kategori --</option>
              {kategoriList.map(k => (
                <option key={k.id} value={k.nama}>{k.nama}</option>
              ))}
            </CFormSelect>

            <label>Bulan</label>
            <CFormInput
              className="mb-3"
              value={data.bulan}
              onChange={e => setData({ ...data, bulan: e.target.value })}
            />

            <label>Jumlah</label>
            <CFormInput
              type="number"
              className="mb-3"
              value={data.jumlah}
              onChange={e => setData({ ...data, jumlah: e.target.value })}
            />

            <label>Status</label>
            <CFormSelect
              className="mb-3"
              value={data.status}
              onChange={e => setData({ ...data, status: e.target.value })}
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
