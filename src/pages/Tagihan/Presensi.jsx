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
  faTable,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";

/* ================= API ================= */
const API = {
  siswa: "http://localhost:5000/siswa",
  guru: "http://localhost:5000/guru",
  karyawan: "http://localhost:5000/karyawan",
  presensi: "http://localhost:5000/presensi",
};

/* ================= HELPER ================= */
const nowISO = () => new Date().toISOString();

const isAfterJamPulang = () => {
  const d = new Date();
  return d.getHours() > 15 || (d.getHours() === 15 && d.getMinutes() >= 0);
};

/* ================= UI SECTION ================= */
const Section = ({ title, children }) => (
  <div className="space-y-3">
    <h2 className="font-semibold text-lg border-b pb-1">{title}</h2>
    {children}
  </div>
);

/* ================= MAIN ================= */
export default function Presensi() {
  const navigate = useNavigate();

  const [status, setStatus] = useState("");
  const [kodeUnik, setKodeUnik] = useState("");
  const [dataUser, setDataUser] = useState(null);
  const [keteranganIzin, setKeteranganIzin] = useState("");
  const [loadingCari, setLoadingCari] = useState(false);
  const [loadingSimpan, setLoadingSimpan] = useState(false);

  /* ================= CARI DATA ================= */
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
        return Array.isArray(r.data) && r.data.length ? r.data[0] : null;
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

  /* ================= SIMPAN PRESENSI ================= */
  const simpanPresensi = async () => {
    if (!dataUser)
      return Swal.fire("Oops", "Cari data terlebih dahulu", "warning");

    if ((status === "izin" || status === "sakit") && !keteranganIzin.trim())
      return Swal.fire("Oops", "Keterangan wajib diisi", "warning");

    if (status === "pulang" && !isAfterJamPulang())
      return Swal.fire(
        "Belum Waktunya",
        "Presensi pulang hanya setelah jam 15:00",
        "warning"
      );

    try {
      setLoadingSimpan(true);

      const tanggal = new Date().toISOString().slice(0, 10);

      const cek = await axios.get(API.presensi, {
        params: { nomorUnik: dataUser.nomorUnik, tanggal },
      });

      const existing =
        Array.isArray(cek.data) && cek.data.length ? cek.data[0] : null;

      if (existing?.pulang)
        return Swal.fire("Ditolak", "Presensi hari ini sudah selesai", "error");

      if (!existing) {
        await axios.post(API.presensi, {
          nomorUnik: dataUser.nomorUnik,
          nama: dataUser.nama,
          kelas: dataUser.kelas || dataUser.ket || "-",
          kategori: status,
          masuk: status === "hadir" ? nowISO() : "",
          pulang: "",
          tanggal,
          keteranganIzin:
            status === "izin" || status === "sakit" ? keteranganIzin : "",
        });

        Swal.fire("Berhasil", "Presensi dicatat", "success");
      }

      if (existing && status === "pulang") {
        await axios.put(`${API.presensi}/${existing.id}`, {
          ...existing,
          pulang: nowISO(),
        });

        Swal.fire("Berhasil", "Presensi pulang dicatat", "success");
      }

      /* RESET */
      setStatus("");
      setKodeUnik("");
      setDataUser(null);
      setKeteranganIzin("");
    } catch {
      Swal.fire("Error", "Gagal menyimpan presensi", "error");
    } finally {
      setLoadingSimpan(false);
    }
  };

  /* ================= UI ================= */
  return (
    <div className="ml-40 p-6 max-w-5xl mx-auto min-h-screen bg-gray-100">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <FontAwesomeIcon icon={faClock} className="text-blue-700 text-5xl" />
          <div>
            <h1 className="text-3xl font-bold">Presensi Kehadiran</h1>
            <p className="text-gray-600 text-sm">
              Presensi siswa, guru, dan karyawan
            </p>
          </div>
        </div>

       
      </div>

      <CCard className="shadow-lg rounded-xl">
        <CCardBody className="space-y-8">

          {/* STEP 1 */}
          <Section title="Silahkan Presensi Hari ini!">
            <CFormSelect
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setKodeUnik("");
                setDataUser(null);
              }}
              className="w-80"
            >
              <option value="">-- Pilih Presensi --</option>
              <option value="hadir">Hadir</option>
              <option value="izin">Izin</option>
              <option value="sakit">Sakit</option>
              <option value="pulang" disabled={!isAfterJamPulang()}>
                Pulang (≥ 15:00)
              </option>
            </CFormSelect>
          </Section>

          {/* STEP 2 */}
          {status && (
            <Section title="Masukkan Kode Unik">
              <div className="flex flex-wrap gap-3">
                <CFormInput
                  className="w-80"
                  value={kodeUnik}
                  onChange={(e) => setKodeUnik(e.target.value)}
                  placeholder="Masukkan kode unik"
                />

                <CButton color="primary" onClick={cariData} disabled={loadingCari}>
                  <FontAwesomeIcon icon={faUserTag} /> Cari
                </CButton>

                <CButton
                  color="success"
                  onClick={simpanPresensi}
                  disabled={loadingSimpan}
                >
                  <FontAwesomeIcon icon={faUserCheck} /> Simpan
                </CButton>
              </div>
            </Section>
          )}

          {/* KETERANGAN */}
          {(status === "izin" || status === "sakit") && (
            <Section title="Keterangan">
              <CFormInput
                placeholder="Masukkan keterangan"
                value={keteranganIzin}
                onChange={(e) => setKeteranganIzin(e.target.value)}
              />
            </Section>
          )}

          {/* DATA USER */}
          {dataUser && (
            <Section title="Data Ditemukan">
              <div className="grid md:grid-cols-3 gap-4 bg-blue-50 p-4 rounded-lg">
                <div><b>Nama</b><br />{dataUser.nama}</div>
                <div><b>Kelas / Ket</b><br />{dataUser.kelas || dataUser.ket}</div>
                <div><b>Nomor Unik</b><br />{dataUser.nomorUnik}</div>
              </div>
            </Section>
          )}

          <div className="text-sm bg-yellow-50 border-l-4 border-yellow-400 p-3">
            <FontAwesomeIcon icon={faMagnifyingGlass} /> Presensi hanya 1× per hari.
            Pulang setelah jam 15:00.
          </div>

        </CCardBody>
      </CCard>
    </div>
  );
}
