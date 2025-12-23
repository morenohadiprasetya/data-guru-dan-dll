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

/* ================= HELPER ================= */
function formatJam(val) {
  if (!val) return "-";
  const d = new Date(val);
  if (isNaN(d.getTime())) return "-";
  return d.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

// CEK TERLAMBAT (> 06:50)
function isTerlambat(val) {
  if (!val) return false;

  const masuk = new Date(val);
  if (isNaN(masuk.getTime())) return false;

  const batas = new Date(val);
  batas.setHours(6, 50, 0, 0);

  return masuk > batas;
}

/* ================= BADGE STATUS ================= */
function BadgeStatus({ data }) {
  let text = "-";
  let color = "bg-gray-300 text-gray-700";
  let clickable = false;

  const terlambat =
    data.kategori === "hadir" && isTerlambat(data.masuk);

  if (data.kategori === "izin") {
    text = "Izin";
    color = "bg-yellow-100 text-yellow-700";
    clickable = true;
  } else if (data.kategori === "sakit") {
    text = "Sakit";
    color = "bg-red-100 text-red-700";
    clickable = true;
  } else if (data.kategori === "hadir" && data.pulang) {
    text = terlambat
      ? "Hadir (Terlambat, Pulang)"
      : "Hadir (Pulang)";
    color = terlambat
      ? "bg-orange-100 text-orange-700"
      : "bg-green-100 text-green-700";
  } else if (data.kategori === "hadir") {
    text = terlambat ? "Hadir (Terlambat)" : "Hadir";
    color = terlambat
      ? "bg-orange-100 text-orange-700"
      : "bg-blue-100 text-blue-700";
  }

  const handleClick = () => {
    if (!clickable) return;
    Swal.fire({
      title: `Keterangan ${text}`,
      text: data.keteranganIzin || "-",
      icon: "info",
      confirmButtonText: "Tutup",
    });
  };

  return (
    <span
      onClick={handleClick}
      className={`px-3 py-1 rounded-full text-xs font-semibold
        ${color}
        ${clickable ? "cursor-pointer hover:opacity-80" : ""}
      `}
    >
      {text}
    </span>
  );
}

/* ================= COMPONENT ================= */
export default function RekapPresensi() {
  const navigate = useNavigate();

  const [rekap, setRekap] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tanggal, setTanggal] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [kategori, setKategori] = useState("all");
  const [cari, setCari] = useState("");

  /* ===== JAM WIB REALTIME ===== */
  const [jamWIB, setJamWIB] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setJamWIB(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    ambilRekap();
  }, [tanggal, kategori]);

  /* ================= AMBIL DATA ================= */
  async function ambilRekap() {
    setLoading(true);
    try {
      const r = await axios.get(API_PRESENSI, {
        params: { tanggal },
      });

      let data = Array.isArray(r.data) ? r.data : [];

      // FILTER STATUS (HADIR = termasuk TERLAMBAT)
      if (kategori !== "all") {
        data = data.filter((x) => {
          if (kategori === "hadir")
            return x.kategori === "hadir";
          if (kategori === "pulang") return !!x.pulang;
          return x.kategori === kategori;
        });
      }

      setRekap(data);
    } catch {
      Swal.fire("Error", "Gagal memuat data presensi", "error");
    } finally {
      setLoading(false);
    }
  }

  /* ================= HAPUS DATA ================= */
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

  /* ================= SEARCH ================= */
  const dataFiltered = rekap.filter((x) =>
    x.nama?.toLowerCase().includes(cari.toLowerCase())
  );

  /* ================= UI ================= */
  return (
    <div className="p-6 ml-10 min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-blue-700">
            Rekap Presensi
          </h1>
          <p className="text-sm text-gray-600">
            {jamWIB.toLocaleDateString("id-ID", {
              weekday: "long",
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}{" "}
            —{" "}
            <span className="font-semibold">
              {jamWIB.toLocaleTimeString("id-ID", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })}{" "}
              WIB
            </span>
          </p>
        </div>

        <button
          onClick={ambilRekap}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow"
        >
          <ArrowPathIcon className="w-5" /> Refresh
        </button>
      </div>

      {/* FILTER */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white p-4 rounded-xl shadow mb-6">
        <input
          type="date"
          className="border rounded-lg p-2"
          value={tanggal}
          onChange={(e) => setTanggal(e.target.value)}
        />

        <select
          className="border rounded-lg p-2"
          value={kategori}
          onChange={(e) => setKategori(e.target.value)}
        >
          <option value="all">Semua Status</option>
          <option value="hadir">Hadir</option>
          <option value="pulang">Pulang</option>
          <option value="izin">Izin</option>
          <option value="sakit">Sakit</option>
        </select>

        <div className="relative">
          <MagnifyingGlassIcon className="w-5 absolute left-3 top-3 text-gray-400" />
          <input
            className="border rounded-lg p-2 pl-10 w-full"
            placeholder="Cari nama..."
            value={cari}
            onChange={(e) => setCari(e.target.value)}
          />
        </div>
      </div>

      {/* TABEL */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="p-3 text-left">Nama</th>
              <th className="p-3 text-left">Kelas</th>
              <th className="p-3 text-center">Status</th>
              <th className="p-3 text-center">Masuk</th>
              <th className="p-3 text-center">Pulang</th>
              <th className="p-3 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="p-6 text-center">
                  Loading...
                </td>
              </tr>
            ) : dataFiltered.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-6 text-center text-gray-500">
                  Data tidak ditemukan
                </td>
              </tr>
            ) : (
              dataFiltered.map((x) => (
                <tr key={x.id} className="border-b hover:bg-blue-50">
                  <td className="p-3 font-medium">{x.nama}</td>
                  <td className="p-3">{x.kelas || "-"}</td>
                  <td className="p-3 text-center">
                    <BadgeStatus data={x} />
                  </td>
                  <td className="p-3 text-center">
                    {formatJam(x.masuk)}
                  </td>
                  <td className="p-3 text-center">
                    {formatJam(x.pulang)}
                  </td>
                  <td className="p-3 flex justify-center gap-2">
                    <button
                      onClick={() =>
                        navigate(`/presensi/edit/${x.id}`)
                      }
                      className="bg-yellow-500 hover:bg-yellow-600 text-white p-2 rounded"
                    >
                      <PencilSquareIcon className="w-4" />
                    </button>
                    <button
                      onClick={() => handleHapus(x.id)}
                      className="bg-red-600 hover:bg-red-700 text-white p-2 rounded"
                    >
                      <TrashIcon className="w-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
