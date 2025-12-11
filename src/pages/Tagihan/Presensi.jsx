// Presensi.jsx
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
import { faClock, faUserCheck, faUserTag, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

const API = {
  siswa: "http://localhost:5000/siswa",
  guru: "http://localhost:5000/guru",
  karyawan: "http://localhost:5000/karyawan",
  presensi: "http://localhost:5000/presensi",
};

function nowISO() {
  return new Date().toISOString();
}

export default function Presensi() {
  const navigate = useNavigate(); // FIX WAJIB

  const [kodeUnik, setKodeUnik] = useState("");
  const [dataUser, setDataUser] = useState(null);
  const [status, setStatus] = useState("");
  const [keteranganIzin, setKeteranganIzin] = useState("");
  const [loadingCari, setLoadingCari] = useState(false);
  const [loadingSimpan, setLoadingSimpan] = useState(false);

  const cariData = async () => {
    if (!kodeUnik.trim()) {
      Swal.fire("Oops", "Kode unik masih kosong", "warning");
      return;
    }

    try {
      setLoadingCari(true);

      const cekApi = async (url) => {
        const r = await axios.get(url, { params: { nomorUnik: kodeUnik } });
        if (Array.isArray(r.data) && r.data.length > 0) return r.data[0];
        return null;
      };

      const hasil =
        (await cekApi(API.siswa)) ||
        (await cekApi(API.guru)) ||
        (await cekApi(API.karyawan));

      if (hasil) {
        setDataUser(hasil);
        Swal.fire("Ditemukan", `${hasil.nama} ditemukan`, "success");
      } else {
        setDataUser(null);
        Swal.fire("Tidak ditemukan", "Kode unik tidak ada di Masterdata", "error");
      }
    } catch {
      Swal.fire("Error", "Gagal mencari data (cek koneksi)", "error");
    } finally {
      setLoadingCari(false);
    }
  };

  const simpanPresensi = async () => {
    if (!status) return Swal.fire("Oops", "Pilih status presensi", "warning");
    if (!dataUser) return Swal.fire("Oops", "Belum ada data yang dipilih", "warning");

    if (status === "izin" && (!keteranganIzin.trim())) {
      return Swal.fire("Oops", "Keterangan izin wajib diisi", "warning");
    }

    try {
      setLoadingSimpan(true);

      const tanggal = new Date().toISOString().slice(0, 10);

      const cek = await axios.get(API.presensi, {
        params: { nomorUnik: dataUser.nomorUnik, tanggal },
      });

      let existing =
        Array.isArray(cek.data) && cek.data.length > 0 ? cek.data[0] : null;

      if (!existing) {
        const payload = {
          nomorUnik: dataUser.nomorUnik,
          nama: dataUser.nama,
          kelas: dataUser.kelas || dataUser.ket || "-",
          kategori: status,
          masuk: status === "hadir" ? nowISO() : "",
          pulang: status === "pulang" ? nowISO() : "",
          tanggal,
          keteranganIzin: status === "izin" ? keteranganIzin : "",
        };

        await axios.post(API.presensi, payload);
        Swal.fire("Berhasil", "Presensi baru tersimpan", "success");
      } else {
        const updated = {
          ...existing,
          kategori: status,
          masuk:
            existing.masuk && existing.masuk !== ""
              ? existing.masuk
              : status === "hadir"
              ? nowISO()
              : "",
          pulang: status === "pulang" ? nowISO() : existing.pulang || "",
          keteranganIzin:
            status === "izin" ? keteranganIzin : existing.keteranganIzin || "",
        };

        await axios.put(`${API.presensi}/${existing.id}`, updated);
        Swal.fire("Berhasil", "Presensi diupdate", "success");
      }

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

  return (
    <div className="ml-40 p-2 max-w-5xl mx-auto w-full bg-gray-100 min-h-screen rounded-full">
      
      <div className="flex items-center gap-3 mb-6">
        <FontAwesomeIcon icon={faClock} className="text-blue-700 text-4xl" />
        <h1 className="text-3xl font-bold">Presensi Manual</h1>
      </div>

      {/* Tombol Kembali */}
      <button
        onClick={() => navigate("/dashboard")}
        className="fixed top-5 left-5 px-4 py-2 bg-blue-700 text-white rounded shadow z-50"
      >
        Kembali ke Menu
      </button>

      <CCard className="p-4 shadow-lg border border-gray-200 rounded-lg bg-white">
        <CCardBody>
          <label className="block mb-3 text-lg font-bold">Masukkan Kode Unik</label>

          <div className="flex gap-3 items-center">
            <CFormInput
              placeholder=" Masukan Kode"
              className="w-72 p-3 text-lg shadow-sm"
              value={kodeUnik}
              onChange={(e) => setKodeUnik(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && cariData()}
            />

            <CButton
              color="primary"
              className="px-4 py-2 text-lg shadow-md flex items-center gap-2"
              onClick={cariData}
              disabled={loadingCari}
            >
              <FontAwesomeIcon icon={faUserTag} />
              {loadingCari ? "Mencari..." : "Cari"}
            </CButton>

            <div className="ml-4">
              <CFormSelect
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="shadow-sm"
              >
                <option value="">-- Pilih Status --</option>
                <option value="hadir">Hadir</option>
                <option value="sakit">Sakit</option>
                <option value="izin">Izin</option>
                <option value="pulang">Pulang</option>
              </CFormSelect>
            </div>

            <CButton
              color="success"
              className="px-4 py-2 text-lg shadow-md"
              onClick={simpanPresensi}
              disabled={loadingSimpan}
            >
              <FontAwesomeIcon icon={faUserCheck} />
              {loadingSimpan ? "Menyimpan..." : "Simpan"}
            </CButton>
          </div>

          {status === "izin" && (
            <div className="mt-4">
              <CFormInput
                placeholder="Keterangan izin (contoh: sakit perut, urusan keluarga)"
                className="w-72 p-3 text-lg shadow-sm"
                value={keteranganIzin}
                onChange={(e) => setKeteranganIzin(e.target.value)}
              />
            </div>
          )}

          {dataUser && (
            <div className="mt-6 bg-gray-50 p-4 rounded border">
              <div className="grid grid-cols-2 gap-3 text-lg">
                <div><b>Nama:</b> {dataUser.nama}</div>
                <div><b>No HP:</b> {dataUser.hp || "-"}</div>
                <div><b>Alamat:</b> {dataUser.alamat || "-"}</div>
                <div><b>Kelas/Ket:</b> {dataUser.kelas || dataUser.ket || "-"}</div>
                <div><b>Nomor Unik:</b> {dataUser.nomorUnik || "-"}</div>
              </div>
            </div>
          )}

          <div className="mt-4 text-sm text-gray-600">
            <FontAwesomeIcon icon={faMagnifyingGlass} /> Tekan Enter atau tombol <b>Cari</b>.
            Pilih status lalu <b>Simpan</b>. Jika sudah ada presensi hari ini, data akan diupdate.
          </div>
        </CCardBody>
      </CCard>
    </div>
  );
}
