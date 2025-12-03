import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const API = {
  siswa: "http://localhost:5000/siswa",
  guru: "http://localhost:5000/guru",
  karyawan: "http://localhost:5000/karyawan",
};

const API_PRESENSI = "http://localhost:5000/presensi";

export default function Presensi() {
  const [level, setLevel] = useState("siswa"); // ← OPSI LEVEL
  const [dataLevel, setDataLevel] = useState([]);

  const [selectedUser, setSelectedUser] = useState("");
  const [kelas, setKelas] = useState("");
  const [nomorUnik, setNomorUnik] = useState("");

  const [inputKode, setInputKode] = useState("");

  const [opsi, setOpsi] = useState("masuk");
  const [tanggal, setTanggal] = useState(new Date().toISOString().split("T")[0]);
  const [riwayat, setRiwayat] = useState([]);
  const [loading, setLoading] = useState(false);

  // === FETCH DATA BERDASARKAN LEVEL ===
  useEffect(() => {
    axios.get(API[level]).then((res) => setDataLevel(res.data));
    setSelectedUser("");
    setNomorUnik("");
    setKelas("");
    setInputKode("");
  }, [level]);

  useEffect(() => {
    loadRiwayat();
  }, [tanggal]);

  const loadRiwayat = async () => {
    const res = await axios.get(`${API_PRESENSI}?tanggal=${tanggal}`);
    setRiwayat(res.data);
  };

  const handleUserChange = (e) => {
    const id = e.target.value;
    setSelectedUser(id);

    const detail = dataLevel.find((s) => s.id === id);

    if (detail) {
      setKelas(detail.kelas || detail.ket || "-");
      setNomorUnik(detail.nomorUnik);
    }

    setInputKode("");
  };

  const ambilJam = () => {
    const now = new Date();
    return now.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // SUBMIT PRESENSI
  const submitPresensi = async () => {
    if (!selectedUser) {
      Swal.fire("Pilih dulu!", "", "warning");
      return;
    }

    if (inputKode !== nomorUnik) {
      Swal.fire("Kode Unik Salah!", "Presensi dibatalkan.", "error");
      return;
    }

    setLoading(true);

    try {
      const detail = dataLevel.find((s) => s.id === selectedUser);
      const jam = ambilJam();

      const getToday = await axios.get(
        `${API_PRESENSI}?id_user=${selectedUser}&tanggal=${tanggal}`
      );

      const existing = getToday.data[0];

      if (existing) {
       const updateBody = {
  ...existing,
  level, // ← tambahkan
  nomorUnik: detail.nomorUnik,
  [opsi]: jam,
};


        await axios.put(`${API_PRESENSI}/${existing.id}`, updateBody);

        Swal.fire("Berhasil", `Presensi ${opsi} dicatat: ${jam}`, "success");
      } else {
        const newData = {
          id: String(Date.now()),

          tanggal,
          id_user: detail.id,
          nama: detail.nama,
          level, // ← SIMPAN LEVEL
          kelas: detail.kelas || detail.ket || "-",
          nomorUnik: detail.nomorUnik,
          masuk: opsi === "masuk" ? jam : "",
          pulang: opsi === "pulang" ? jam : "",
        };

        await axios.post(API_PRESENSI, newData);

        Swal.fire("Berhasil", `Presensi ${opsi} dicatat: ${jam}`, "success");
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
      <h2>📌 Presensi</h2>



      {/* TANGGAL */}
      <div className="card p-3 mt-3">
        <label>Tanggal Presensi</label>
        <input
          type="date"
          className="form-control"
          value={tanggal}
          onChange={(e) => setTanggal(e.target.value)}
        />
      </div>
      <div className="card p-3 mt-3">
        <label>Pilih Level</label>
        <select
          className="form-control"
          value={level}
          onChange={(e) => setLevel(e.target.value)}
        >
          <option value="siswa">Siswa</option>
          <option value="guru">Guru</option>
          <option value="karyawan">Karyawan</option>
        </select>
      </div>

      {/* FORM */}
      <div className="card p-3 mt-3">
        <label>Pilih {level}</label>
        <select
          className="form-control"
          value={selectedUser}
          onChange={handleUserChange}
        >
          <option value="">-- Pilih --</option>
          {dataLevel.map((s) => (
            <option value={s.id} key={s.id}>
              {s.nama} ({s.nomorUnik})
            </option>
          ))}
        </select>

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
          <option value="masuk">Masuk</option>
          <option value="pulang">Pulang</option>
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
        <h4>Rekap Presensi ({tanggal})</h4>

        {riwayat.length === 0 ? (
          <p className="mt-3">Belum ada presensi hari ini.</p>
        ) : (
          <table className="table mt-3 table-striped">
            <thead>
              <tr>
                <th>Level</th>
                <th>Nomor Unik</th>
                <th>Nama</th>
                <th>Kelas/Jabatan/Mapel</th>
                <th>Masuk</th>
                <th>Pulang</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {riwayat.map((p) => (
                <tr key={p.id}>
                  <td>{p.level}</td>
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
    </div>
  );
}
