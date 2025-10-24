import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

function Apo() {
  const nav = useNavigate();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const kategori = query.get("kategori") || "Siswa";

  const [data, setData] = useState({
    Siswa: [],
    Guru: [],
    Karyawan: [],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData(kategori);
    console.log("Kategori aktif:", kategori);
  }, [kategori]);

  const fetchData = async (kat) => {
    try {
      setLoading(true);
      const res = await fetch(`http://localhost:5000/${kat.toLowerCase()}`);
      if (!res.ok) throw new Error("Gagal ambil data dari server");
      const hasil = await res.json();
      setData((prev) => ({ ...prev, [kat]: hasil }));
    } catch (error) {
      console.error("Gagal ambil data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleHapus = async (id) => {
    const konfirmasi = await Swal.fire({
      title: "Yakin ingin menghapus?",
      text: "Data akan dihapus permanen.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus",
      cancelButtonText: "Batal",
    });

    if (konfirmasi.isConfirmed) {
      try {
        const res = await fetch(
          `http://localhost:5000/${kategori.toLowerCase()}/${id}`,
          {
            method: "DELETE",
          }
        );
        if (!res.ok) throw new Error("Gagal menghapus");
        Swal.fire("Terhapus!", "Data berhasil dihapus", "success");
        fetchData(kategori);
      } catch (err) {
        console.error(err);
        Swal.fire("Gagal", "Tidak dapat menghapus data", "error");
      }
    }
  };

  return (
    <div
  style={{
    marginLeft: -220,
    marginRight: 22,
    width: "calc(100% + 220px)",
    minHeight: "10vh",
    padding: "20px 1px",
    backgroundColor: "#f9fafb",
    boxSizing: "border-box",
  }}
>
  
      <div
        style={{
          background: "#fff",
          borderRadius: 12,
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          padding: 25,
          border: "1px solid #e5e7eb",
        }}
      >
       
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <h2 style={{ color: "#1f2937" }}>📋 Data {kategori}</h2>

         
          <button
            onClick={() => nav(`/Ta?kategori=${kategori}`)}
            style={{
              background: "#2563eb",
              color: "#fff",
              border: 0,
              borderRadius: 8,
              padding: "10px 16px",
              fontWeight: 600,
              cursor: "pointer",
              transition: "0.2s",
            }}
            onMouseOver={(e) => (e.target.style.background = "#1d4ed8")}
            onMouseOut={(e) => (e.target.style.background = "#2563eb")}
          >
            + Tambah Data
          </button>
        </div>

      
        <div style={{ marginBottom: 20 }}>
          <label style={{ fontWeight: 600, marginRight: 8 }}>Kategori:</label>
          <select
            value={kategori}
            onChange={(e) => nav(`/apo?kategori=${e.target.value}`)}
            style={{
              padding: "8px 10px",
              borderRadius: 8,
              border: "1px solid #d1d5db",
              outline: "none",
            }}
          >
            <option value="Siswa">Siswa</option>
            <option value="Guru">Guru</option>
            <option value="Karyawan">Karyawan</option>
          </select>
        </div>

         
        {loading ? (
          <p>Sedang memuat data...</p>
        ) : (
          <div style={{ overflowX: "auto", borderRadius: 8 }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                border: "1px solid #e5e7eb",
              }}
            >
              <thead>
                <tr style={{ background: "#f3f4f6", textAlign: "left" }}>
                  <th style={thStyle}>No</th>
                  <th style={thStyle}>Nama</th>
                  <th style={thStyle}>
                    {kategori === "Siswa"
                      ? "Kelas"
                      : kategori === "Guru"
                      ? "Mapel"
                      : "Jabatan"}
                  </th>
                  <th style={thStyle}>Alamat</th>
                  <th style={thStyle}>No. HP</th>
                  <th style={thStyle}>Aksi</th>
                </tr>
              </thead>

              <tbody>
                {!data[kategori] || data[kategori].length === 0 ? (
                  <tr>
                    <td
                      colSpan="6"
                      style={{
                        textAlign: "center",
                        padding: 20,
                        border: "1px solid #e5e7eb",
                        color: "#6b7280",
                      }}
                    >
                      Tidak ada data.
                    </td>
                  </tr>
                ) : (
                  data[kategori].map((item, index) => (
                    <tr
                      key={item.id ?? index}
                      style={{
                        borderBottom: "1px solid #e5e7eb",
                        background:
                          index % 2 === 0 ? "#ffffff" : "#f9fafb",
                      }}
                    >
                      <td style={tdStyle}>{index + 1}</td>
                      <td style={tdStyle}>{item.nama}</td>
                      <td style={tdStyle}>{item.ket}</td>
                      <td style={tdStyle}>{item.alamat}</td>
                      <td style={tdStyle}>{item.hp}</td>
                      <td style={{ ...tdStyle, textAlign: "center" }}>
                        <button
                          onClick={() =>
                            nav(`/edit?id=${item.id}&kategori=${kategori}`)
                          }
                          style={btnEdit}
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleHapus(item.id)}
                          style={btnHapus}
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
 
        <div style={{ marginTop: 20, textAlign: "center" }}>
          <Link
            to="/s"
            style={{
              marginRight: 1200,
              background: "#ffffffff",
              color: "#fff",
              padding: "8px 14px",
              borderRadius: 8,
              textDecoration: "none",
              fontWeight: 500,
            }}
          >
            amba
          </Link>
        </div>
      </div>
    </div>
  );
}

const thStyle = {
  border: "1px solid #e5e7eb",
  padding: "12px 10px",
  fontWeight: "600",
  color: "#374151",
};

const tdStyle = {
  border: "1px solid #e5e7eb",
  padding: "10px 10px",
  color: "#1f2937",
};

const btnEdit = {
  background: "#fbbf24",
  border: 0,
  borderRadius: 6,
  padding: "6px 10px",
  marginRight: 6,
  cursor: "pointer",
};

const btnHapus = {
  background: "#ef4444",
  border: 0,
  borderRadius: 6,
  padding: "6px 10px",
  color: "#fff",
  cursor: "pointer",
};

export default Apo;
