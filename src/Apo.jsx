import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

function Apo() {
  const nav = useNavigate();
  const lokasi = useLocation();

  const [kategori, setKategori] = useState("Siswa");
  const [data, setData] = useState({
    Siswa: [],
    Guru: [],
    Karyawan: [],
  });
  const [input, setInput] = useState({ nama: "", ket: "", alamat: "", hp: "" });
  const [edit, setEdit] = useState(null);

  useEffect(() => {
    const query = new URLSearchParams(lokasi.search);
    const kategoriURL = query.get("kategori");
    if (kategoriURL) {
      const formatted =
        kategoriURL.charAt(0).toUpperCase() +
        kategoriURL.slice(1).toLowerCase();
      setKategori(formatted);
    }
  }, [lokasi.search]);

  useEffect(() => {
    fetch(`http://localhost:5000/${kategori.toLowerCase()}`)
      .then((res) => res.json())
      .then((res) => setData((prev) => ({ ...prev, [kategori]: res })))
      .catch(() => console.log("Gagal ambil data dari JSON Server"));
  }, [kategori]);

  const hapus = async (i) => {
    const item = data[kategori][i];
    const endpoint = `http://localhost:5000/${kategori.toLowerCase()}`;

    Swal.fire({
      title: "Hapus data ini?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya",
      cancelButtonText: "Batal",
    }).then(async (r) => {
      if (r.isConfirmed) {
        await fetch(`${endpoint}/${item.id}`, { method: "DELETE" });
        const res = await fetch(endpoint);
        const newData = await res.json();
        setData({ ...data, [kategori]: newData });
        Swal.fire("🗑️", "Data dihapus!", "success");
      }
    });
  };

  return (
    <div style={s.page}>
      <div style={s.head}>
        <h2>📋 Data {kategori}</h2>
        <div>
          <button onClick={() => nav(`/ta`)} style={s.btnAddPage}>
            ➕ Tambah Data Baru
          </button>
          
        </div>
      </div>

      <select
        value={kategori}
        onChange={(e) => setKategori(e.target.value)}
        style={s.select}
      >
        <option>Siswa</option>
        <option>Guru</option>
        <option>Karyawan</option>
      </select>

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
        
      </div>

      <div style={s.tableContainer}>
        {data[kategori].length === 0 ? (
          <div style={s.empty}>Belum ada data</div>
        ) : (
          <table style={s.table}>
            <thead>
              <tr>
                <th style={s.th}>No</th>
                <th style={s.th}>Nama</th>
                <th style={s.th}>
                  {kategori === "Siswa"
                    ? "Kelas"
                    : kategori === "Guru"
                    ? "Mapel"
                    : "Jabatan"}
                </th>
                <th style={s.th}>Alamat</th>
                <th style={s.th}>Nomor HP</th>
                <th style={s.th}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {data[kategori].map((d, i) => (
                <tr key={i} style={s.tr}>
                  <td style={s.td}>{i + 1}</td>
                  <td style={s.td}>{d.nama}</td>
                  <td style={s.td}>{d.ket}</td>
                  <td style={s.td}>{d.alamat}</td>
                  <td style={s.td}>{d.hp}</td>
                  <td style={s.td}>
                    <button
                      onClick={() => {
                        setInput(d);
                        setEdit(i);
                      }}
                      style={s.btnEdit}
                    >
                      ✏️
                    </button>
                    <button onClick={() => hapus(i)} style={s.btnDel}>
                      🗑️
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

const s = {
  page: {
    fontFamily: "Segoe UI",
    background: "#f3f4f6",
    minHeight: "100vh",
    padding: 30,
    marginLeft: -225,
  },
  head: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  btnBack: {
    background: "#ef4444",
    color: "#fff",
    border: 0,
    borderRadius: 6,
    padding: "6px 12px",
    cursor: "pointer",
  },
  btnAddPage: {
    background: "#3B82F6",
    color: "#fff",
    border: 0,
    borderRadius: 6,
    padding: "6px 12px",
    marginRight: 8,
    cursor: "pointer",
  },
  select: {
    padding: 8,
    borderRadius: 6,
    border: "1px solid #ccc",
    margin: "15px 0",
  },
  form: { display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 15 },
  inp: {
    flex: "1 1 200px",
    padding: 8,
    border: "1px solid #ccc",
    borderRadius: 6,
  },
  tableContainer: {
    overflowX: "auto",
    background: "#fff",
    borderRadius: 8,
    padding: 10,
    boxShadow: "0 2px 50px rgba(0,0,0,0.1)",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  th: {
    border: "1px solid #ccc",
    padding: 8,
    background: "#f9fafb",
    textAlign: "left",
  },
  td: {
    border: "1px solid #ccc",
    padding: 8,
  },
  tr: {
    transition: "background 0.2s",
  },
  empty: {
    textAlign: "center",
    padding: 20,
    background: "#fff",
    borderRadius: 8,
  },
  btnEdit: {
    background: "#F59E0B",
    color: "#fff",
    border: 0,
    borderRadius: 4,
    padding: "4px 8px",
    marginRight: 20,
    cursor: "pointer",
  },
  btnDel: {
    background: "#EF4444",
    color: "#fff",
    border: 0,
    borderRadius: 4,
    padding: "4px 8px",
    cursor: "pointer",
  },
};

export default Apo;
