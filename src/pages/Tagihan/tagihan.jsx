import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faFolderOpen } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const API = "http://localhost:8080/api/tagihan";

export default function Masterdata() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  // =========================
  // FETCH DATA SQL
  // =========================
  const fetchData = async () => {
    try {
      const res = await axios.get(API);
      setData(res.data || []);
    } catch {
      Swal.fire("Error", "Gagal mengambil data tagihan", "error");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // =========================
  // FILTER SEARCH
  // =========================
  const filteredData = data.filter((x) => {
    const q = search.toLowerCase();
    return (
      x.nama?.toLowerCase().includes(q) ||
      x.kelas?.toLowerCase().includes(q) ||
      x.bulan?.toLowerCase().includes(q) ||
      x.status?.toLowerCase().includes(q) ||
      x.kategori?.toLowerCase().includes(q)
    );
  });

  // =========================
  // DELETE
  // =========================
  const handleDelete = (id) => {
    Swal.fire({
      title: "Hapus data?",
      text: "Data tidak dapat dikembalikan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Hapus",
    }).then(async (res) => {
      if (res.isConfirmed) {
        try {
          await axios.delete(`${API}/${id}`);
          Swal.fire("Berhasil", "Data terhapus", "success");
          fetchData();
        } catch {
          Swal.fire("Error", "Gagal menghapus data", "error");
        }
      }
    });
  };

  const handleEdit = (id) => {
    navigate(`/edit-tagihan/${id}`);
  };

  return (
    <div className="ml-55 mr-10 p-6">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <FontAwesomeIcon
            icon={faFolderOpen}
            className="text-yellow-600 text-3xl"
          />
          <h1 className="text-3xl font-semibold">Data Tagihan</h1>
        </div>

        <button
          onClick={() => navigate(`/garoet`)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded shadow"
        >
          + Tambah Tagihan
        </button>
      </div>

      {/* SEARCH */}
      <div className="mb-4">
        <input
          className="w-96 p-3 rounded-xl bg-gray-100 border shadow-sm"
          placeholder="🔍 Cari nama, kelas, bulan, status, kategori..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
        <div className="w-full bg-blue-600 text-white font-semibold p-3 grid grid-cols-9">
          <div className="text-center">No</div>
          <div>Nama</div>
          <div>Kelas</div>
          <div>Bulan</div>
          <div>Jumlah</div>
          <div>Dibayar</div>
          <div>Sisa</div>
          <div>Status</div>
          <div className="text-center">Aksi</div>
        </div>

        {filteredData.length === 0 && (
          <div className="p-5 text-center text-gray-500">
            Data tidak ditemukan
          </div>
        )}

        {filteredData.map((x, i) => (
          <div
            key={x.no}
            className="grid grid-cols-9 border-t p-3 items-center hover:bg-gray-50"
          >
            <div className="text-center font-semibold">{i + 1}</div>
            <div className="text-blue-700 font-medium">{x.nama}</div>
            <div>{x.kelas}</div>
            <div>{x.bulan}</div>
            <div>Rp {Number(x.jumlah).toLocaleString("id-ID")}</div>
            <div>Rp {Number(x.dibayar || 0).toLocaleString("id-ID")}</div>
            <div>Rp {Number(x.sisa || 0).toLocaleString("id-ID")}</div>
            <div
              className={`font-semibold ${
                x.status === "Lunas" ? "text-green-600" : "text-red-600"
              }`}
            >
              {x.status}
            </div>

            <div className="flex gap-2 justify-center">
              <button
                onClick={() => handleEdit(x.no)}
                className="bg-yellow-400 text-white px-3 py-2 rounded hover:bg-yellow-500"
              >
                <FontAwesomeIcon icon={faEdit} />
              </button>

              <button
                onClick={() => handleDelete(x.no)}
                className="bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700"
              >
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
