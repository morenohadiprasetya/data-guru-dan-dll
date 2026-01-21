import React, { useEffect, useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faReceipt,
  faMoneyBillWave,
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";

/* =====================================================
   API
===================================================== */
const API = "http://localhost:5000/tagihan";

/* =====================================================
   HELPER
===================================================== */
const formatRp = (n = 0) =>
  "Rp " + Number(n).toLocaleString("id-ID");

/* =====================================================
   MAIN COMPONENT
===================================================== */
export default function RekapTagihan() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  /* ================= FETCH DATA ================= */
  useEffect(() => {
    let mounted = true;

    async function loadData() {
      try {
        setLoading(true);
        const res = await fetch(API);
        const d = await res.json();
        if (mounted) setData(Array.isArray(d) ? d : []);
      } catch (err) {
        console.error(err);
      } finally {
        mounted && setLoading(false);
      }
    }

    loadData();
    return () => (mounted = false);
  }, []);

  /* ================= GROUPING DATA ================= */
  const grouped = useMemo(() => {
    const map = {};

    data.forEach((item) => {
      const nama = item.nama || "Unknown";

      if (!map[nama]) {
        map[nama] = {
          nama,
          total: 0,
          lunas: 0,
          sisa: 0,
        };
      }

      const jumlah = Number(item.jumlah || 0);
      map[nama].total += jumlah;

      if ((item.status || "").toLowerCase() === "lunas") {
        map[nama].lunas += jumlah;
      }

      map[nama].sisa = map[nama].total - map[nama].lunas;
    });

    return Object.values(map);
  }, [data]);

  /* ================= FILTER + SORT ================= */
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return grouped
      .filter((x) => x.nama.toLowerCase().includes(q))
      .sort((a, b) => b.total - a.total);
  }, [grouped, search]);

  /* ================= SUMMARY ================= */
  const totals = useMemo(() => {
    return grouped.reduce(
      (acc, cur) => {
        acc.total += cur.total;
        acc.lunas += cur.lunas;
        acc.sisa += cur.sisa;
        return acc;
      },
      { total: 0, lunas: 0, sisa: 0 }
    );
  }, [grouped]);

  /* ================= UI ================= */
  return (
    <div className="p-6 ml-55 min-h-screen bg-gray-50">
      {/* HEADER */}
      <div className="flex items-center gap-3 mb-8">
        <FontAwesomeIcon
          icon={faReceipt}
          className="text-blue-600 text-3xl"
        />
        <h1 className="text-3xl font-semibold text-gray-800">
          Rekap Tagihan
        </h1>
      </div>

      {/* FILTER + SUMMARY */}
      <div className="bg-white rounded-2xl shadow border p-6 mb-8">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="🔍 Cari nama siswa..."
          className="w-full mb-6 p-3 rounded-xl bg-gray-100 border
                     focus:ring-2 focus:ring-blue-400 outline-none"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <SummaryCard
            title="Total Tagihan"
            value={formatRp(totals.total)}
            color="blue"
          />
          <SummaryCard
            title="Total Terbayar"
            value={formatRp(totals.lunas)}
            color="green"
          />
          <SummaryCard
            title="Sisa Pembayaran"
            value={formatRp(totals.sisa)}
            color="red"
          />
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow border overflow-hidden">
        {loading ? (
          <div className="p-10 text-center text-gray-500">
            Memuat data...
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-10 text-center text-gray-500">
            Data tidak ditemukan
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="px-4 py-3 w-12 text-center">No</th>
                  <th className="px-4 py-3 text-left">Nama</th>
                  <th className="px-4 py-3 text-right">Total</th>
                  <th className="px-4 py-3 text-right">Lunas</th>
                  <th className="px-4 py-3 text-right w-48">
                    Sisa
                  </th>
                </tr>
              </thead>

              <tbody>
                {filtered.map((r, i) => (
                  <tr
                    key={r.nama}
                    className="border-b last:border-0 hover:bg-blue-50 transition"
                  >
                    {/* NO */}
                    <td className="px-4 py-3 text-left font-semibold">
                      {i + 1}
                    </td>

                    {/* NAMA */}
                    <td className="px-4 py-3 font-medium text-gray-800">
                      {r.nama}
                    </td>

                    {/* TOTAL */}
                    <td className="px-4 py-3 ">
                      {formatRp(r.total)}
                    </td>

                    {/* LUNAS */}
                    <td className="px-4 py-3  text-green-600">
                      {formatRp(r.lunas)}
                    </td>

           
                    <td className="px-4 py-3 text-left">
                      <div className="flex justify-end items-center gap-2 font-semibold">
                        <span
                          className={
                            r.sisa === 0
                              ? "text-gray-400"
                              : "text-red-600"
                          }
                        >
                          {formatRp(r.sisa)}
                        </span>

                        {r.sisa === 0 && (
                          <span className="flex items-center gap-1 px-2 py-1 text-xs bg-green-100 text-green-700 rounded">
                            <FontAwesomeIcon
                              icon={faCheckCircle}
                            />
                            LUNAS
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <p className="mt-4 text-sm text-gray-500">
        Rekap dihitung berdasarkan field{" "}
        <code>jumlah</code> dan <code>status</code>{" "}
        dari endpoint <code>/tagihan</code>.
      </p>
    </div>
  );
}

/* =====================================================
   SUMMARY CARD
===================================================== */
function SummaryCard({ title, value, color }) {
  const map = {
    blue: "bg-blue-50 border-blue-200 text-blue-700",
    green: "bg-green-50 border-green-200 text-green-700",
    red: "bg-red-50 border-red-200 text-red-700",
  };

  return (
    <div
      className={`p-6 rounded-xl border ${map[color]} flex items-center gap-4`}
    >
      <FontAwesomeIcon
        icon={faMoneyBillWave}
        className="text-3xl opacity-70"
      />
      <div>
        <p className="text-sm">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  );
}
