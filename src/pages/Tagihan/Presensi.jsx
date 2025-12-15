import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

import {
  CCard,
  CCardBody,
  CFormInput,
  CFormSelect,
  CButton,
} from "@coreui/react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClock,
  faUserCheck,
  faUserTag,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";

const API = {
  siswa: "http://localhost:5000/siswa",
  guru: "http://localhost:5000/guru",
  karyawan: "http://localhost:5000/karyawan",
  presensi: "http://localhost:5000/presensi",
};

// ================= HELPER =================
function nowISO() {
  return new Date().toISOString();
}

function isAfterJamPulang() {
  const now = new Date();
  const jam = now.getHours();
  const menit = now.getMinutes();
  return jam > 15 || (jam === 15 && menit >= 0);
}

// ================= COMPONENT =================
export default function Presensi() {
  const navigate = useNavigate();

  const [kodeUnik, setKodeUnik] = useState("");
  const [dataUser, setDataUser] = useState(null);
  const [status, setStatus] = useState("");
  const [keteranganIzin, setKeteranganIzin] = useState("");
  const [loadingCari, setLoadingCari] = useState(false);
  const [loadingSimpan, setLoadingSimpan] = useState(false);

  // ================= CARI DATA =================
  const cariData = async () => {
    if (!kodeUnik.trim()) {
      return Swal.fire("Oops", "Kode unik masih kosong", "warning");
    }

    try {
      setLoadingCari(true);

      const cek = async (url) => {
        const r = await axios.get(url, {
          params: { nomorUnik: kodeUnik },
        });
        return Array.isArray(r.data) && r.data.length > 0 ? r.data[0] : null;
      };

      const hasil =
        (await cek(API.siswa)) ||
        (await cek(API.guru)) ||
        (await cek(API.karyawan));

      if (!hasil) {
        setDataUser(null);
        return Swal.fire("Gagal", "Kode unik tidak ditemukan", "error");
      }

      setDataUser(hasil);
      Swal.fire("Ditemukan", hasil.nama, "success");
    } catch {
      Swal.fire("Error", "Gagal mencari data", "error");
    } finally {
      setLoadingCari(false);
    }
  };

  // ================= SIMPAN PRESENSI =================
  const simpanPresensi = async () => {
    if (!dataUser)
      return Swal.fire("Oops", "Cari data terlebih dahulu", "warning");

    if (!status)
      return Swal.fire("Oops", "Pilih status presensi", "warning");

    if (status === "izin" && !keteranganIzin.trim()) {
      return Swal.fire("Oops", "Keterangan izin wajib diisi", "warning");
    }

    if (status === "pulang" && !isAfterJamPulang()) {
      return Swal.fire(
        "Belum Waktunya",
        "Presensi pulang hanya bisa setelah jam 15:00",
        "warning"
      );
    }

    try {
      setLoadingSimpan(true);

      const tanggal = new Date().toISOString().slice(0, 10);

      const cek = await axios.get(API.presensi, {
        params: { nomorUnik: dataUser.nomorUnik, tanggal },
      });

      const existing =
        Array.isArray(cek.data) && cek.data.length > 0 ? cek.data[0] : null;

      // ===== VALIDASI DATA EXISTING =====
      if (existing) {
        if (existing.pulang) {
          return Swal.fire(
            "Ditolak",
            "Presensi hari ini sudah selesai",
            "error"
          );
        }

        if (existing.kategori !== "hadir" && status !== "pulang") {
          return Swal.fire(
            "Ditolak",
            "Anda sudah presensi hari ini",
            "error"
          );
        }
      }

      // ===== SIMPAN BARU =====
      if (!existing) {
        const payload = {
          nomorUnik: dataUser.nomorUnik,
          nama: dataUser.nama,
          kelas: dataUser.kelas || dataUser.ket || "-",
          kategori: status,
          masuk: status === "hadir" ? nowISO() : "",
          pulang: "",
          tanggal,
          keteranganIzin: status === "izin" ? keteranganIzin : "",
        };

        await axios.post(API.presensi, payload);
        Swal.fire("Berhasil", "Presensi tersimpan", "success");
      }

      // ===== UPDATE HADIR → PULANG =====
      if (existing) {
        const update = {
          ...existing,
          pulang: status === "pulang" ? nowISO() : existing.pulang,
        };

        await axios.put(`${API.presensi}/${existing.id}`, update);
        Swal.fire("Berhasil", "Presensi pulang dicatat", "success");
      }

      // RESET
      setKodeUnik("");
      setDataUser(null);
      setStatus("");
      setKeteranganIzin("");
    } catch {
      Swal.fire("Error", "Gagal menyimpan presensi", "error");
    } finally {
      setLoadingSimpan(false);
    }
  };

  // ================= UI =================
  return (
    <div className="ml-40 p-4 max-w-5xl mx-auto min-h-screen bg-gray-100">

      <button
        onClick={() => navigate("/dashboard")}
        className="fixed top-5 left-5 bg-blue-700 text-white px-4 py-2 rounded z-50"
      >
        Kembali ke Menu
      </button>

      <div className="flex items-center gap-3 mb-6">
        <FontAwesomeIcon icon={faClock} className="text-blue-700 text-4xl" />
        <h1 className="text-3xl font-bold">Presensi</h1>
      </div>

      <CCard>
        <CCardBody>
          <label className="font-bold text-lg">Kode Unik</label>

          <div className="flex gap-3 mt-2 items-center">
            <CFormInput
              className="w-72"
              value={kodeUnik}
              onChange={(e) => setKodeUnik(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && cariData()}
              placeholder="Masukkan kode unik"
            />

            <CButton onClick={cariData} disabled={loadingCari}>
              <FontAwesomeIcon icon={faUserTag} /> Cari
            </CButton>

            <CFormSelect
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="">-- Pilih Status --</option>
              <option value="hadir">Hadir</option>
              <option value="izin">Izin</option>
              <option value="sakit">Sakit</option>
              <option value="pulang" disabled={!isAfterJamPulang()}>
                Pulang (≥ 15:00)
              </option>
            </CFormSelect>

            <CButton
              color="success"
              onClick={simpanPresensi}
              disabled={loadingSimpan}
            >
              <FontAwesomeIcon icon={faUserCheck} /> Simpan
            </CButton>
          </div>

          {status === "izin" && (
            <div className="mt-4">
              <CFormInput
                placeholder="Keterangan izin"
                value={keteranganIzin}
                onChange={(e) => setKeteranganIzin(e.target.value)}
              />
            </div>
          )}

          {dataUser && (
            <div className="mt-6 p-4 bg-gray-50 border rounded">
              <p><b>Nama:</b> {dataUser.nama}</p>
              <p><b>Kelas/Ket:</b> {dataUser.kelas || dataUser.ket}</p>
              <p><b>Nomor Unik:</b> {dataUser.nomorUnik}</p>
            </div>
          )}

          <div className="text-sm text-gray-600 mt-4">
            <FontAwesomeIcon icon={faMagnifyingGlass} /> Presensi hanya 1× per
            hari. Pulang hanya setelah jam 15:00. 
          </div>
        </CCardBody>
      </CCard>
    </div>
  );
}
