import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

function Tambah() {
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

    const endpoint = `http://localhost:5000/${kategori.toLowerCase()}`;

    if (!form.nama || !form.ket || !form.alamat || !form.hp) {
      Swal.fire("⚠️", "Semua kolom harus diisi!", "warning");
      return;
    }

    await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    Swal.fire("✅", "Data berhasil ditambahkan!", "success");
    nav(`/apo?kategori=${kategori}`);
  };

  return (
    <div style={{ padding: 30,  fontFamily: "Segoe UI" }}>
      <div
        style={{
          marginLeft: -200,
          background: "#fff",
          borderRadius: 12,
          boxShadow: "0 9px 8px rgba(0,0,0,0.1)",
          padding: "25px 40px",
          maxWidth: 600,
          margin: "0 auto",
          border: "1px solid #e5e7eb",
        }}
      >
        <h2 style={{ marginBottom: 25, color: "#1f2937" }}>
          ➕ Tambah Data {kategori}
        </h2>

        <form onSubmit={handleSubmit}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginBottom: 20,
            }}
          >
            <tbody>
              <tr>
                <td
                  style={{
                    padding: "10px",
                    border: "1px solid #e5e7eb",
                    width: "30%",
                    fontWeight: 600,
                  }}
                >
                  Nama
                </td>
                <td style={{ border: "1px solid #e5e7eb", padding: "10px" }}>
                  <input
                    name="nama"
                    value={form.nama}
                    onChange={handleChange}
                    placeholder="Masukkan nama"
                    style={{
                      width: "100%",
                      border: "1px solid #d1d5db",
                      borderRadius: 8,
                      padding: "8px",
                    }}
                  />
                </td>
              </tr>

              <tr>
                <td
                  style={{
                    padding: "10px",
                    border: "1px solid #e5e7eb",
                    fontWeight: 600,
                  }}
                >
                  {kategori === "Siswa"
                    ? "Kelas"
                    : kategori === "Guru"
                    ? "Mapel"
                    : "Jabatan"}
                </td>
                <td style={{ border: "1px solid #e5e7eb", padding: "10px" }}>
                  <input
                    name="ket"
                    value={form.ket}
                    onChange={handleChange}
                    placeholder="Masukkan data"
                    style={{
                      width: "100%",
                      border: "1px solid #d1d5db",
                      borderRadius: 8,
                      padding: "8px",
                    }}
                  />
                </td>
              </tr>

              <tr>
                <td
                  style={{
                    padding: "10px",
                    border: "1px solid #e5e7eb",
                    fontWeight: 600,
                  }}
                >
                  Alamat
                </td>
                <td style={{ border: "1px solid #e5e7eb", padding: "10px" }}>
                  <input
                    name="alamat"
                    value={form.alamat}
                    onChange={handleChange}
                    placeholder="Masukkan alamat"
                    style={{
                      width: "100%",
                      border: "1px solid #d1d5db",
                      borderRadius: 8,
                      padding: "8px",
                    }}
                  />
                </td>
              </tr>

              <tr>
                <td
                  style={{
                    padding: "10px",
                    border: "1px solid #e5e7eb",
                    fontWeight: 600,
                  }}
                >
                  Nomor HP
                </td>
                <td style={{ border: "1px solid #e5e7eb", padding: "10px" }}>
                  <input
                    name="hp"
                    value={form.hp}
                    onChange={handleChange}
                    placeholder="Masukkan nomor HP"
                    style={{
                      width: "100%",
                      border: "1px solid #d1d5db",
                      borderRadius: 8,
                      padding: "8px",
                    }}
                  />
                </td>
              </tr>
            </tbody>
          </table>

          <div style={{ display: "flex", gap: 10 }}>
            <button
              type="submit"
              style={{
                background: "#2563eb",
                color: "#fff",
                border: 0,
                borderRadius: 8,
                padding: "10px 20px",
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              Tambah
            </button>
            <button
              type="button"
              onClick={() => nav(`/apo?kategori=${kategori}`)}
              style={{
                background: "#ef4444",
                color: "#fff",
                border: 0,
                borderRadius: 8,
                padding: "10px 20px",
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              Batal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Tambah;
