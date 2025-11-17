import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate, useParams } from "react-router-dom";

export default function Editkategoridata() {
  const { id } = useParams();
  const navigate = useNavigate();
  const API = "http://localhost:5000/kategoridata";

  const [data, setData] = useState({
    nama: "",
    ket: "",
    alamat: "",
    hp: ""
  });

  useEffect(() => {
    axios.get(`${API}/${id}`)
      .then(res => {
        if (!res.data) {
          Swal.fire("Error", "Data tidak ditemukan", "error");
          navigate("/kategori-data");
          return;
        }
        setData(res.data);
      })
      .catch(() => {
        Swal.fire("Error", "Data tidak ditemukan", "error");
        navigate("/kategori-data");
      });
  }, [id, navigate]);

  const submit = async (e) => {
    e.preventDefault();

    if (!data.nama.trim()) {
      return Swal.fire("Nama wajib diisi", "", "warning");
    }

    try {
      await axios.put(`${API}/${id}`, data);
      Swal.fire("Berhasil", "Data diperbarui", "success")
        .then(() => navigate("/kategoril"));
    } catch {
      Swal.fire("Error", "Gagal menyimpan", "error");
    }
  };

  return (
    <div className="p-6 ml-48">
      <h2 className="text-2xl font-bold mb-4">Edit Kategori Data</h2>

      <form onSubmit={submit} className="bg-white p-4 rounded shadow w-96">
        <label>Nama</label>
        <input
          value={data.nama}
          onChange={(e) => setData({ ...data, nama: e.target.value })}
          className="border p-2 w-full mb-3"
        />

        <label>Keterangan</label>
        <input
          value={data.ket}
          onChange={(e) => setData({ ...data, ket: e.target.value })}
          className="border p-2 w-full mb-3"
        />

        <label>Alamat</label>
        <input
          value={data.alamat}
          onChange={(e) => setData({ ...data, alamat: e.target.value })}
          className="border p-2 w-full mb-3"
        />

        <label>HP</label>
        <input
          value={data.hp}
          onChange={(e) => setData({ ...data, hp: e.target.value })}
          className="border p-2 w-full mb-3"
        />

        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          Simpan
        </button>

        <button
          className="ml-2 px-4 py-2 border rounded"
          onClick={() => navigate("/kategoril")}
          type="button"
        >
          Batal
        </button>
      </form>
    </div>
  );
}
