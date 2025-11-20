import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const API = "http://localhost:5000/kelas";

export default function Kelas() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [filterKelas, setFilterKelas] = useState("");
  const [filterJurusan, setFilterJurusan] = useState("");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      setLoading(true);
      const res = await axios.get(API);
      setData(res.data);
    } catch (err) {
      Swal.fire("Error", "Gagal memuat data kelas", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Hapus kelas?",
      text: "Data tidak bisa dikembalikan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, hapus!"
    }).then(async (res) => {
      if (res.isConfirmed) {
        try {
          await axios.delete(`${API}/${id}`);
          Swal.fire("Terhapus", "Kelas berhasil dihapus", "success");
          getData();
        } catch {
          Swal.fire("Error", "Gagal menghapus data", "error");
        }
      }
    });
  };

  const filteredData = data.filter((x) => {
    const s = search.toLowerCase();
    const matchSearch = x.namaKelas.toLowerCase().includes(s);
    const matchKelas = filterKelas ? x.tingkat === filterKelas : true;
    const matchJurusan = filterJurusan ? x.jurusan === filterJurusan : true;
    return matchSearch && matchKelas && matchJurusan;
  });

  return (
    <div className="p-6 ml-55 min-h-screen bg-gray-50">
      
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-extrabold text-blue-700 flex items-center gap-2">
          🏫 Manajemen Kelas
        </h1>

        <button
          onClick={() => navigate("/tkelas")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded shadow active:scale-95 transition"
        >
          + Tambah Kelas
        </button>
      </div>

      {/* FILTER CARD */}
      <div className="bg-white border border-blue-100 shadow-md p-5 rounded-2xl mb-6">
        <div className="flex flex-wrap gap-4 items-center">

          <input
            type="text"
            placeholder="🔍 Cari nama kelas..."
            className="border border-gray-400 p-2 rounded-lg w-full md:w-1/3"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            className="border border-gray-400 p-2 rounded-lg"
            onChange={(e) => setFilterKelas(e.target.value)}
            value={filterKelas}
          >
            <option value="">Semua Tingkat</option>
            <option value="X">X</option>
            <option value="XI">XI</option>
            <option value="XII">XII</option>
          </select>

          <select
            className="border border-gray-400 p-2 rounded-lg"
            onChange={(e) => setFilterJurusan(e.target.value)}
            value={filterJurusan}
          >
            <option value="">Semua Jurusan</option>
            <option value="TKJ">TKJ</option>
            <option value="TSM">TSM</option>
            <option value="Akutansi">Akutansi</option>
            <option value="DPB">DPB</option>
          </select>

          
        </div>
      </div>

      {/* LOADING */}
      {loading && (
        <p className="text-center py-4 text-gray-500">⏳ Memuat data kelas...</p>
      )}

      {/* NO DATA */}
      {!loading && filteredData.length === 0 && (
        <p className="text-center bg-yellow-100 border border-yellow-300 py-3 rounded text-yellow-800">
          Tidak ada data kelas ditemukan.
        </p>
      )}

      {/* TABLE */}
      {!loading && filteredData.length > 0 && (
        <div className="overflow-hidden rounded-2xl shadow-xl border border-gray-300">
          <table className="w-full bg-white border-collapse">

            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="p-3 text-left">Nama Kelas</th>
                <th className="p-3 text-left">Tingkat</th>
                <th className="p-3 text-left">Jurusan</th>
                <th className="p-3 text-center">Aksi</th>
              </tr>
            </thead>

            <tbody>
              {filteredData.map((item) => (
                <tr key={item.id} className="hover:bg-blue-50 transition">
                  <td className="p-3 border-t">{item.namaKelas}</td>
                  <td className="p-3 border-t">{item.tingkat}</td>
                  <td className="p-3 border-t">{item.jurusan}</td>

                  <td className="p-3 border-t text-center flex justify-center gap-3">

                    {/* Edit */}
                    <button
                      onClick={() => navigate(`/brngn/${item.id}`)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-1 rounded shadow transition"
                    >
                      ✏ Edit
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded shadow transition"
                    >
                      🗑 Hapus
                    </button>

                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      )}

      {!loading && (
        <p className="text-gray-700 mt-3">
          Total: <b>{filteredData.length}</b> kelas ditampilkan
        </p>
      )}
    </div>
  );
}
