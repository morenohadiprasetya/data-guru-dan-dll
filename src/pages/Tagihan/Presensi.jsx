import React, { useState, useEffect } from "react";
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
  faCircleInfo,
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

// pulang ≥ 15:00
const isAfterJamPulang = () => {
  const d = new Date();
  return d.getHours() > 15 || (d.getHours() === 15 && d.getMinutes() >= 0);
};

// terlambat > 06:50
const isTerlambat = () => {
  const d = new Date();
  return d.getHours() > 6 || (d.getHours() === 6 && d.getMinutes() > 50);
};

/* ================= MAIN ================= */
export default function Presensi() {
  const navigate = useNavigate();

  const [status, setStatus] = useState("");
  const [kodeUnik, setKodeUnik] = useState("");
  const [dataUser, setDataUser] = useState(null);
  const [keteranganIzin, setKeteranganIzin] = useState("");
  const [loadingCari, setLoadingCari] = useState(false);
  const [loadingSimpan, setLoadingSimpan] = useState(false);

  /* ===== JAM WIB REALTIME ===== */
  const [jamWIB, setJamWIB] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setJamWIB(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);
  /* ============================ */

  /* ================= CARI DATA ================= */
  const cariData = async () => {
    if (!kodeUnik.trim())
      return Swal.fire("Oops", "Kode unik masih kosong", "warning");

    try {
      setLoadingCari(true);
      setDataUser(null);
      setKeteranganIzin("");

      const cek = async (url) => {
        const r = await axios.get(url, { params: { nomorUnik: kodeUnik } });
        return Array.isArray(r.data) && r.data.length ? r.data[0] : null;
      };

      const hasil =
        (await cek(API.siswa)) ||
        (await cek(API.guru)) ||
        (await cek(API.karyawan));

      if (!hasil) {
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

    try {
      setLoadingSimpan(true);
      const tanggal = new Date().toISOString().slice(0, 10);

      const cek = await axios.get(API.presensi, {
        params: { nomorUnik: dataUser.nomorUnik, tanggal },
      });

      const existing =
        Array.isArray(cek.data) && cek.data.length ? cek.data[0] : null;

      if (existing && existing.pulang) {
        return Swal.fire(
          "Ditolak",
          "Presensi hari ini sudah selesai",
          "error"
        );
      }

      let kategoriFinal = status;
      if (status === "hadir" && isTerlambat()) {
        kategoriFinal = "terlambat";
      }

      if (!existing) {
        await axios.post(API.presensi, {
          nomorUnik: dataUser.nomorUnik,
          nama: dataUser.nama,
          kelas: dataUser.kelas || dataUser.ket || "-",
          kategori: kategoriFinal,
          masuk: status === "hadir" ? nowISO() : "",
          pulang: "",
          tanggal,
          keteranganIzin:
            status === "izin" || status === "sakit" ? keteranganIzin : "",
        });

        Swal.fire(
          "Success",
          kategoriFinal === "terlambat"
            ? "Presensi berhasil (Terlambat)"
            : "Presensi berhasil",
          "success"
        );
      }

      if (existing && status === "pulang") {
        await axios.put(`${API.presensi}/${existing.id}`, {
          ...existing,
          pulang: nowISO(),
        });

        Swal.fire("Berhasil", "Presensi pulang dicatat", "success");
      }

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
    <div className="ml-7 p-6 min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
      {/* HEADER */}
      <div className="flex items-center gap-4 mb-8">
        <FontAwesomeIcon icon={faClock} className="text-blue-600 text-5xl" />
        <div>
          <h1 className="text-3xl font-bold text-blue-700">
            Presensi Kehadiran
          </h1>
          <p className="text-sm text-gray-600">
            {jamWIB.toLocaleDateString("id-ID", {
              weekday: "long",
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}{" "}
            —{" "}
            <span className="font-semibold">
              {jamWIB.toLocaleTimeString("id-ID", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })} WIB
            </span>
          </p>
          <p className="text-gray-500 text-xs">
            Siswa, Guru, dan Karyawan
          </p>
        </div>
      </div>

      <CCard className="rounded-xl shadow-lg">
        <CCardBody className="space-y-8">
          {/* STATUS */}
          <div className="space-y-2">
            <label className="font-semibold">Pilih Jenis Presensi</label>
            <CFormSelect
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setKodeUnik("");
                setDataUser(null);
                setKeteranganIzin("");
              }}
              className="max-w-sm"
            >
              <option value="">-- Pilih Presensi --</option>
              <option value="hadir">Hadir</option>
              <option value="izin">Izin</option>
              <option value="sakit">Sakit</option>
              <option value="pulang" disabled={!isAfterJamPulang()}>
                Pulang (≥ 15:00)
              </option>
            </CFormSelect>
          </div>

          {/* KODE UNIK */}
          {status && (
            <div className="space-y-3">
              <label className="font-semibold">Kode Unik</label>
              <div className="flex flex-wrap gap-3">
                <CFormInput
                  className="max-w-sm"
                  value={kodeUnik}
                  onChange={(e) => setKodeUnik(e.target.value)}
                  placeholder="Masukkan kode unik"
                />
                <CButton
                  color="primary"
                  onClick={cariData}
                  disabled={loadingCari}
                >
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
            </div>
          )}

          {/* KETERANGAN */}
          {(status === "izin" || status === "sakit") && dataUser && (
            <div className="space-y-2">
              <label className="font-semibold">Keterangan</label>
              <CFormInput
                placeholder="Masukkan keterangan izin / sakit"
                value={keteranganIzin}
                onChange={(e) => setKeteranganIzin(e.target.value)}
              />
            </div>
          )}

          {/* DATA USER */}
          {dataUser && (
            <div className="bg-blue-50 p-4 rounded-lg grid md:grid-cols-3 gap-4">
              <div>
                <div className="text-xs text-gray-500">Nama</div>
                <div className="font-semibold">{dataUser.nama}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Kelas / Ket</div>
                <div className="font-semibold">
                  {dataUser.kelas || dataUser.ket}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Nomor Unik</div>
                <div className="font-semibold">{dataUser.nomorUnik}</div>
              </div>
            </div>
          )}

          {/* INFO */}
          <div className="flex items-start gap-3 bg-yellow-50 border-l-4 border-yellow-400 p-3 text-sm">
            <FontAwesomeIcon icon={faCircleInfo} className="mt-1" />
            <div>
              Presensi hanya <b>1× per hari</b>. <br />
              Hadir lewat <b>06:50</b> otomatis <b>Terlambat</b>. <br />
              Pulang aktif setelah <b>15:00</b>.
            </div>
          </div>
        </CCardBody>
      </CCard>
    </div>
  );
}
