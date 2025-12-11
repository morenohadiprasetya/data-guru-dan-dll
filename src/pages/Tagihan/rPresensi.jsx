// RekapPresensi.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { ArrowPathIcon, MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";

const API_PRESENSI = "http://localhost:5000/presensi";

function formatJam(val) {
  if (!val) return "-";
  try {
    if (
      typeof val === "string" &&
      (val.includes(":") || val.includes(".")) &&
      !val.includes("T")
    ) {
      return val.replace(".", ":");
    }
    const d = new Date(val);
    if (isNaN(d.getTime())) return val;
    return d.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "-";
  }
}

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

  async function ambilRekap() {
    setLoading(true);
    try {
      const params = { tanggal };
      if (kategori !== "all") params.kategori = kategori;

      const r = await axios.get(API_PRESENSI, { params });
      setRekap(Array.isArray(r.data) ? r.data : []);
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Gagal memuat data presensi", "error");
    } finally {
      setLoading(false);
    }
  }

  const dataFiltered = rekap.filter((x) =>
    x.nama?.toLowerCase().includes(cari.toLowerCase())
  );

  const totalPage = Math.max(1, Math.ceil(dataFiltered.length / limit));
  const mulai = (page - 1) * limit;
  const tampil = dataFiltered.slice(mulai, mulai + limit);

  return (
    <div className="p-6 max-w-6xl bg-gray-100 min-h-screen ml-70 rounded-lg shadow-md relative">

      {/* TOMBOL KEMBALI FIXED POJOK KIRI ATAS */}
      <button
        onClick={() => navigate("/dashboard")}
        className="fixed top-5 left-5 px-4 py-2 bg-blue-700 text-white rounded shadow z-50"
      >
        Kembali ke Menu
      </button>

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6 ml-100">
        <h1 className="text-2xl font-bold text-blue-700">Rekap Presensi</h1>

        <div className="flex gap-2">
          <button
            onClick={ambilRekap}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded"
          >
            <ArrowPathIcon className="w-5" />
            Refresh
          </button>
        </div>
      </div>

      {/* FILTER */}
      <div className="grid grid-cols-3 gap-4 bg-white p-4 rounded shadow-sm mb-4">
        <div>
          <label className="text-sm font-semibold block mb-1">Tanggal</label>
          <input
            type="date"
            className="border p-2 rounded w-full"
            value={tanggal}
            onChange={(e) => setTanggal(e.target.value)}
          />
        </div>

        <div>
          <label className="text-sm font-semibold block mb-1">Kategori</label>
          <select
            className="border p-2 rounded w-full"
            value={kategori}
            onChange={(e) => setKategori(e.target.value)}
          >
            <option value="all">Semua</option>
            <option value="hadir">Hadir</option>
            <option value="izin">Izin</option>
            <option value="sakit">Sakit</option>
            <option value="pulang">Pulang</option>
          </select>
        </div>

        <div>
          <label className="text-sm font-semibold block mb-1">Cari Nama</label>
          <div className="flex items-center border rounded overflow-hidden">
            <MagnifyingGlassIcon className="w-5 mx-2 text-gray-500" />
            <input
              className="p-2 w-full outline-none"
              placeholder="Cari nama..."
              value={cari}
              onChange={(e) => {
                setCari(e.target.value);
                setPage(1);
              }}
            />
          </div>
        </div>
      </div>

      {/* TABEL */}
      <div className="bg-white rounded shadow overflow-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-blue-100 text-blue-900">
            <tr>
              <th className="p-2 border">Nama</th>
              <th className="p-2 border">Kelas/Ket</th>
              <th className="p-2 border">Kategori</th>
              <th className="p-2 border">Masuk</th>
              <th className="p-2 border">Pulang</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="text-center p-4">
                  Loading...
                </td>
              </tr>
            ) : tampil.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center p-4">
                  Tidak ada data
                </td>
              </tr>
            ) : (
              tampil.map((x, i) => (
                <React.Fragment key={x.id || i}>
                  <tr className="hover:bg-gray-50">
                    <td className="p-2 border">{x.nama}</td>
                    <td className="p-2 border">{x.kelas || "-"}</td>

                    <td
                      className={`p-2 border capitalize ${
                        x.kategori === "izin"
                          ? "cursor-pointer text-blue-700 underline"
                          : ""
                      }`}
                      onClick={() =>
                        x.kategori === "izin"
                          ? setRowOpen(rowOpen === x.id ? null : x.id)
                          : null
                      }
                    >
                      {x.kategori || "-"}
                    </td>

                    <td className="p-2 border">{formatJam(x.masuk)}</td>
                    <td className="p-2 border">{formatJam(x.pulang)}</td>
                  </tr>

                  {rowOpen === x.id && x.kategori === "izin" && (
                    <tr className="bg-blue-50">
                      <td colSpan="5" className="p-3 border-l-4 border-blue-500">
                        <div className="font-semibold mb-1">
                          Keterangan Izin:
                        </div>
                        <div>{x.keteranganIzin || "(Tidak ada keterangan)"}</div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <div className="flex justify-between mt-4 items-center">
        <div>
          Halaman {page} dari {totalPage}
        </div>

        <div className="flex gap-2">
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Prev
          </button>

          <button
            disabled={page >= totalPage}
            onClick={() => setPage((p) => Math.min(totalPage, p + 1))}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
