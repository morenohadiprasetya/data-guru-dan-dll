import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import {
  CCard,
  CCardBody,
  CFormInput,
  CFormSelect,
  CButton,
  CBadge,
  CSpinner,
} from "@coreui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faIdCard,
  faUserCheck,
  faClock,
  faSchool,
  faPhone,
  faLocationDot,
  faArrowRotateLeft,
  faCircleInfo,
} from "@fortawesome/free-solid-svg-icons";

/* =========================================================
   API CONFIG
========================================================= */
const API = {
  siswa: "http://localhost:8080/siswa",
  guru: "http://localhost:8080/guru",
  karyawan: "http://localhost:8080/karyawan",
  presensi: "http://localhost:8080/presensi",
};

/* =========================================================
   HELPER WIB (VALID & AMAN)
========================================================= */
const getWIBDate = () => {
  return new Date(
    new Date().toLocaleString("en-US", {
      timeZone: "Asia/Jakarta",
    })
  );
};

const tanggalWIB = () => {
  const d = getWIBDate();
  return d.toISOString().slice(0, 10);
};

const nowISO = () => {
  const d = getWIBDate();
  return d.toISOString();
};

const isTerlambat = () => {
  const d = getWIBDate();
  return d.getHours() > 6 || (d.getHours() === 6 && d.getMinutes() > 50);
};

const isAfterJamPulang = () => {
  return getWIBDate().getHours() >= 16;
};

/* =========================================================
   MAIN COMPONENT
========================================================= */
export default function PresensiRFIDMaster() {
  /* ================= STATE ================= */
  const [kodeUnik, setKodeUnik] = useState("");
  const [dataUser, setDataUser] = useState(null);
  const [kategoriUser, setKategoriUser] = useState("");
  const [status, setStatus] = useState("");
  const [keterangan, setKeterangan] = useState("");
  const [loading, setLoading] = useState(false);

  /* ================= JAM REALTIME WIB ================= */
  const [jam, setJam] = useState(getWIBDate());
  useEffect(() => {
    const timer = setInterval(() => {
      setJam(getWIBDate());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  /* =========================================================
     RESET FORM
  ========================================================= */
  const resetForm = () => {
    setKodeUnik("");
    setDataUser(null);
    setKategoriUser("");
    setStatus("");
    setKeterangan("");
  };

  /* =========================================================
     CARI USER DARI MASTERDATA
  ========================================================= */
  const cariUserMaster = async () => {
    if (!kodeUnik.trim()) {
      return Swal.fire("Oops", "Nomor unik wajib diisi", "warning");
    }

    try {
      setLoading(true);
      setDataUser(null);
      setKategoriUser("");

      const cek = async (kategori) => {
        const res = await axios.get(API[kategori], {
          params: { nomorUnik: kodeUnik },
        });

        if (Array.isArray(res.data) && res.data.length) {
          setKategoriUser(kategori);
          return res.data[0];
        }
        return null;
      };

      const user =
        (await cek("siswa")) ||
        (await cek("guru")) ||
        (await cek("karyawan"));

      if (!user) {
        return Swal.fire(
          "Tidak Ditemukan",
          "Nomor unik tidak terdaftar di Masterdata",
          "error"
        );
      }

      setDataUser(user);
      Swal.fire("Berhasil", `${user.nama} ditemukan`, "success");
    } catch (err) {
      Swal.fire("Error", "Gagal mengambil data master", "error");
    } finally {
      setLoading(false);
    }
  };

  /* =========================================================
     SIMPAN PRESENSI
  ========================================================= */
  const simpanPresensi = async () => {
    if (!dataUser || !status) {
      return Swal.fire("Oops", "Pilih jenis presensi", "warning");
    }

    if ((status === "izin" || status === "sakit") && !keterangan.trim()) {
      return Swal.fire("Oops", "Keterangan wajib diisi", "warning");
    }

    try {
      setLoading(true);

      const tanggal = tanggalWIB();
      const cek = await axios.get(API.presensi, {
        params: {
          nomorUnik: dataUser.nomorUnik,
          tanggal,
        },
      });

      const existing = cek.data?.[0];

      /* ===== VALIDASI ===== */
      if (existing && existing.pulang) {
        return Swal.fire(
          "Ditolak",
          "Presensi hari ini sudah selesai",
          "error"
        );
      }

      if (existing && status !== "pulang") {
        return Swal.fire(
          "Info",
          "Anda sudah presensi hari ini",
          "info"
        );
      }

      /* ===== TENTUKAN STATUS ===== */
      let finalStatus = status;
      if (status === "hadir" && isTerlambat()) {
        finalStatus = "terlambat";
      }

      /* ===== INSERT HADIR / IZIN / SAKIT ===== */
      if (!existing) {
        await axios.post(API.presensi, {
          nomorUnik: dataUser.nomorUnik,
          nama: dataUser.nama,
          kategoriUser,
          kelas: dataUser.kelas || dataUser.ket || "-",
          alamat: dataUser.alamat || "-",
          hp: dataUser.hp || "-",
          tanggal,
          kategori: finalStatus,
          masuk: status === "hadir" ? nowISO() : "",
          pulang: "",
          keterangan:
            status === "izin" || status === "sakit" ? keterangan : "",
        });
      }

      /* ===== UPDATE PULANG ===== */
      if (existing && status === "pulang") {
        await axios.put(`${API.presensi}/${existing.id}`, {
          ...existing,
          pulang: nowISO(),
        });
      }

      Swal.fire("Sukses", "Presensi berhasil dicatat", "success");
      resetForm();
    } catch (err) {
      Swal.fire("Error", "Gagal menyimpan presensi", "error");
    } finally {
      setLoading(false);
    }
  };

  /* =========================================================
     UI
  ========================================================= */
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-200 p-4">
      <CCard className="w-full max-w-xl shadow-2xl rounded-2xl border-0">
        <CCardBody className="space-y-6">
          {/* HEADER */}
          <div className="text-center space-y-1">
            <FontAwesomeIcon
              icon={faClock}
              className="text-blue-600 text-5xl"
            />
            <div className="text-2xl font-bold">
              {jam.toLocaleTimeString("id-ID")} WIB
            </div>
            <div className="text-gray-500 text-sm">
              Sistem Presensi RFID Terintegrasi Masterdata
            </div>
          </div>

          {/* INPUT RFID */}
          {!dataUser && (
            <div className="space-y-4">
              <CFormInput
                placeholder="Tap RFID / Masukkan Nomor Unik"
                value={kodeUnik}
                onChange={(e) => setKodeUnik(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && cariUserMaster()}
                className="text-center text-xl py-3"
                autoFocus
              />
              <CButton
                color="primary"
                size="lg"
                className="w-full"
                onClick={cariUserMaster}
                disabled={loading}
              >
                {loading ? (
                  <CSpinner size="sm" />
                ) : (
                  <>
                    <FontAwesomeIcon icon={faIdCard} /> SUBMIT
                  </>
                )}
              </CButton>
            </div>
          )}

          {/* DATA USER */}
          {dataUser && (
            <>
              <div className="bg-blue-50 rounded-xl p-5 space-y-3">
                <div className="flex justify-between items-center">
                  <div className="text-xl font-bold text-blue-700">
                    {dataUser.nama}
                  </div>
                  <CBadge color="info">
                    {kategoriUser.toUpperCase()}
                  </CBadge>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2">
                    <FontAwesomeIcon icon={faSchool} />
                    {dataUser.kelas || dataUser.ket || "-"}
                  </div>
                  <div className="flex items-center gap-2">
                    <FontAwesomeIcon icon={faPhone} />
                    {dataUser.hp || "-"}
                  </div>
                  <div className="flex items-center gap-2 col-span-2">
                    <FontAwesomeIcon icon={faLocationDot} />
                    {dataUser.alamat || "-"}
                  </div>
                  <div className="text-xs col-span-2 text-gray-500">
                    Nomor Unik: <b>{dataUser.nomorUnik}</b>
                  </div>
                </div>
              </div>

              {/* PILIH PRESENSI */}
              <CFormSelect
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                size="lg"
              >
                <option value="">Pilih Presensi</option>
                <option value="hadir">Hadir</option>
                <option value="izin">Izin</option>
                <option value="sakit">Sakit</option>
                <option value="pulang" disabled={!isAfterJamPulang()}>
                  Pulang (≥ 15:00 WIB)
                </option>
              </CFormSelect>

              {(status === "izin" || status === "sakit") && (
                <CFormInput
                  placeholder="Keterangan izin / sakit"
                  value={keterangan}
                  onChange={(e) => setKeterangan(e.target.value)}
                />
              )}

              <div className="flex gap-3">
                <CButton
                  color="success"
                  size="lg"
                  className="flex-1"
                  onClick={simpanPresensi}
                  disabled={loading}
                >
                  <FontAwesomeIcon icon={faUserCheck} /> SIMPAN
                </CButton>
                <CButton
                  color="secondary"
                  size="lg"
                  onClick={resetForm}
                >
                  <FontAwesomeIcon icon={faArrowRotateLeft} />
                </CButton>
              </div>
            </>
          )}
        </CCardBody>
      </CCard>
    </div>
  );
}
