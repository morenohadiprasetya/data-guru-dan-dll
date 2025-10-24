import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

function TambahData() {
  const nav = useNavigate();
  const lokasi = useLocation();
  const query = new URLSearchParams(lokasi.search);
  const kategori = query.get("kategori") || "Siswa";

  const [form, setForm] = useState({
    nama: "",
    ket: "",
    alamat: "",
    hp: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validasi sederhana
    if (!form.nama || !form.ket || !form.alamat || !form.hp) {
      Swal.fire("⚠️", "Semua kolom harus diisi!", "warning");
      return;
    }

    try {
      const endpoint = `http://localhost:5000/${kategori.toLowerCase()}`;
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Gagal menambah data");

      Swal.fire("✅", "Data berhasil ditambahkan!", "success");
      nav(`/apo?kategori=${kategori}`);
    } catch (err) {
      Swal.fire("❌", "Terjadi kesalahan saat menambah data!", "error");
      console.error(err);
    }
  };

  return (
    <div style={{ padding: 30, fontFamily: "Segoe UI" }}>
      <div
        style={{
          marginLeft: -200,
          background: "#fff",
          borderRadius: "12px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          padding: "25px 40px",
          maxWidth: 450,
          margin: "0 auto",
        }}
      >
        <h2 style={{ marginBottom: 20, color: "#1f2937" }}>
          ➕ Tambah Data {kategori}
        </h2>

        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 15,
          }}
        >
          <label style={{ fontWeight: 600 }}>Nama</label>
          <input
            name="nama"
            value={form.nama}
            onChange={handleChange}
            style={{
              border: "1px solid #d1d5db",
              borderRadius: 8,
              padding: "8px 10px",
            }}
          />

          <label style={{ fontWeight: 600 }}>
            {kategori === "Siswa"
              ? "Kelas"
              : kategori === "Guru"
              ? "Mapel"
              : "Jabatan"}
          </label>
          <input
            name="ket"
            value={form.ket}
            onChange={handleChange}
            style={{
              border: "1px solid #d1d5db",
              borderRadius: 8,
              padding: "8px 10px",
            }}
          />

          <label style={{ fontWeight: 600 }}>Alamat</label>
          <input
            name="alamat"
            value={form.alamat}
            onChange={handleChange}
            style={{
              border: "1px solid #d1d5db",
              borderRadius: 8,
              padding: "8px 10px",
            }}
          />

          <label style={{ fontWeight: 600 }}>Nomor HP</label>
          <input
            name="hp"
            value={form.hp}
            onChange={handleChange}
            style={{
              border: "1px solid #d1d5db",
              borderRadius: 8,
              padding: "8px 10px",
            }}
          />

          <button
            type="submit"
            style={{
              background: "#2563eb",
              color: "#fff",
              border: 0,
              borderRadius: 8,
              padding: "10px 0",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            Simpan Data
          </button>

          <button
            type="button"
            onClick={() => nav(`/apo?kategori=${kategori}`)}
            style={{
              background: "#ef4444",
              color: "#fff",
              border: 0,
              borderRadius: 8,
              padding: "10px 0",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            Batal
          </button>
        </form>
      </div>
    </div>
  );
}

export default TambahData;
