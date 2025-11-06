import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import "remixicon/fonts/remixicon.css";

export default function TagihanDashboard() {
  const [tagihan, setTagihan] = useState([]);
  const [siswa, setSiswa] = useState([]);
  const [modal, setModal] = useState({ open: false, type: "", data: {} });
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      const [tagihanRes, siswaRes] = await Promise.all([
        fetch("http://localhost:5000/tagihan"),
        fetch("http://localhost:5000/siswa"),
      ]);
      const tagihanData = await tagihanRes.json();
      const siswaData = await siswaRes.json();
      setTagihan(tagihanData);
      setSiswa(siswaData);
    } catch (error) {
      console.error("Error fetching data:", error);
      Swal.fire("Error", "Gagal memuat data. Coba lagi nanti.", "error");
    }
  };

  const totalTagihan = tagihan.length;
  const totalLunas = tagihan.filter(t => t.status === "Lunas").length;
  const totalBelum = tagihan.filter(t => t.status === "Belum Lunas").length;
  const totalNominal = tagihan.reduce((sum, t) => sum + t.jumlah, 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const data = {
      siswaId: form.siswaId.value,
      nama: form.nama.value,
      kelas: form.kelas.value,
      bulan: form.bulan.value,
      jumlah: parseInt(form.jumlah.value),
      status: form.status.value,
    };

    if (modal.type === "add") {
      fetch("http://localhost:5000/tagihan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
        .then(res => res.json())
        .then(newTagihan => setTagihan([...tagihan, newTagihan]));
    } else {
      fetch(`http://localhost:5000/tagihan/${modal.data.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
        .then(res => res.json())
        .then(updated => setTagihan(tagihan.map(t => t.id === updated.id ? updated : t)));
    }
    setModal({ open: false, type: "", data: {} });
  };

  const handleHapus = (id) => {
    Swal.fire({
      title: "Hapus Data?",
      text: "Data tagihan ini akan dihapus!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Hapus",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`http://localhost:5000/tagihan/${id}`, { method: "DELETE" })
          .then(() => setTagihan(tagihan.filter(t => t.id !== id)));
      }
    });
  };

  const handleBayar = (id) => {
    const t = tagihan.find(t => t.id === id);
    Swal.fire({
      title: `Bayar Tagihan`,
      text: `Tagihan atas nama ${t.nama} sebesar Rp ${t.jumlah.toLocaleString()}`,
      input: "number",
      inputAttributes: { min: 0, max: t.jumlah, step: 1000 },
      showCancelButton: true,
      confirmButtonText: "Bayar",
      cancelButtonText: "Batal",
    }).then(result => {
      if (result.isConfirmed) {
        const bayar = parseInt(result.value);
        const sisa = t.jumlah - bayar;
        const updated = { ...t, jumlah: sisa, status: sisa === 0 ? "Lunas" : "Belum Lunas" };
        fetch(`http://localhost:5000/tagihan/${t.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updated),
        })
          .then(res => res.json())
          .then(u => setTagihan(tagihan.map(tg => tg.id === u.id ? u : tg)))
          .finally(() => {
            Swal.fire(
              sisa === 0 ? "Lunas!" : "Sebagian Terbayar",
              sisa === 0 ? "Tagihan lunas." : `Sisa: Rp ${sisa.toLocaleString()}`,
              sisa === 0 ? "success" : "info"
            );
          });
      }
    });
  };

  const handleAdd = () => setModal({ open: true, type: "add", data: {} });
  const handleEdit = (item) => setModal({ open: true, type: "edit", data: item });

  const filtered = tagihan
    .filter(t => t.nama && t.nama.toLowerCase().includes(search.toLowerCase()))  // Pastikan nama tidak undefined
    .filter(t => (filterStatus ? t.status === filterStatus : true));

  return (
    <div className="flex min-h-screen ml-50 bg-gradient-to-br from-blue-50 to-blue-100 p-6">
      <div className="flex-1">
        <header className="mb-6">
          <h1 className="text-3xl font-bold text-blue-900 flex items-center gap-2">
            <i className="ri-money-dollar-circle-line"></i> Tagihan Siswa
          </h1>
        </header>

        {/* Ringkasan */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[{ label: "Total Tagihan", value: totalTagihan, color: "bg-blue-100 text-blue-800" },
            { label: "Lunas", value: totalLunas, color: "bg-green-100 text-green-800" },
            { label: "Belum Lunas", value: totalBelum, color: "bg-red-100 text-red-800" },
            { label: "Total Nominal", value: `Rp ${totalNominal.toLocaleString()}`, color: "bg-yellow-100 text-yellow-800" }].map((c,i)=>( 
              <div key={i} className={`${c.color} p-5 rounded-lg shadow text-center`}>
                <p>{c.label}</p>
                <h2 className="text-2xl font-bold">{c.value}</h2>
              </div>
            ))}
        </div>

        {/* Pencarian / Filter / Tambah */}
        <div className="flex flex-col md:flex-row gap-3 mb-4">
          <input placeholder="Cari nama siswa..." value={search} onChange={e=>setSearch(e.target.value)}
            className="border px-4 py-2 rounded w-full md:w-1/3"/>
          <select value={filterStatus} onChange={e=>setFilterStatus(e.target.value)}
            className="border px-4 py-2 rounded w-full md:w-1/4">
            <option value="">Semua Status</option>
            <option value="Belum Lunas">Belum Lunas</option>
            <option value="Lunas">Lunas</option>
          </select>
          <button onClick={handleAdd} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">Tambah</button>
        </div>

        {/* Tabel */}
        <div className="overflow-x-auto bg-white rounded-lg shadow border border-blue-100">
          <table className="min-w-full text-sm border-collapse">
            <thead className="bg-blue-50 text-blue-900">
              <tr>
                {["No","Nama","Kelas","Bulan","Jumlah","Status","Aksi"].map((h,i)=>( 
                  <th key={i} className="border px-4 py-2">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length ? filtered.map((t,i)=>( 
                <tr key={t.id} className="hover:bg-blue-50">
                  <td className="border px-4 py-2 text-center">{i+1}</td>
                  <td className="border px-4 py-2">{t.nama}</td>
                  <td className="border px-4 py-2">{t.kelas}</td>
                  <td className="border px-4 py-2">{t.bulan}</td>
                  <td className="border px-4 py-2 text-right">Rp {t.jumlah.toLocaleString()}</td>
                  <td className={`border px-4 py-2 font-semibold ${t.status==="Lunas"?"text-green-600":"text-red-600"}`}>{t.status}</td>
                  <td className="border px-4 py-2 flex justify-center gap-2">
                    {t.status==="Belum Lunas" && <button onClick={()=>handleBayar(t.id)} className="bg-green-500 px-2 py-1 rounded text-white">Bayar</button>}
                    <button onClick={()=>handleEdit(t)} className="bg-yellow-500 px-2 py-1 rounded text-white">Edit</button>
                    <button onClick={()=>handleHapus(t.id)} className="bg-red-500 px-2 py-1 rounded text-white">Hapus</button>
                  </td>
                </tr>
              )):(
                <tr><td colSpan="7" className="text-center p-4 text-gray-600">Tidak ada data</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Modal */}
        {modal.open && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
              <h2 className="text-xl mb-4 font-semibold text-center">{modal.type==="add"?"Tambah Tagihan":"Edit Tagihan"}</h2>
              <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <select name="siswaId" defaultValue={modal.data.siswaId||""} required className="border px-3 py-2 rounded">
                  <option value="">-- Pilih Siswa --</option>
                  {siswa.map(s=><option key={s.id} value={s.id}>{s.nama}</option>)}
                </select>
                <input name="nama" defaultValue={modal.data.nama||""} placeholder="Nama Tagihan" className="border px-3 py-2 rounded" required/>
                <input name="kelas" defaultValue={modal.data.kelas||""} placeholder="Kelas" className="border px-3 py-2 rounded" required/>
                <input name="bulan" defaultValue={modal.data.bulan||""} placeholder="Bulan" className="border px-3 py-2 rounded" required/>
                <input type="number" name="jumlah" defaultValue={modal.data.jumlah||""} placeholder="Jumlah" className="border px-3 py-2 rounded" required/>
                <select name="status" defaultValue={modal.data.status||"Belum Lunas"} className="border px-3 py-2 rounded">
                  <option value="Belum Lunas">Belum Lunas</option>
                  <option value="Lunas">Lunas</option>
                </select>
                <div className="flex justify-end gap-3 mt-4">
                  <button type="button" onClick={()=>setModal({open:false,type:"",data:{}})} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Batal</button>
                  <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Simpan</button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
