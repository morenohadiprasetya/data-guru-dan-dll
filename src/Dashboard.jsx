import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const nav = useNavigate();
  const [jumlah, setJumlah] = useState({
    siswa: 0,
    guru: 0,
    karyawan: 0,
  });

  useEffect(() => {
    const ambilData = async () => {
      try {
        const [siswa, guru, karyawan] = await Promise.all([
          fetch("http://localhost:5000/siswa").then((res) => res.json()),
          fetch("http://localhost:5000/guru").then((res) => res.json()),
          fetch("http://localhost:5000/karyawan").then((res) => res.json()),
        ]);
        setJumlah({
          siswa: siswa.length,
          guru: guru.length,
          karyawan: karyawan.length,
        });
      } catch {
        console.log("Gagal ambil data dari db.json");
      }
    };
    ambilData();
  }, []);

  return (
    <div style={s.page}>
      <h1 style={s.title}>📊 Dashboard Sekolah</h1>

      <div style={s.cards}>
        <div style={{ ...s.card, background: "#60A5FA" }}>
          <h3>👨‍🎓 Siswa</h3>
          <p style={s.jumlah}>{jumlah.siswa}</p>
          <button style={s.btn} onClick={() => nav("/apo?kategori=siswa")}>
            Lihat Data
          </button>
        </div>

        <div style={{ ...s.card, background: "#34D399" }}>
          <h3>👩‍🏫 Guru</h3>
          <p style={s.jumlah}>{jumlah.guru}</p>
          <button style={s.btn} onClick={() => nav("/apo?kategori=guru")}>
            Lihat Data
          </button>
        </div>

        <div style={{ ...s.card, background: "#FBBF24" }}>
          <h3>🏢 Karyawan</h3>
          <p style={s.jumlah}>{jumlah.karyawan}</p>
          <button style={s.btn} onClick={() => nav("/apo?kategori=karyawan")}>
            Lihat Data
          </button>
        </div>
      </div>
    </div>
  );
}

const s = {
  page: {
    fontFamily: "Segoe UI",
    background: "#f3f4f6",
    minHeight: "100vh",
    padding: 30,
  },
  title: {
    textAlign: "center",
    color: "#111827",
    marginBottom: 30,
  },
  cards: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: 20,
  },
  card: {
    color: "#fff",
    borderRadius: 12,
    padding: 20,
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    textAlign: "center",
    transition: "0.3s",
  },
  jumlah: {
    fontSize: 40,
    margin: "10px 0",
    fontWeight: "bold",
  },
  btn: {
    background: "#1E293B",
    color: "#fff",
    border: 0,
    borderRadius: 6,
    padding: "8px 12px",
    cursor: "pointer",
  },
};
