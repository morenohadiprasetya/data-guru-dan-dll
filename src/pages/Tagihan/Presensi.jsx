import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const API_SISWA = "http://localhost:5000/siswa";
const API_PRESENSI = "http://localhost:5000/presensi";

export default function Presensi() {
  const [siswa, setSiswa] = useState([]);
  const [selectedSiswa, setSelectedSiswa] = useState("");
  const [kelas, setKelas] = useState("");
  const [nomorUnik, setNomorUnik] = useState("");

  const [inputKode, setInputKode] = useState(""); // ← input KODE UNIK

  const [opsi, setOpsi] = useState("masuk");
  const [tanggal, setTanggal] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [riwayat, setRiwayat] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios.get(API_SISWA).then((res) => setSiswa(res.data));
  }, []);

  useEffect(() => {
    loadRiwayat();
  }, [tanggal]);

  const loadRiwayat = async () => {
    const res = await axios.get(`${API_PRESENSI}?tanggal=${tanggal}`);
    setRiwayat(res.data);
  };

  const handleSiswaChange = (e) => {
    const id = e.target.value;
    setSelectedSiswa(id);

    const detail = siswa.find((s) => s.id === id);

    if (detail) {
      setKelas(detail.kelas);
      setNomorUnik(detail.nomorUnik); // ambil nomor unik
    }

    setInputKode(""); // reset kode unik input
  };

  const ambilJam = () => {
    const now = new Date();
    return now.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // ===================
  // SUBMIT PRESENSI
  // ===================
  const submitPresensi = async () => {
    if (!selectedSiswa) {
      Swal.fire("Pilih siswa dulu!", "", "warning");
      return;
    }

    // ** VALIDASI KODE UNIK **
    if (inputKode !== nomorUnik) {
      Swal.fire("Kode Unik Salah!", "Presensi tidak bisa dilanjutkan.", "error");
      return;
    }

    setLoading(true);

    try {
      const siswaDetail = siswa.find((s) => s.id === selectedSiswa);
      const jam = ambilJam();

      const getToday = await axios.get(
        `${API_PRESENSI}?id_siswa=${selectedSiswa}&tanggal=${tanggal}`
      );

      const existing = getToday.data[0];

      if (existing) {
        // UPDATE
        const updateBody = {
          ...existing,
          nomorUnik: siswaDetail.nomorUnik,
          [opsi]: jam,
        };

        await axios.put(`${API_PRESENSI}/${existing.id}`, updateBody);

        Swal.fire(
          "Berhasil",
          `Presensi ${opsi.toUpperCase()} dicatat: ${jam}`,
          "success"
        );
      } else {
        // CREATE BARU
        const newData = {
          id: Date.now(),
          tanggal,
          id_siswa: siswaDetail.id,
          nama: siswaDetail.nama,
          kelas: siswaDetail.kelas,
          nomorUnik: siswaDetail.nomorUnik,
          masuk: opsi === "masuk" ? jam : "",
          pulang: opsi === "pulang" ? jam : "",
        };

        await axios.post(API_PRESENSI, newData);

        Swal.fire(
          "Berhasil",
          `Presensi ${opsi.toUpperCase()} dicatat: ${jam}`,
          "success"
        );
      }
    } catch (err) {
      Swal.fire("Error", err.message, "error");
    }

    setLoading(false);
    loadRiwayat();
  };

  // DELETE
  const deletePresensi = async (id) => {
    Swal.fire({
      title: "Hapus data ini?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya",
      cancelButtonText: "Batal",
    }).then(async (res) => {
      if (res.isConfirmed) {
        await axios.delete(`${API_PRESENSI}/${id}`);
        loadRiwayat();
        Swal.fire("Terhapus!", "", "success");
      }
    });
  };

  return (
    <div className="p-4" style={{ maxWidth: "900px", margin: "auto" }}>
      <h2>📌 Presensi Siswa</h2>

      {/* FILTER TANGGAL */}
      <div className="card p-3 mt-3">
        <label>Tanggal Presensi</label>
        <input
          type="date"
          className="form-control"
          value={tanggal}
          onChange={(e) => setTanggal(e.target.value)}
        />
      </div>

      {/* FORM PRESENSI */}
      <div className="card p-3 mt-3">
        <label>Pilih Siswa</label>
        <select
          className="form-control"
          value={selectedSiswa}
          onChange={handleSiswaChange}
        >
          <option value="">-- Pilih --</option>
          {siswa.map((s) => (
            <option value={s.id} key={s.id}>
              {s.nama} - {s.kelas}
            </option>
          ))}
        </select>

        {/* INPUT KODE UNIK */}
        <label className="mt-3">Masukkan Kode Unik</label>
        <input
          className="form-control"
          placeholder="Masukkan kode unik"
          value={inputKode}
          onChange={(e) => setInputKode(e.target.value)}
        />

        <label className="mt-3">Jenis Presensi</label>
        <select
          className="form-control"
          value={opsi}
          onChange={(e) => setOpsi(e.target.value)}
        >
          <option value="masuk">Presensi Masuk</option>
          <option value="pulang">Presensi Pulang</option>
        </select>

        <button
          className="btn btn-primary mt-4"
          onClick={submitPresensi}
          disabled={loading}
        >
          {loading ? "Menyimpan..." : "Simpan Presensi"}
        </button>
      </div>

      {/* RIWAYAT */}
      <div className="card p-3 mt-4">
        <h4>Riwayat Presensi ({tanggal})</h4>

        {riwayat.length === 0 ? (
          <p className="mt-3">Belum ada presensi hari ini.</p>
        ) : (
          <table className="table mt-3 table-striped">
            <thead>
              <tr>
                <th>Nomor Unik</th>
                <th>Nama</th>
                <th>Kelas</th>
                <th>Masuk</th>
                <th>Pulang</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {riwayat.map((p) => (
                <tr key={p.id}>
                  <td>{p.nomorUnik}</td>
                  <td>{p.nama}</td>
                  <td>{p.kelas}</td>
                  <td>{p.masuk || "-"}</td>
                  <td>{p.pulang || "-"}</td>
                  <td>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => deletePresensi(p.id)}
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <br />
    </div>
  );
}
