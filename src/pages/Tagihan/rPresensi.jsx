import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import {
  ArrowPathIcon,
  MagnifyingGlassIcon,
  PencilSquareIcon,
  TrashIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";

/* =========================================================
   API
========================================================= */
const API_PRESENSI = "http://localhost:5000/presensi";

/* =========================================================
   HELPER WIB
========================================================= */
const getWIBDate = () =>
  new Date(
    new Date().toLocaleString("en-US", { timeZone: "Asia/Jakarta" })
  );

const formatJam = (val) => {
  if (!val) return "-";
  const d = new Date(val);
  if (isNaN(d.getTime())) return "-";
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
};

const formatTanggal = (val) => {
  if (!val) return "-";
  const d = new Date(val);
  return d.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

/* =========================================================
   BADGE STATUS (SESUAI PRESENSI)
========================================================= */
function BadgeStatus({ row }) {
  let text = "-";
  let color = "bg-gray-200 text-gray-700";
  let showInfo = false;

  switch (row.kategori) {
    case "hadir":
      text = row.pulang ? "Hadir (Pulang)" : "Hadir";
      color = "bg-blue-100 text-blue-700";
      break;

    case "terlambat":
      text = row.pulang
        ? "Hadir (Terlambat, Pulang)"
        : "Hadir (Terlambat)";
      color = "bg-orange-100 text-orange-700";
      break;

    case "izin":
      text = "Izin";
      color = "bg-yellow-100 text-yellow-700";
      showInfo = true;
      break;

    case "sakit":
      text = "Sakit";
      color = "bg-red-100 text-red-700";
      showInfo = true;
      break;

    default:
      text = row.kategori || "-";
  }

  const showKeterangan = () => {
    Swal.fire({
      title: `Keterangan ${text}`,
      text: row.keterangan || "-",
      icon: "info",
      confirmButtonText: "Tutup",
    });
  };

  return (
    <div className="flex items-center justify-center gap-1">
      <span
        className={`px-3 py-1 rounded-full text-xs font-semibold ${color}`}
      >
        {text}
      </span>

      {showInfo && (
        <button
          onClick={showKeterangan}
          title="Lihat keterangan"
          className="ml-1"
        >
          <InformationCircleIcon className="w-4 h-4 text-gray-500 hover:text-blue-600" />
        </button>
      )}
    </div>
  );
}

/* =========================================================
   MAIN COMPONENT
========================================================= */
export default function RekapPresensiLengkap() {
  const navigate = useNavigate();

  /* ================= STATE ================= */
  const [data, setData] = useState([]);
  const [tanggal, setTanggal] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [kategori, setKategori] = useState("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  /* ================= JAM WIB ================= */
  const [jamWIB, setJamWIB] = useState(getWIBDate());
  useEffect(() => {
    const t = setInterval(() => setJamWIB(getWIBDate()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    fetchData();
  }, [tanggal, kategori]);

  /* =========================================================
     FETCH DATA
  ========================================================= */
  const fetchData = async () => {
    try {
      setLoading(true);

      const res = await axios.get(API_PRESENSI, {
        params: { tanggal },
      });

      let rows = Array.isArray(res.data) ? res.data : [];

      // FILTER STATUS
      if (kategori !== "all") {
        if (kategori === "hadir") {
          rows = rows.filter(
            (r) =>
              r.kategori === "hadir" || r.kategori === "terlambat"
          );
        } else if (kategori === "pulang") {
          rows = rows.filter((r) => r.pulang);
        } else {
          rows = rows.filter((r) => r.kategori === kategori);
        }
      }

      // SORT TERLAMBAT DI ATAS
      rows.sort((a, b) => {
        if (a.kategori === "terlambat") return -1;
        if (b.kategori === "terlambat") return 1;
        return 0;
      });

      setData(rows);
    } catch {
      Swal.fire("Error", "Gagal memuat data presensi", "error");
    } finally {
      setLoading(false);
    }
  };

  /* =========================================================
     DELETE
  ========================================================= */
  const hapusData = async (id) => {
    const confirm = await Swal.fire({
      title: "Hapus Presensi?",
      text: "Data ini akan dihapus permanen",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Hapus",
      cancelButtonText: "Batal",
    });

    if (!confirm.isConfirmed) return;

    try {
      await axios.delete(`${API_PRESENSI}/${id}`);
      Swal.fire("Sukses", "Data berhasil dihapus", "success");
      fetchData();
    } catch {
      Swal.fire("Error", "Gagal menghapus data", "error");
    }
  };

  /* =========================================================
     SEARCH
  ========================================================= */
  const filtered = useMemo(() => {
    return data.filter((r) =>
      r.nama?.toLowerCase().includes(search.toLowerCase())
    );
  }, [data, search]);

  /* =========================================================
     UI
  ========================================================= */
  return (
    <div className="p-6 ml-10 min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between mb-6">
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
            — <b>{jamWIB.toLocaleTimeString("id-ID")} WIB</b>
          </p>
        </div>
 
      </div>

      {/* FILTER */}
      <div className="grid md:grid-cols-3 gap-4 bg-white p-4 rounded-xl shadow mb-6">
        <input
          type="date"
          value={tanggal}
          onChange={(e) => setTanggal(e.target.value)}
          className="border rounded-lg p-2"
        />

        <select
          className="border rounded-lg p-2"
          value={kategori}
          onChange={(e) => setKategori(e.target.value)}
        >
          <option value="all">Semua</option>
          <option value="hadir">Hadir</option>
          <option value="terlambat">Terlambat</option>
          <option value="pulang">Pulang</option>
          <option value="izin">Izin</option>
          <option value="sakit">Sakit</option>
        </select>

        <div className="relative">
          <MagnifyingGlassIcon className="w-5 absolute left-3 top-3 text-gray-400" />
          <input
            placeholder="Cari nama..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border rounded-lg p-2 pl-10 w-full"
          />
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="p-3 text-left">Nama</th>
              <th className="p-3 text-center">Kategori</th>
              <th className="p-3 text-center">Masuk</th>
              <th className="p-3 text-center">Pulang</th>
              <th className="p-3 text-center">Aksi</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="p-6 text-center">
                  Loading...
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-6 text-center text-gray-500">
                  Data tidak ditemukan
                </td>
              </tr>
            ) : (
              filtered.map((r) => (
                <tr
                  key={r.id}
                  className={`border-b hover:bg-blue-50 ${
                    r.kategori === "terlambat"
                      ? "bg-orange-50"
                      : ""
                  }`}
                >
                  <td className="p-3 font-medium">{r.nama}</td>
                  <td className="p-3 text-center">
                    <BadgeStatus row={r} />
                  </td>
                  <td className="p-3 text-center">
                    {formatJam(r.masuk)}
                  </td>
                  <td className="p-3 text-center">
                    {formatJam(r.pulang)}
                  </td>
                  <td className="p-3 flex justify-center gap-2">
                    <button
                      onClick={() =>
                        navigate(`/presensi/edit/${r.id}`)
                      }
                      className="bg-yellow-500 hover:bg-yellow-600 text-white p-2 rounded"
                    >
                      <PencilSquareIcon className="w-4" />
                    </button>
                    <button
                      onClick={() => hapusData(r.id)}
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
