import React, { useEffect, useState } from "react";
import "remixicon/fonts/remixicon.css";

 
export default function Dashboard() {
  const [siswa, setSiswa] = useState([]);
  const [guru, setGuru] = useState([]);
  const [karyawan, setKaryawan] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    let mounted = true;

    async function fetchAll() {
      try {
        setLoading(true);
         
        const [resSiswa, resGuru, resKaryawan] = await Promise.all([
          fetch("http://localhost:5000/siswa").then((r) => r.ok ? r.json() : []),
          fetch("http://localhost:5000/guru").then((r) => r.ok ? r.json() : []),
          fetch("http://localhost:5000/karyawan").then((r) => r.ok ? r.json() : []),
        ]);

        if (!mounted) return;
        setSiswa(Array.isArray(resSiswa) ? resSiswa : []);
        setGuru(Array.isArray(resGuru) ? resGuru : []);
        setKaryawan(Array.isArray(resKaryawan) ? resKaryawan : []);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
        // fallback: kosongkan arrays
        setSiswa([]);
        setGuru([]);
        setKaryawan([]);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchAll();
    return () => (mounted = false);
  }, []);

  const semuaData = [
    ...siswa.map((it) => ({ ...it, kategori: "Siswa" })),
    ...guru.map((it) => ({ ...it, kategori: "Guru" })),
    ...karyawan.map((it) => ({ ...it, kategori: "Karyawan" })),
  ];

  const filtered = semuaData.filter((d) =>
    `${d.nama ?? ""} ${d.ket ?? ""} ${d.alamat ?? ""} ${d.hp ?? ""} ${d.kategori ?? ""}`
      .toLowerCase()
      .includes(search.trim().toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-6">
      <header className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-blue-900 flex items-center gap-3">
              <i className="ri-bar-chart-2-line text-2xl text-blue-600"></i>
              Dashboard Sekolah
            </h1>
            <p className="text-sm text-blue-700/80 mt-1">
              Ringkasan cepat jumlah dan daftar semua entitas di sistem.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari nama, kelas, atau nomor..."
                className="pl-10 pr-4 py-2 rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-300 focus:outline-none w-64 bg-white"
              />
              <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-blue-400"></i>
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <div className="text-sm text-blue-800 bg-blue-50 px-3 py-2 rounded-lg border border-blue-100">
                <span className="font-semibold">{siswa.length}</span>{" "}
                <span className="text-blue-600/80">Siswa</span>
              </div>
              <div className="text-sm text-blue-800 bg-blue-50 px-3 py-2 rounded-lg border border-blue-100">
                <span className="font-semibold">{guru.length}</span>{" "}
                <span className="text-blue-600/80">Guru</span>
              </div>
              <div className="text-sm text-blue-800 bg-blue-50 px-3 py-2 rounded-lg border border-blue-100">
                <span className="font-semibold">{karyawan.length}</span>{" "}
                <span className="text-blue-600/80">Karyawan</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main>
        
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
          <StatCard
            title="Siswa"
            value={siswa.length}
            icon="ri-user-3-line"
            accent="from-blue-500 to-blue-600"
            description="Jumlah terdaftar"
          />
          <StatCard
            title="Guru"
            value={guru.length}
            icon="ri-user-star-line"
            accent="from-indigo-500 to-indigo-600"
            description="Pengajar aktif"
          />
          <StatCard
            title="Karyawan"
            value={karyawan.length}
            icon="ri-building-4-line"
            accent="from-emerald-500 to-emerald-600"
            description="Staf & admin"
          />
        </section>

        
        <section className="bg-white border border-blue-100 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-blue-900 flex items-center gap-2">
              <i className="ri-file-list-3-line text-blue-600"></i> Semua Data
            </h3>
            <p className="text-sm text-blue-600/80">
              Menampilkan <span className="font-semibold">{filtered.length}</span> dari{" "}
              <span className="font-semibold">{semuaData.length}</span> entri
            </p>
          </div>

          {loading ? (
            <div className="py-12 text-center text-blue-600">⏳ Memuat data...</div>
          ) : filtered.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-blue-50">
                  <tr>
                    <th className="p-3 text-left font-semibold text-blue-700 border-b border-blue-100">No</th>
                    <th className="p-3 text-left font-semibold text-blue-700 border-b border-blue-100">Kategori</th>
                    <th className="p-3 text-left font-semibold text-blue-700 border-b border-blue-100">Nama</th>
                    <th className="p-3 text-left font-semibold text-blue-700 border-b border-blue-100">Keterangan</th>
                    <th className="p-3 text-left font-semibold text-blue-700 border-b border-blue-100">Alamat</th>
                    <th className="p-3 text-left font-semibold text-blue-700 border-b border-blue-100">No HP</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((d, i) => (
                    <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-blue-50"}>
                      <td className="p-3 border-b border-blue-100">{i + 1}</td>
                      <td className="p-3 border-b border-blue-100">
                        <CategoryPill kategori={d.kategori} />
                      </td>
                      <td className="p-3 border-b border-blue-100 font-medium">{d.nama}</td>
                      <td className="p-3 border-b border-blue-100">{d.ket}</td>
                      <td className="p-3 border-b border-blue-100">{d.alamat}</td>
                      <td className="p-3 border-b border-blue-100">{d.hp}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}


function StatCard({ title, value, icon, accent, description }) {
  return (
    <div className="rounded-xl p-4 shadow-sm bg-gradient-to-r from-white to-white border border-blue-50">
      <div className="flex items-center gap-4">
        <div
          className={`p-3 rounded-lg bg-gradient-to-br ${accent} text-white shadow-md`}
          style={{ minWidth: 64, minHeight: 64 }}
        >
          <i className={`${icon} text-2xl`}></i>
        </div>
        <div>
          <p className="text-sm text-blue-600 font-semibold">{title}</p>
          <h4 className="text-2xl font-extrabold text-blue-900">{value}</h4>
          <p className="text-xs text-blue-500 mt-1">{description}</p>
        </div>
      </div>
    </div>
  );
}

function CategoryPill({ kategori }) {
  const map = {
    Siswa: "bg-blue-600/10 text-blue-700 border-blue-100",
    Guru: "bg-indigo-600/10 text-indigo-700 border-indigo-100",
    Karyawan: "bg-emerald-600/10 text-emerald-700 border-emerald-100",
  };
  const cls = map[kategori] || "bg-gray-100 text-gray-700 border-gray-100";
  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${cls}`}>{kategori}</span>
  );
}

function EmptyState() {
  return (
    <div className="py-12 text-center text-blue-600">
      <i className="ri-folder-open-line text-4xl mb-2 block"></i>
      <p className="text-lg font-semibold">Tidak ada data yang cocok</p>
      <p className="text-sm mt-2">Coba ubah kata pencarian atau tambahkan data baru.</p>
    </div>
  );
}
