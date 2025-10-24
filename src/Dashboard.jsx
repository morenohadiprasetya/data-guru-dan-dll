import React, { useEffect, useState } from "react";

function Dashboard() {
  const [siswa, setSiswa] = useState([]);
  const [guru, setGuru] = useState([]);
  const [karyawan, setKaryawan] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [resSiswa, resGuru, resKaryawan] = await Promise.all([
          fetch("http://localhost:5000/siswa").then((r) => r.json()),
          fetch("http://localhost:5000/guru").then((r) => r.json()),
          fetch("http://localhost:5000/karyawan").then((r) => r.json()),
        ]);

        setSiswa(resSiswa);
        setGuru(resGuru);
        setKaryawan(resKaryawan);
      } catch (err) {
        console.error("Gagal mengambil data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: 30 }}>
        <h3>⏳ Memuat data...</h3>
      </div>
    );
  }

  const semuaData = [
    ...siswa.map((item) => ({ ...item, kategori: "Siswa" })),
    ...guru.map((item) => ({ ...item, kategori: "Guru" })),
    ...karyawan.map((item) => ({ ...item, kategori: "Karyawan" })),
  ];

  return (
    <div
      style={{
        marginLeft: -200,
        padding: "2px 20px 9px 2px",  
        fontFamily: "Segoe UI",
        width: "115%",
        height: "100vh",
        boxSizing: "border-box",
        overflowY: "auto",
        backgroundColor: "#f9fafb",
      }}
    >
      <h2 style={{ marginBottom: 25, color: "#1f2937" }}>📊 Dashboard Sekolah</h2>

     
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: 20,
          marginBottom: 30,
          marginRight: 10,
        }}
      >
        <div style={cardStyle("#3b82f6")}>
          <h3>👨‍🎓 Siswa</h3>
          <h1>{siswa.length}</h1>
        </div>
        <div style={cardStyle("#10b981")}>
          <h3>👩‍🏫 Guru</h3>
          <h1>{guru.length}</h1>
        </div>
        <div style={cardStyle("#f59e0b")}>
          <h3>🏢 Karyawan</h3>
          <h1>{karyawan.length}</h1>
        </div>
      </div>

     
      <div
        style={{
          background: "#fff",
          borderRadius: 12,
          boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
          padding: 20,
          width: "100%",
          overflowX: "auto",
          marginRight: 10,
        }}
      >
        <h3 style={{ marginBottom: 15 }}>📋 Semua Data</h3>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: 15,
          }}
        >
          <thead>
            <tr
              style={{
                background: "#f3f4f6",
                textAlign: "left",
              }}
            >
              <th style={thTd}>No</th>
              <th style={thTd}>Kategori</th>
              <th style={thTd}>Nama</th>
              <th style={thTd}>Keterangan</th>
              <th style={thTd}>Alamat</th>
              <th style={thTd}>No HP</th>
            </tr>
          </thead>
          <tbody>
            {semuaData.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: "center", padding: 20 }}>
                  Tidak ada data.
                </td>
              </tr>
            ) : (
              semuaData.map((d, i) => (
                <tr key={i} style={{ borderBottom: "1px solid #e5e7eb" }}>
                  <td style={thTd}>{i + 1}</td>
                  <td style={thTd}>{d.kategori}</td>
                  <td style={thTd}>{d.nama}</td>
                  <td style={thTd}>{d.ket}</td>
                  <td style={thTd}>{d.alamat}</td>
                  <td style={thTd}>{d.hp}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const cardStyle = (color) => ({
  background: color,
  color: "#fff",
  padding: "20px",
  borderRadius: 12,
  textAlign: "center",
  boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
});

const thTd = {
  padding: "10px 12px",
};

export default Dashboard;
