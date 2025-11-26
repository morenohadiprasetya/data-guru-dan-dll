import React, { useEffect, useState } from "react";

export default function Dashboard() {
  const [kelas, setKelas] = useState([]);
  const [siswa, setSiswa] = useState([]);
  const [guru, setGuru] = useState([]);
  const [karyawan, setKaryawan] = useState([]);
  const [tagihan, setTagihan] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const kelasData = [
          { id: 1, nama: "10A" },
          { id: 2, nama: "11B" }
        ];
        const siswaData = [
          { id: "s1", nama: "Andi", kelas: "10A", alamat: "Jakarta", hp: "081234" },
          { id: "s2", nama: "Budi", kelas: "11B", alamat: "Bandung", hp: "081235" }
        ];
        const guruData = [{ id: "g1", nama: "Pak Joko", mapel: "Matematika" }];
        const karyawanData = [{ id: "k1", nama: "Ibu Ani", jabatan: "TU" }];
        const tagihanData = [
          { id: "t1", siswa: "Andi", kategori: "SPP", jumlah: 500000, status: "Lunas" },
          { id: "t2", siswa: "Budi", kategori: "Ujian", jumlah: 200000, status: "Belum Lunas" }
        ];

        setKelas(kelasData);
        setSiswa(siswaData);
        setGuru(guruData);
        setKaryawan(karyawanData);
        setTagihan(tagihanData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div style={{ padding: 50, fontSize: 22 }}>Loading...</div>;

  // Ringkasan tagihan
  const summaryTagihan = tagihan.reduce(
    (acc, t) => {
      acc.total += t.jumlah;
      if (t.status === "Lunas") acc.lunas += t.jumlah;
      else acc.sisa += t.jumlah;
      return acc;
    },
    { total: 0, lunas: 0, sisa: 0 }
  );

  const filteredSiswa = siswa.filter((s) =>
    s.nama.toLowerCase().includes(search.toLowerCase())
  );

  const formatRp = (n) => "Rp " + n.toLocaleString();

  // Styles
  const cardStyle = (bg) => ({
    background: bg,
    color: "white",
    padding: 25,
    borderRadius: 15,
    flex: 1,
    textAlign: "center",
    boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
    transition: "transform 0.3s, box-shadow 0.3s",
    cursor: "default",
  });

  const cardContainer = { display: "flex", gap: 20, marginBottom: 30, flexWrap: "wrap" };

  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
    borderRadius: 10,
    overflow: "hidden",
    boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
    background: "white",
  };

  const thStyle = {
    borderBottom: "2px solid #ddd",
    padding: 14,
    background: "#f0f0f0",
    textAlign: "left",
    color: "#333",
    fontWeight: "600",
  };

  const tdStyle = {
    borderBottom: "1px solid #eee",
    padding: 12,
    color: "#555",
  };

  const containerStyle = {
    padding: "40px 50px",
    fontFamily: "Segoe UI, sans-serif",
    background: "#e6ebf2",
    minHeight: "100vh",
  };

  const statusStyle = (status) => ({
    color: status === "Lunas" ? "#2e7d32" : "#d32f2f",
    fontWeight: "bold",
  });

  return (
    <div style={containerStyle}>
      <h1 style={{ fontSize: 36, marginBottom: 35, color: "#333" }}>Dashboard Sekolah</h1>

      {/* Ringkasan */}
      <div style={cardContainer}>
        <div style={cardStyle("linear-gradient(135deg, #43e97b, #38f9d7)")}>
          <div>Kelas</div>
          <div style={{ fontSize: 28, fontWeight: "bold" }}>{kelas.length}</div>
        </div>
        <div style={cardStyle("linear-gradient(135deg, #36d1dc, #5b86e5)")}>
          <div>Siswa</div>
          <div style={{ fontSize: 28, fontWeight: "bold" }}>{siswa.length}</div>
        </div>
        <div style={cardStyle("linear-gradient(135deg, #ff9a9e, #fad0c4)")}>
          <div>Guru</div>
          <div style={{ fontSize: 28, fontWeight: "bold" }}>{guru.length}</div>
        </div>
        <div style={cardStyle("linear-gradient(135deg, #f6d365, #fda085)")}>
          <div>Karyawan</div>
          <div style={{ fontSize: 28, fontWeight: "bold" }}>{karyawan.length}</div>
        </div>
      </div>

      {/* Ringkasan Tagihan */}
      <div style={cardContainer}>
        <div style={cardStyle("linear-gradient(135deg, #a18cd1, #fbc2eb)")}>
          <div>Total Tagihan</div>
          <div style={{ fontSize: 22, fontWeight: "bold" }}>{formatRp(summaryTagihan.total)}</div>
        </div>
        <div style={cardStyle("linear-gradient(135deg, #43cea2, #185a9d)")}>
          <div>Lunas</div>
          <div style={{ fontSize: 22, fontWeight: "bold" }}>{formatRp(summaryTagihan.lunas)}</div>
        </div>
        <div style={cardStyle("linear-gradient(135deg, #f857a6, #ff5858)")}>
          <div>Sisa</div>
          <div style={{ fontSize: 22, fontWeight: "bold" }}>{formatRp(summaryTagihan.sisa)}</div>
        </div>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Cari siswa..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          padding: 16,
          width: "100%",
          borderRadius: 12,
          border: "1px solid #ccc",
          marginBottom: 30,
          fontSize: 16,
          outline: "none",
        }}
      />

      {/* Table Siswa */}
      <h2 style={{ marginBottom: 15, color: "#444" }}>Daftar Siswa</h2>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>ID</th>
            <th style={thStyle}>Nama</th>
            <th style={thStyle}>Kelas</th>
            <th style={thStyle}>Alamat</th>
            <th style={thStyle}>HP</th>
          </tr>
        </thead>
        <tbody>
          {filteredSiswa.map((s, idx) => (
            <tr
              key={s.id}
              style={{
                cursor: "pointer",
                background: idx % 2 === 0 ? "#fff" : "#f9f9f9",
                transition: "background 0.3s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#e0f7fa")}
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = idx % 2 === 0 ? "#fff" : "#f9f9f9")
              }
            >
              <td style={tdStyle}>{s.id}</td>
              <td style={tdStyle}>{s.nama}</td>
              <td style={tdStyle}>{s.kelas}</td>
              <td style={tdStyle}>{s.alamat}</td>
              <td style={tdStyle}>{s.hp}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Table Tagihan */}
      <h2 style={{ margin: "30px 0 15px 0", color: "#444" }}>Daftar Tagihan</h2>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>ID</th>
            <th style={thStyle}>Siswa</th>
            <th style={thStyle}>Kategori</th>
            <th style={thStyle}>Jumlah</th>
            <th style={thStyle}>Status</th>
          </tr>
        </thead>
        <tbody>
          {tagihan.map((t, idx) => (
            <tr
              key={t.id}
              style={{
                cursor: "pointer",
                background: idx % 2 === 0 ? "#fff" : "#f9f9f9",
                transition: "background 0.3s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#e0f7fa")}
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = idx % 2 === 0 ? "#fff" : "#f9f9f9")
              }
            >
              <td style={tdStyle}>{t.id}</td>
              <td style={tdStyle}>{t.siswa}</td>
              <td style={tdStyle}>{t.kategori}</td>
              <td style={tdStyle}>{formatRp(t.jumlah)}</td>
              <td style={{ ...tdStyle, ...statusStyle(t.status) }}>{t.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
