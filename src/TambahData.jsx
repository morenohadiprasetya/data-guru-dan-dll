 
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";

function TambahData() {
  const nav = useNavigate();
  const lokasi = useLocation();
  const [kategori, setKategori] = useState("Siswa");
  const [input, setInput] = useState({
    nama: "",
    ket: "",
    alamat: "",
    hp: "",
  });

 
  const hideSidnav = ["/", "/register"];
  const isHideSidnav = hideSidnav.includes(lokasi.pathname);

   
  useEffect(() => {
    const query = new URLSearchParams(lokasi.search);
    const kat = query.get("kategori");
    if (kat) {
      const formatted =
        kat.charAt(0).toUpperCase() + kat.slice(1).toLowerCase();
      setKategori(formatted);
    }
  }, [lokasi.search]);

  const simpan = async () => {
    if (!input.nama || !input.ket || !input.alamat || !input.hp)
      return Swal.fire("⚠️", "Isi semua kolom dulu!", "warning");

    const endpoint = `http://localhost:5000/${kategori.toLowerCase()}`;
    try {
      await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      Swal.fire("✅", "Data berhasil ditambahkan!", "success").then(() =>
        nav(`/apo?kategori=${kategori}`)
      );
    } catch {
      Swal.fire("❌", "Gagal menambahkan data!", "error");
    }
  };

  return (
    <div
      style={{
        ...s.container,
        marginLeft: isHideSidnav ? 0 : -230,  
      }}
    >
      <div style={s.card}>
        <h2 style={s.title}>Tambah Data {kategori}</h2>
        <div style={s.form}>
          <input
            placeholder="Nama"
            value={input.nama}
            onChange={(e) => setInput({ ...input, nama: e.target.value })}
            style={s.inp}
          />
          <input
            placeholder={
              kategori === "Siswa"
                ? "Kelas"
                : kategori === "Guru"
                ? "Mapel"
                : "Jabatan"
            }
            value={input.ket}
            onChange={(e) => setInput({ ...input, ket: e.target.value })}
            style={s.inp}
          />
          <input
            placeholder="Alamat"
            value={input.alamat}
            onChange={(e) => setInput({ ...input, alamat: e.target.value })}
            style={s.inp}
          />
          <input
            placeholder="Nomor HP"
            value={input.hp}
            onChange={(e) => setInput({ ...input, hp: e.target.value })}
            style={s.inp}
          />
          <button onClick={simpan} style={s.btnSave}>
            💾 Simpan
          </button>
          <button
            onClick={() => nav(`/apo?kategori=${kategori}`)}
            style={s.btnCancel}
          >
            ⬅️ Batal
          </button>
        </div>
      </div>
    </div>
  );
}

const s = {
  container: {
    background: "#f3f4f6",
    minHeight: "100vh",
    padding: "40px 20px",
    fontFamily: "Segoe UI",
    transition: "margin 0.3s ease",
  },
  card: {
    background: "#fff",
    maxWidth: 450,
    margin: "auto",
    padding: 30,
    borderRadius: 10,
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  },
  title: {
    textAlign: "center",
    marginBottom: 20,
    fontSize: 20,
    color: "#111827",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  inp: {
    padding: 10,
    borderRadius: 6,
    border: "1px solid #ccc",
    fontSize: 15,
    outline: "none",
  },
  btnSave: {
    background: "#16A34A",
    color: "#fff",
    border: "none",
    padding: 10,
    borderRadius: 6,
    cursor: "pointer",
    fontSize: 15,
    fontWeight: 600,
  },
  btnCancel: {
    background: "#EF4444",
    color: "#fff",
    border: "none",
    padding: 10,
    borderRadius: 6,
    cursor: "pointer",
    fontSize: 15,
    fontWeight: 600,
  },
};

export default TambahData;
