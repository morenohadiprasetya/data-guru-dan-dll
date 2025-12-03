// EditData.jsx (updated: added kodeUnik for siswa)
import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { CFormInput, CFormSelect, CButton, CCard, CCardBody } from "@coreui/react";
import { useNavigate, useParams, useLocation } from "react-router-dom";

export default function EditData() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const kategori = new URLSearchParams(location.search).get("kategori") || "siswa";

  const API = {
    siswa: "http://localhost:5000/siswa",
    guru: "http://localhost:5000/guru",
    karyawan: "http://localhost:5000/karyawan",
    level: "http://localhost:5000/level",
    kelas: "http://localhost:5000/kelas",
  };

  const [data, setData] = useState({
    nama: "",
    alamat: "",
    hp: "",
    kelas: "",
    ket: "",
    level: "",
    kodeUnik: "",
  });

  const [kelasList, setKelasList] = useState([]);
  const [levels, setLevels] = useState([]);

  useEffect(() => {
    axios.get(API[kategori])
      .then(res => {
        const found = Array.isArray(res.data) ? res.data.find(r => String(r.id) === String(id)) : res.data;
        if (!found) {
          Swal.fire("Error", "Data tidak ditemukan", "error");
          navigate("/masterdata");
          return;
        }

        setData({
          nama: found.nama || "",
          alamat: found.alamat || "",
          hp: found.hp || "",
          kelas: found.kelasId || found.kelas || "",
          ket: found.ket || "",
          level: found.level || "",
          kodeUnik: found.kodeUnik || "",  // <-- added here
          jurusan: found.jurusan || "",
        });
      })
      .catch(() => {
        Swal.fire("Error", "Gagal mengambil data", "error");
        navigate("/masterdata");
      });

    axios.get(API.kelas).then(r => setKelasList(Array.isArray(r.data) ? r.data : [])).catch(()=>setKelasList([]));
    axios.get(API.level).then(r => setLevels(Array.isArray(r.data) ? r.data : [])).catch(()=>setLevels([]));
  }, [id, kategori, navigate]);

  useEffect(() => {
    const sel = kelasList.find(k => k.id === data.kelas || k.namaKelas === data.kelas);
    if (sel && sel.jurusan && data.jurusan !== sel.jurusan) {
      setData(d => ({ ...d, jurusan: sel.jurusan }));
    }
  }, [kelasList, data.kelas]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!data.nama.trim()) {
      return Swal.fire("Nama wajib diisi", "", "warning");
    }

    axios
      .put(`${API[kategori]}/${id}`, data)
      .then(() => {
        Swal.fire("Berhasil", "Data berhasil diperbarui", "success").then(() => {
          navigate("/masterdata");
        });
      })
      .catch(() => Swal.fire("Error", "Gagal menyimpan", "error"));
  };

  return (
    <div className="flex-1 ml-53 mr-10 p-6 bg-gradient-to-br from-blue-50 to-blue-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-4">✏️ Edit Data {kategori.toUpperCase()}</h2>

      <CCard>
        <CCardBody>
          <form onSubmit={handleSubmit}>
            <label>Nama</label>
            <CFormInput value={data.nama} onChange={(e) => setData({ ...data, nama: e.target.value })} className="mb-3" />

            <label>Alamat</label>
            <CFormInput value={data.alamat} onChange={(e) => setData({ ...data, alamat: e.target.value })} className="mb-3" />

            <label>Nomor HP</label>
            <CFormInput value={data.hp} onChange={(e) => setData({ ...data, hp: e.target.value })} className="mb-3" />

            {kategori === "siswa" && (
              <>
                {/* 🔥 ADDED: Kode Unik */}
                <label>Kode Unik Presensi</label>
                <CFormInput
                  value={data.kodeUnik}
                  onChange={(e) => setData({ ...data, kodeUnik: e.target.value })}
                  className="mb-3"
                  placeholder="Contoh: R-2025 atau kode RFID"
                />

                <label>Kelas</label>
                <CFormSelect value={data.kelas} onChange={(e) => setData({ ...data, kelas: e.target.value })} className="mb-3">
                  <option value="">-- Pilih Kelas --</option>
                  {kelasList.map(k => (
                    <option key={k.id} value={k.id}>{k.namaKelas}</option>
                  ))}
                </CFormSelect>

                <label>Jurusan</label>
                <CFormInput value={data.jurusan || ""} readOnly className="mb-3" />
              </>
            )}

            {kategori !== "siswa" && (
              <>
                <label>Keterangan (Mapel / Jabatan)</label>
                <CFormInput value={data.ket} onChange={(e) => setData({ ...data, ket: e.target.value })} className="mb-3" />
              </>
            )}

            <CButton type="submit" color="primary">Simpan</CButton>
            <CButton className="ms-2" color="secondary" onClick={() => navigate("/masterdata")}>Batal</CButton>
          </form>
        </CCardBody>
      </CCard>
    </div>
  );
}
