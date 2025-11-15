 import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const API = "http://localhost:5000/kelas"; // db.json → "kelas": []

export default function Kelas() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [filterKelas, setFilterKelas] = useState(""); 
  const [filterJurusan, setFilterJurusan] = useState("");

  const [form, setForm] = useState({
    namaKelas: "",
    tingkat: "",
    jurusan: "",
  });

  const [editId, setEditId] = useState(null);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      const res = await axios.get(API);
      setData(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.namaKelas || !form.tingkat || !form.jurusan) {
      Swal.fire("Gagal", "Semua field wajib diisi!", "error");
      return;
    }

    try {
      if (editId) {
        await axios.put(`${API}/${editId}`, form);
        Swal.fire("Success", "Berhasil diperbarui", "success");
      } else {
        await axios.post(API, form);
        Swal.fire("Success", "Berhasil ditambahkan", "success");
      }

      setForm({ namaKelas: "", tingkat: "", jurusan: "" });
      setEditId(null);
      getData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (item) => {
    setForm(item);
    setEditId(item.id);
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Hapus?",
      text: "Data tidak bisa dikembalikan!",
      icon: "warning",
      showCancelButton: true,
    }).then(async (res) => {
      if (res.isConfirmed) {
        await axios.delete(`${API}/${id}`);
        getData();
      }
    });
  };

  const filteredData = data.filter((item) => {
    const matchSearch =
     (item.namaKelas || "").toLowerCase().includes(search.toLowerCase());


    const matchKelas = filterKelas ? item.tingkat === filterKelas : true;

    const matchJurusan = filterJurusan ? item.jurusan === filterJurusan : true;

    return matchSearch && matchKelas && matchJurusan;
  });

  return (
    <div className="p-6 ml-50">

      <h1 className="text-2xl font-bold mb-4">Manajemen Kelas</h1>

      {/* FORM INPUT */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white p-4 shadow rounded">

        <input
          type="text"
          placeholder="Nama kelas"
          className="border p-2 rounded"
          value={form.namaKelas}
          onChange={(e) => setForm({ ...form, namaKelas: e.target.value })}
        />

        <select
          className="border p-2 rounded"
          value={form.tingkat}
          onChange={(e) => setForm({ ...form, tingkat: e.target.value })}
        >
          <option value="">Pilih Tingkat</option>
          <option value="X">X</option>
          <option value="XI">XI</option>
          <option value="XII">XII</option>
        </select>

        <select
          className="border p-2 rounded"
          value={form.jurusan}
          onChange={(e) => setForm({ ...form, jurusan: e.target.value })}
        >
          <option value="">Pilih Jurusan</option>
          <option value="TKJ">TKJ</option>
          <option value="TSM">TSM</option>
          <option value="Akutansi">Akutansi</option>
          <option value="DPB">DPB</option>
        </select>

        <button
          className="bg-blue-600 text-white p-2 rounded"
          type="submit"
        >
          {editId ? "Update" : "Tambah"}
        </button>
      </form>

      {/* FILTER */}
      <div className="flex gap-4 mt-6">
        <input
          type="text"
          placeholder="Cari kelas..."
          className="border p-2 rounded w-1/3"
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="border p-2 rounded"
          onChange={(e) => setFilterKelas(e.target.value)}
        >
          <option value="">Semua Tingkat</option>
          <option value="X">X</option>
          <option value="XI">XI</option>
          <option value="XII">XII</option>
        </select>

        <select
          className="border p-2 rounded"
          onChange={(e) => setFilterJurusan(e.target.value)}
        >
          <option value="">Semua Jurusan</option>
          <option value="TKJ">TKJ</option>
          <option value="TSM">TSM</option>
          <option value="Akutansi">Akutansi</option>
          <option value="DPB">DPB</option>
        </select>
      </div>

      {/* TABEL */}
      <table className="w-full mt-6 bg-white shadow rounded overflow-hidden">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2">Nama Kelas</th>
            <th className="p-2">Tingkat</th>
            <th className="p-2">Jurusan</th>
            <th className="p-2">Aksi</th>
          </tr>
        </thead>

        <tbody>
          {filteredData.map((x) => (
            <tr key={x.id} className="border-b">
              <td className="p-2">{x.namaKelas}</td>
              <td className="p-2">{x.tingkat}</td>
              <td className="p-2">{x.jurusan}</td>
              <td className="p-2 flex gap-2">
                <button
                  onClick={() => handleEdit(x)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(x.id)}
                  className="bg-red-600 text-white px-3 py-1 rounded"
                >
                  Hapus
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
}
