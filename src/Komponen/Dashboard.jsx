import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import "remixicon/fonts/remixicon.css";

const API_TAGIHAN = "http://localhost:5000/tagihan";
const API_KELAS = "http://localhost:5000/kelas";
const API_KATEGORI = "http://localhost:5000/kategoriTagihan";
const API_SISWA = "http://localhost:5000/siswa";
const API_GURU = "http://localhost:5000/guru";
const API_KARYAWAN = "http://localhost:5000/karyawan";

function formatRp(n = 0) {
  return "Rp " + Number(n).toLocaleString("id-ID");
}

export default function Dashboard() {
  const [tagihanData, setTagihanData] = useState([]);
  const [kelasData, setKelasData] = useState([]);
  const [kategoriTagihan, setKategoriTagihan] = useState([]);
  const [siswaData, setSiswaData] = useState([]);
  const [guruData, setGuruData] = useState([]);
  const [karyawanData, setKaryawanData] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTagihan, setSearchTagihan] = useState("");
  const [searchSiswa, setSearchSiswa] = useState("");
  const [searchGuru, setSearchGuru] = useState("");
  const [searchKaryawan, setSearchKaryawan] = useState("");

  // ================================
  // LOAD ALL DATA
  // ================================
  useEffect(() => {
    async function loadData() {
      try {
        const [
          tagihanRes,
          kelasRes,
          kategoriRes,
          siswaRes,
          guruRes,
          karyawanRes,
        ] = await Promise.all([
          axios.get(API_TAGIHAN),
          axios.get(API_KELAS),
          axios.get(API_KATEGORI),
          axios.get(API_SISWA),
          axios.get(API_GURU),
          axios.get(API_KARYAWAN),
        ]);

        setTagihanData(Array.isArray(tagihanRes.data) ? tagihanRes.data : []);
        setKelasData(Array.isArray(kelasRes.data) ? kelasRes.data : []);
        setKategoriTagihan(
          Array.isArray(kategoriRes.data) ? kategoriRes.data : []
        );
        setSiswaData(Array.isArray(siswaRes.data) ? siswaRes.data : []);
        setGuruData(Array.isArray(guruRes.data) ? guruRes.data : []);
        setKaryawanData(Array.isArray(karyawanRes.data) ? karyawanRes.data : []);
      } catch (err) {
        setError("Gagal memuat data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // ================================
  // GROUPING TAGIHAN (AUTO FIX LUNAS)
  // ================================
  const groupedTagihan = useMemo(() => {
    const map = {};

    tagihanData.forEach((t) => {
      const name = t.nama || t.namaTagihan || "Unknown";

      if (!map[name]) {
        map[name] = { nama: name, total: 0, lunas: 0, sisa: 0 };
      }

      const jumlah = Number(t.jumlah ?? t.total ?? 0);
      map[name].total += jumlah;

      const status = (t.status || "").toLowerCase().trim();
      const statusLunas = [
        "lunas",
        "sudah bayar",
        "sudah dibayar",
        "dibayar",
        "paid",
        "true",
        "yes",
      ];

      const isLunas =
        statusLunas.includes(status) ||
        t.status === 1 ||
        t.status === true ||
        t.lunas === true;

      if (isLunas) {
        map[name].lunas += jumlah;
      }

      map[name].sisa = map[name].total - map[name].lunas;
    });

    return Object.values(map);
  }, [tagihanData]);

  const filteredTagihan = groupedTagihan.filter((x) =>
    x.nama.toLowerCase().includes(searchTagihan.toLowerCase())
  );

  const totals = groupedTagihan.reduce(
    (acc, cur) => {
      acc.totalAll += cur.total;
      acc.lunasAll += cur.lunas;
      acc.sisaAll += cur.sisa;
      return acc;
    },
    { totalAll: 0, lunasAll: 0, sisaAll: 0 }
  );

  // ================================
  // HEADER
  // ================================
  const Header = () => (
    <header className="bg-white p-4 border-b flex justify-between items-center">
      <div>
        <div className="text-xl font-bold flex items-center gap-2">
          <i className="ri-dashboard-2-line text-blue-600"></i> Dashboard
        </div>
        <div className="text-gray-500 text-sm">Ringkasan data sekolah</div>
      </div>
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-blue-200 flex items-center justify-center">
          <i className="ri-user-fill text-blue-700"></i>
        </div>
      </div>
    </header>
  );

  if (loading) return <div className="p-6">Memuat data...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div className="flex bg-gray-50 ml-59 min-h-screen">
      <div className="flex-1 flex flex-col">
        <Header />

        <main className="p-6 space-y-6">
          {/* SUMMARY */}
          <section className="grid grid-cols-2 md:grid-cols-6 gap-4">
            <div className="p-4 bg-white rounded-xl shadow border">
              <div className="text-gray-500 text-sm">Total Tagihan</div>
              <div className="text-2xl font-bold">{formatRp(totals.totalAll)}</div>
            </div>
            <div className="p-4 bg-white rounded-xl shadow border">
              <div className="text-gray-500 text-sm">Terbayar</div>
              <div className="text-2xl font-bold text-green-600">
                {formatRp(totals.lunasAll)}
              </div>
            </div>
            <div className="p-4 bg-white rounded-xl shadow border">
              <div className="text-gray-500 text-sm">Belum Lunas</div>
              <div className="text-2xl font-bold text-red-600">
                {formatRp(totals.sisaAll)}
              </div>
            </div>
            <div className="p-4 bg-white rounded-xl shadow border">
              <div className="text-gray-500 text-sm">Siswa</div>
              <div className="text-2xl font-bold">{siswaData.length}</div>
            </div>
            <div className="p-4 bg-white rounded-xl shadow border">
              <div className="text-gray-500 text-sm">Guru</div>
              <div className="text-2xl font-bold">{guruData.length}</div>
            </div>
            <div className="p-4 bg-white rounded-xl shadow border">
              <div className="text-gray-500 text-sm">Karyawan</div>
              <div className="text-2xl font-bold">{karyawanData.length}</div>
            </div>
          </section>

          {/* TABEL TAGIHAN */}
          <section className="bg-white rounded-2xl shadow p-5 border">
            <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
              <i className="ri-file-list-3-fill text-blue-600"></i> Rekap Tagihan
            </h2>
            <input
              className="w-full p-2 border rounded mb-3"
              placeholder="Cari tagihan..."
              value={searchTagihan}
              onChange={(e) => setSearchTagihan(e.target.value)}
            />
            <div className="overflow-auto">
              <table className="w-full border rounded-lg">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-2 border">Nama</th>
                    <th className="p-2 border">Total</th>
                    <th className="p-2 border">Lunas</th>
                    <th className="p-2 border">Belum Lunas</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTagihan.map((t, idx) => (
                    <tr key={idx}>
                      <td className="p-2 border">{t.nama}</td>
                      <td className="p-2 text-right border">{formatRp(t.total)}</td>
                      <td className="p-2 text-right border text-green-600">
                        {formatRp(t.lunas)}
                      </td>
                      <td className="p-2 text-right border text-red-600">
                        {formatRp(t.sisa)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* TABEL SISWA */}
          <section className="bg-white rounded-2xl shadow p-5 border">
            <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
              <i className="ri-user-fill text-green-600"></i> Siswa
            </h2>
            <input
              className="w-full p-2 border rounded mb-3"
              placeholder="Cari siswa..."
              value={searchSiswa}
              onChange={(e) => setSearchSiswa(e.target.value)}
            />
            <div className="overflow-auto">
              <table className="w-full border rounded-lg">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-3 border w-2/3">Nama</th>
                    <th className="p-3 border w-1/3">Kelas</th>
                  </tr>
                </thead>
                <tbody>
                  {siswaData
                    .filter((s) =>
                      (s.nama || "").toLowerCase().includes(searchSiswa.toLowerCase())
                    )
                    .map((s, idx) => (
                      <tr key={idx}>
                        <td className="p-3 border w-2/3">{s.nama}</td>
                        <td className="p-3 border w-1/3">{s.kelas}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* TABEL GURU */}
          <section className="bg-white rounded-2xl shadow p-5 border">
            <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
              <i className="ri-user-star-fill text-yellow-600"></i> Guru
            </h2>
            <input
              className="w-full p-2 border rounded mb-3"
              placeholder="Cari guru..."
              value={searchGuru}
              onChange={(e) => setSearchGuru(e.target.value)}
            />

            <div className="overflow-auto">
              <table className="w-full border rounded-lg">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-3 border w-2/3">Nama</th>
                    <th className="p-3 border w-1/3">Mata Pelajaran</th>
                  </tr>
                </thead>
                <tbody>
                  {guruData
                    .filter((g) =>
                      (g.nama || "").toLowerCase().includes(searchGuru.toLowerCase())
                    )
                    .map((g, idx) => (
                      <tr key={idx}>
                        <td className="p-3 border w-2/3">{g.nama}</td>
                        <td className="p-3 border w-1/3">{g.ket}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* TABEL KARYAWAN */}
          <section className="bg-white rounded-2xl shadow p-5 border">
            <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
              <i className="ri-briefcase-fill text-indigo-600"></i> Karyawan
            </h2>
            <input
              className="w-full p-2 border rounded mb-3"
              placeholder="Cari karyawan..."
              value={searchKaryawan}
              onChange={(e) => setSearchKaryawan(e.target.value)}
            />

            <div className="overflow-auto">
              <table className="w-full border rounded-lg">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-3 border w-2/3">Nama</th>
                    <th className="p-3 border w-1/3">Jabatan</th>
                  </tr>
                </thead>
                <tbody>
                  {karyawanData
                    .filter((k) =>
                      (k.nama || "").toLowerCase().includes(searchKaryawan.toLowerCase())
                    )
                    .map((k, idx) => (
                      <tr key={idx}>
                        <td className="p-3 border w-2/3">{k.nama}</td>
                        <td className="p-3 border w-1/3">{k.ket}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
