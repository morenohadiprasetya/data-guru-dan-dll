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

  const tambah = async () => {
    if (!input.nama || !input.ket || !input.alamat || !input.hp)
      return Swal.fire("⚠️", "Isi semua kolom dulu!", "warning");

    const endpoint = `http://localhost:5000/${kategori.toLowerCase()}`;

    try {
      if (edit !== null) {
        const item = data[kategori][edit];
        await fetch(`${endpoint}/${item.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(input),
        });
        Swal.fire("✅", "Data diubah!", "success");
      } else {
        await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(input),
        });
        Swal.fire("✅", "Data ditambah!", "success");
      }

      const res = await fetch(endpoint);
      const newData = await res.json();
      setData({ ...data, [kategori]: newData });
      setInput({ nama: "", ket: "", alamat: "", hp: "" });
      setEdit(null);
    } catch (err) {
      console.error(err);
      Swal.fire("❌", "Gagal menyimpan ke db.json", "error");
    }
  };

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
        <button onClick={() => nav("/dash")} style={s.btnBack}>
          ⬅️ Kembali
        </button>
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
        <button onClick={tambah} style={s.btnAdd}>
          {edit !== null ? "💾 Simpan" : "➕ Tambah"}
        </button>
      </div>

      <div style={s.list}>
        {data[kategori].length === 0 ? (
          <div style={s.empty}>Belum ada data</div>
        ) : (
          data[kategori].map((d, i) => (
            <div key={i} style={s.card}>
              <div>
                <b>{d.nama}</b>
                <p style={{ margin: 0, color: "#555" }}>{d.ket}</p>
                <p style={{ margin: 0, color: "#555" }}>🏠 {d.alamat}</p>
                <p style={{ margin: 0, color: "#555" }}>📞 {d.hp}</p>
              </div>
              <div>
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
              </div>
            </div>
          ))
        )}
      </div>
       <button
              type="button"
              onClick={() => navigate("/s")}
              className="text-blue-600 underline hover:text-blue-800"
            >
              Daftar
            </button>
    </div>
    
  );
}

const s = {
  page: {
    fontFamily: "Segoe UI",
    padding: 30,
    background: "#f3f4f6",
    minHeight: "100vh",
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
  btnAdd: {
    background: "#16A34A",
    color: "#fff",
    border: 0,
    borderRadius: 6,
    padding: "8px 14px",
    cursor: "pointer",
  },
  list: { display: "flex", flexDirection: "column", gap: 8 },
  card: {
    background: "#fff",
    borderRadius: 8,
    padding: 10,
    display: "flex",
    justifyContent: "space-between",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
  },
  btnEdit: {
    background: "#F59E0B",
    color: "#fff",
    border: 0,
    borderRadius: 4,
    padding: "4px 8px",
    marginRight: 5,
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
  empty: {
    textAlign: "center",
    padding: 20,
    background: "#fff",
    borderRadius: 8,
  },
};

export default Apo;
