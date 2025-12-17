import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import {
  ArrowPathIcon,
  MagnifyingGlassIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";

const API_PRESENSI = "http://localhost:5000/presensi";

// ================= HELPER =================
function formatJam(val) {
  if (!val) return "-";
  try {
    const d = new Date(val);
    if (isNaN(d.getTime())) return "-";
    return d.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "-";
  }
}

function tampilKategori(x) {
  if (x.kategori === "izin") return "Izin";
  if (x.kategori === "sakit") return "Sakit";
  if (x.kategori === "hadir" && x.pulang) return "Hadir (Pulang)";
  if (x.kategori === "hadir") return "Hadir";
  return "-";
}

// ================= COMPONENT =================
export default function RekapPresensi() {
  const navigate = useNavigate();

  const [rekap, setRekap] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tanggal, setTanggal] = useState(new Date().toISOString().slice(0, 10));
  const [kategori, setKategori] = useState("all");
  const [cari, setCari] = useState("");
  const [page, setPage] = useState(1);
  const [rowOpen, setRowOpen] = useState(null);
  const limit = 10;

  useEffect(() => {
    ambilRekap();
    setPage(1);
  }, [tanggal, kategori]);

  // ================= AMBIL DATA =================
  async function ambilRekap() {
    setLoading(true);
    try {
      const r = await axios.get(API_PRESENSI, { params: { tanggal } });
      let data = Array.isArray(r.data) ? r.data : [];

      if (kategori !== "all") {
        data = data.filter((x) => {
          if (kategori === "pulang") return !!x.pulang;
          return x.kategori === kategori;
        });
      }

      setRekap(data);
    } catch (err) {
      Swal.fire("Error", "Gagal memuat data presensi", "error");
    } finally {
      setLoading(false);
    }
  }

  // ================= AKSI =================
  function handleEdit(id) {
    navigate(`/presensi/edit/${id}`);
  }

  async function handleHapus(id) {
    const confirm = await Swal.fire({
      title: "Hapus data?",
      text: "Data presensi ini akan dihapus permanen",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus",
      cancelButtonText: "Batal",
    });

    if (!confirm.isConfirmed) return;

    try {
      await axios.delete(`${API_PRESENSI}/${id}`);
      Swal.fire("Berhasil", "Data berhasil dihapus", "success");
      ambilRekap();
    } catch {
      Swal.fire("Error", "Gagal menghapus data", "error");
    }
  }

  // ================= FILTER SEARCH =================
  const dataFiltered = rekap.filter((x) =>
    x.nama?.toLowerCase().includes(cari.toLowerCase())
  );

  const mulai = (page - 1) * limit;
  const tampil = dataFiltered.slice(mulai, mulai + limit);

  // ================= UI =================
  return (
    <div className="p-6 max-w-6xl bg-gray-100 min-h-screen ml-60 rounded-lg shadow-md">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-blue-700">Rekap Presensi</h1>
        <button
          onClick={ambilRekap}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded"
        >
          <ArrowPathIcon className="w-5" />
          Refresh
        </button>
      </div>

      {/* FILTER */}
      <div className="grid grid-cols-3 gap-4 bg-white p-4 rounded shadow-sm mb-4">
        <input type="date" className="border p-2 rounded"
          value={tanggal} onChange={(e) => setTanggal(e.target.value)} />

        <select className="border p-2 rounded"
          value={kategori} onChange={(e) => setKategori(e.target.value)}>
          <option value="all">Semua</option>
          <option value="hadir">Hadir</option>
          <option value="pulang">Pulang</option>
          <option value="izin">Izin</option>
          <option value="sakit">Sakit</option>
        </select>

        <input className="border p-2 rounded"
          placeholder="Cari nama..."
          value={cari} onChange={(e) => setCari(e.target.value)} />
      </div>

      {/* TABEL */}
      <div className="bg-white rounded shadow overflow-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-blue-100">
            <tr>
              <th className="border p-2">Nama</th>
              <th className="border p-2">Kelas</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Masuk</th>
              <th className="border p-2">Pulang</th>
              <th className="border p-2">Aksi</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr><td colSpan="6" className="p-4 text-center">Loading...</td></tr>
            ) : tampil.map((x) => (
              <React.Fragment key={x.id}>
                <tr className="hover:bg-gray-50">
                  <td className="border p-2">{x.nama}</td>
                  <td className="border p-2">{x.kelas || "-"}</td>
                  <td className="border p-2">{tampilKategori(x)}</td>
                  <td className="border p-2">{formatJam(x.masuk)}</td>
                  <td className="border p-2">{formatJam(x.pulang)}</td>

                  <td className="border p-2 flex gap-2 justify-center">
                    <button
                      onClick={() => handleEdit(x.id)}
                      className="bg-yellow-500 p-2 rounded text-white">
                      <PencilSquareIcon className="w-4" />
                    </button>
                    <button
                      onClick={() => handleHapus(x.id)}
                      className="bg-red-600 p-2 rounded text-white">
                      <TrashIcon className="w-4" />
                    </button>
                  </td>
                </tr>

                {rowOpen === x.id && x.kategori === "izin" && (
                  <tr className="bg-blue-50">
                    <td colSpan="6" className="p-3">
                      <b>Keterangan Izin:</b><br />
                      {x.keteranganIzin || "-"}
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
