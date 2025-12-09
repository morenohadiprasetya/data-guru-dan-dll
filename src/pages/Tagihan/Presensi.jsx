// Presensi.jsx
import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
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
  const [kodeUnik, setKodeUnik] = useState("");
  const [dataUser, setDataUser] = useState(null);
  const [status, setStatus] = useState("");
  const [loadingCari, setLoadingCari] = useState(false);
  const [loadingSimpan, setLoadingSimpan] = useState(false);

  // cari data di masterdata
  const cariData = async () => {
    if (!kodeUnik || kodeUnik.trim() === "") {
      Swal.fire("Oops", "Kode unik masih kosong", "warning");
      return;
    }

    try {
      setLoadingCari(true);
      // helper untuk cek endpoint dengan params nomorUnik
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
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Gagal mencari data (cek koneksi)", "error");
    } finally {
      setLoadingCari(false);
    }
  };

  // simpan presensi -> create atau update (lock masuk)
  const simpanPresensi = async () => {
    if (!status) return Swal.fire("Oops", "Pilih status presensi", "warning");
    if (!dataUser) return Swal.fire("Oops", "Belum ada data yang dipilih", "warning");

    try {
      setLoadingSimpan(true);

      const tanggal = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

      // cek apakah sudah ada record hari ini berdasarkan nomorUnik + tanggal
      const cek = await axios.get(API.presensi, {
        params: { nomorUnik: dataUser.nomorUnik, tanggal },
      });

      let existing = Array.isArray(cek.data) && cek.data.length > 0 ? cek.data[0] : null;

      if (!existing) {
        // buat record baru
        const payload = {
          nomorUnik: dataUser.nomorUnik,
          nama: dataUser.nama,
          kelas: dataUser.kelas || dataUser.ket || "-",
          kategori: status,
          masuk: status === "hadir" ? nowISO() : "",
          pulang: status === "pulang" ? nowISO() : "",
          tanggal,
        };

        await axios.post(API.presensi, payload);
        Swal.fire("Berhasil", "Presensi baru tersimpan", "success");
      } else {
        // update record existing, tapi jangan timpa masuk jika sudah ada
        const updated = {
          ...existing,
          kategori: status,
          // lock masuk: kalau sudah ada masuk, tetap pakai yang lama
          masuk: existing.masuk && existing.masuk !== "" ? existing.masuk : (status === "hadir" ? nowISO() : ""),
          // pulang hanya diupdate bila status === 'pulang'
          pulang: status === "pulang" ? nowISO() : existing.pulang || "",
        };

        // PUT ke /presensi/:id (json-server expects numeric id or string id, it keeps it)
        await axios.put(`${API.presensi}/${existing.id}`, updated);
        Swal.fire("Berhasil", "Presensi diupdate", "success");
      }

      // reset form
      setKodeUnik("");
      setDataUser(null);
      setStatus("");
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Gagal menyimpan presensi", "error");
    } finally {
      setLoadingSimpan(false);
    }
  };

  return (
    <div className="p-2 ml-10 max-w-5xl mx-auto bg-gray-100 min-h-screen rounded-xl">
      <div className="flex items-center gap-3 mb-6">
        <FontAwesomeIcon icon={faClock} className="text-blue-700 text-4xl" />
        <h1 className="text-3xl font-bold">Presensi Manual</h1>
      </div>

      <CCard className="p-4 shadow-lg border border-gray-200 rounded-lg bg-white">
        <CCardBody>
          <label className="block mb-3 text-lg font-bold">Masukkan Kode Unik</label>

          <div className="flex gap-3 items-center">
            <CFormInput
              placeholder="Contoh: T-0969 atau 889922"
              className="w-72 p-3 text-lg shadow-sm"
              value={kodeUnik}
              onChange={(e) => setKodeUnik(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") cariData();
              }}
            />
            <CButton
              color="primary"
              className="px-4 py-2 text-lg shadow-md flex items-center gap-2"
              onClick={cariData}
              disabled={loadingCari}
            >
              <FontAwesomeIcon icon={faUserTag} /> {loadingCari ? "Mencari..." : "Cari"}
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
              <FontAwesomeIcon icon={faUserCheck} /> {loadingSimpan ? "Menyimpan..." : "Simpan"}
            </CButton>
          </div>

          {/* DETAIL USER */}
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
            <FontAwesomeIcon icon={faMagnifyingGlass} /> Tekan Enter atau tombol <b>Cari</b> untuk menemukan user.
            Setelah ditemukan, pilih status lalu <b>Simpan</b>. Jika sudah ada presensi hari ini, data akan diupdate (masuk terkunci).
          </div>
        </CCardBody>
      </CCard>
    </div>
  );
}
