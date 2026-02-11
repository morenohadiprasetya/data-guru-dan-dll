import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const API = "http://localhost:8080/kelas";

export default function TambahKelas() {
  const navigate = useNavigate();

  // STATE FORM
  const [form, setForm] = useState({
    namaKelas: "",
    tingkat: "",
    jurusan: "",
  });

  // STATE LOADING SAAT SUBMIT
  const [loading, setLoading] = useState(false);

  // STATE ERROR TEXT
  const [errorText, setErrorText] = useState("");

  // GENERATE NAMA KELAS OTOMATIS
  useEffect(() => {
    if (form.tingkat && form.jurusan) {
      setForm((prev) => ({
        ...prev,
        namaKelas: `${prev.tingkat} ${prev.jurusan}`,
      }));
    }
  }, [form.tingkat, form.jurusan]);

  // HANDLE SUBMIT DATA KE JSON SERVER
  const handleSubmit = async (e) => {
    e.preventDefault();

    // VALIDASI
    if (!form.namaKelas || !form.tingkat || !form.jurusan) {
      setErrorText("Semua field wajib diisi!");
      Swal.fire("Gagal", "Semua field wajib diisi!", "error");
      return;
    }

    try {
      setLoading(true);

      await axios.post(API, form);

      Swal.fire("Berhasil", "Kelas berhasil ditambahkan!", "success");

      navigate("/kelas");
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Gagal menambahkan kelas!", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 ml-150">
      
      <h1 className="text-3xl font-semibold mb-5 text-gray-800">
        Tambah Kelas Baru
      </h1>

      
      <div className="bg-white p-6 rounded-xl shadow-lg w-full lg:w-1/2 transition-all">

       
        <form onSubmit={handleSubmit} className="space-y-5">

          
          {errorText && (
            <p className="text-red-600 bg-red-100 p-2 rounded">
              {errorText}
            </p>
          )}

       
          <div>
            <label className="font-medium text-gray-700">Tingkat</label>
            <select
              className="border p-3 rounded w-full mt-1 focus:ring-2 focus:ring-blue-400"
              value={form.tingkat}
              onChange={(e) =>
                setForm({ ...form, tingkat: e.target.value })
              }
            >
              <option value="">Pilih Tingkat</option>
              <option value="X">X</option>
              <option value="XI">XI</option>
              <option value="XII">XII</option>
            </select>
          </div>

          
          <div>
            <label className="font-medium text-gray-700">Jurusan</label>
            <select
              className="border p-3 rounded w-full mt-1 focus:ring-2 focus:ring-blue-400"
              value={form.jurusan}
              onChange={(e) =>
                setForm({ ...form, jurusan: e.target.value })
              }
            >
              <option value="">Pilih Jurusan</option>
              <option value="TKJ">TKJ</option>
              <option value="TSM">TSM</option>
              <option value="Akutansi">Akutansi</option>
              <option value="DPB">DPB</option>
            </select>
          </div>

       
          <div>
            <label className="font-medium text-gray-700">Nama Kelas</label>
            <input
              type="text"
              placeholder="Nama kelas"
              className="border p-3 rounded w-full mt-1 focus:ring-2 focus:ring-blue-400"
              value={form.namaKelas}
              onChange={(e) =>
                setForm({ ...form, namaKelas: e.target.value })
              }
            />
            <p className="text-gray-500 text-sm mt-1">
              Nama kelas akan otomatis terisi dari tingkat + jurusan.
            </p>
          </div>
 
          <div className="flex gap-4 pt-3">

            <button
              className={`px-5 py-2 rounded text-white ${
                loading
                  ? "bg-blue-400"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
              type="submit"
              disabled={loading}
            >
              {loading ? "Menyimpan..." : "Simpan"}
            </button>

            <button
              onClick={() => navigate("/kelas")}
              type="button"
              className="px-5 py-2 rounded bg-gray-500 hover:bg-gray-600 text-white"
            >
              Kembali
            </button>

          </div>
        </form>
      </div>
    </div>
  );
}
