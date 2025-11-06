// src/tagihan.jsx
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";

export default function Tagihan() {
  const API = "http://localhost:5000";
  const [tagihan, setTagihan] = useState([]);
  const [siswa, setSiswa] = useState([]);
  const [kategori, setKategori] = useState([]);
  const [form, setForm] = useState({
    id: "",
    siswaId: "",
    kategoriId: "",
    bulan: "",
    jumlah: "",
    status: "Belum Lunas",
  });
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [tagihanRes, siswaRes, kategoriRes] = await Promise.all([
        fetch(`${API}/tagihan`),
        fetch(`${API}/siswa`),
        fetch(`${API}/kategoriTagihan`),
      ]);
      const [tagihanData, siswaData, kategoriData] = await Promise.all([
        tagihanRes.json(),
        siswaRes.json(),
        kategoriRes.json(),
      ]);
      setTagihan(Array.isArray(tagihanData) ? tagihanData : []);
      setSiswa(Array.isArray(siswaData) ? siswaData : []);
      setKategori(Array.isArray(kategoriData) ? kategoriData : []);
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Gagal memuat data.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.siswaId || !form.kategoriId || !form.bulan || !form.jumlah) {
      return Swal.fire("Peringatan", "Lengkapi semua kolom!", "warning");
    }

    try {
      if (editMode) {
        await fetch(`${API}/tagihan/${form.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        Swal.fire("Berhasil", "Tagihan diperbarui.", "success");
      } else {
        await fetch(`${API}/tagihan`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        Swal.fire("Berhasil", "Tagihan ditambahkan.", "success");
      }
      setForm({ id: "", siswaId: "", kategoriId: "", bulan: "", jumlah: "", status: "Belum Lunas" });
      setEditMode(false);
      loadData();
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Gagal menyimpan data.", "error");
    }
  };

  const handleEdit = (item) => {
    setForm({
      id: item.id,
      siswaId: item.siswaId,
      kategoriId: item.kategoriId,
      bulan: item.bulan,
      jumlah: item.jumlah,
      status: item.status,
    });
    setEditMode(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Yakin hapus?",
      text: "Data tagihan akan dihapus permanen.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus",
      cancelButtonText: "Batal",
    });
    if (!confirm.isConfirmed) return;

    try {
      await fetch(`${API}/tagihan/${id}`, { method: "DELETE" });
      setTagihan((prev) => prev.filter((t) => t.id !== id));
      Swal.fire("Terhapus", "Tagihan dihapus.", "success");
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Gagal menghapus data.", "error");
    }
  };

  const getSiswaNama = (id) => siswa.find((s) => s.id === id)?.nama ?? "-";
  const getKategoriNama = (id) => kategori.find((k) => k.id === id)?.nama ?? "-";

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Manajemen Tagihan</h1>

      {/* FORM EDIT TAGIHAN */}
      {editMode && (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-6 gap-3 mb-6 bg-white p-4 rounded shadow">
          <select name="siswaId" value={form.siswaId} onChange={handleChange} className="border p-2 rounded col-span-2" required>
            <option value="">-- Pilih Siswa --</option>
            {siswa.map((s) => (
              <option key={s.id} value={s.id}>
                {s.nama} ({s.ket})
              </option>
            ))}
          </select>

          <select name="kategoriId" value={form.kategoriId} onChange={handleChange} className="border p-2 rounded col-span-2" required>
            <option value="">-- Pilih Kategori --</option>
            {kategori.map((k) => (
              <option key={k.id} value={k.id}>
                {k.nama}
              </option>
            ))}
          </select>

          <input name="bulan" value={form.bulan} onChange={handleChange} placeholder="Bulan" className="border p-2 rounded col-span-1" required />
          <input name="jumlah" type="number" value={form.jumlah} onChange={handleChange} placeholder="Jumlah (Rp)" className="border p-2 rounded col-span-1" required />

          <select name="status" value={form.status} onChange={handleChange} className="border p-2 rounded col-span-1">
            <option value="Belum Lunas">Belum Lunas</option>
            <option value="Lunas">Lunas</option>
          </select>

          <div className="col-span-full flex gap-2">
            <button type="submit" className="px-4 py-2 bg-yellow-500 text-white rounded">Simpan Perubahan</button>
            <button
              type="button"
              onClick={() => {
                setForm({ id: "", siswaId: "", kategoriId: "", bulan: "", jumlah: "", status: "Belum Lunas" });
                setEditMode(false);
              }}
              className="px-4 py-2 bg-gray-300 rounded"
            >
              Batal
            </button>
          </div>
        </form>
      )}

      {/* TABEL TAGIHAN */}
      <div className="overflow-x-auto bg-white rounded shadow border">
        {loading ? (
          <div className="p-6 text-center">⏳ Memuat data...</div>
        ) : (
          <table className="min-w-full text-sm">
            <thead className="bg-blue-50">
              <tr>
                <th className="p-2 border">No</th>
                <th className="p-2 border text-left">Nama Siswa</th>
                <th className="p-2 border text-left">Kategori</th>
                <th className="p-2 border">Bulan</th>
                <th className="p-2 border text-right">Jumlah</th>
                <th className="p-2 border">Status</th>
                <th className="p-2 border text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {tagihan.length === 0 && (
                <tr>
                  <td colSpan="7" className="p-4 text-center text-gray-500">
                    Belum ada data tagihan
                  </td>
                </tr>
              )}
              {tagihan.map((t, i) => (
                <tr key={t.id} className={i % 2 === 0 ? "bg-white" : "bg-blue-50"}>
                  <td className="p-2 border text-center">{i + 1}</td>
                  <td className="p-2 border">{getSiswaNama(t.siswaId)}</td>
                  <td className="p-2 border">{getKategoriNama(t.kategoriId)}</td>
                  <td className="p-2 border text-center">{t.bulan}</td>
                  <td className="p-2 border text-right">Rp {Number(t.jumlah).toLocaleString()}</td>
                  <td className="p-2 border text-center">
                    <span className={`px-2 py-1 rounded text-sm ${t.status === "Lunas" ? "text-green-700" : "text-red-600"}`}>
                      {t.status}
                    </span>
                  </td>
                  <td className="p-2 border text-center">
                    <div className="inline-flex gap-2">
                      <button onClick={() => handleEdit(t)} className="px-3 py-1 rounded bg-yellow-400 hover:bg-yellow-500 text-white">
                        Edit
                      </button>
                      <button onClick={() => handleDelete(t.id)} className="px-3 py-1 rounded bg-red-500 hover:bg-red-600 text-white">
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
