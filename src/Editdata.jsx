import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import "animate.css";

function Edit() {
  const nav = useNavigate();
  const lokasi = useLocation();
  const query = new URLSearchParams(lokasi.search);

  const id = query.get("id");
  const kategori = query.get("kategori");

  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    nama: "",
    ket: "",
    alamat: "",
    hp: "",
  });

   
  useEffect(() => {
    if (!id || !kategori) return;
    const endpoint = `http://localhost:5000/${kategori.toLowerCase()}/${id}`;

    fetch(endpoint)
      .then((res) => {
        if (!res.ok) throw new Error("Data tidak ditemukan");
        return res.json();
      })
      .then((res) => {
        setForm(res);
        setLoading(false);
      })
      .catch(() => {
        Swal.fire({
          icon: "error",
          title: "❌",
          text: "Data tidak ditemukan di server!",
          confirmButtonColor: "#3B82F6",
        }).then(() => {
          nav(`/apo?kategori=${kategori}`);
        });
      });
  }, [id, kategori, nav]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

     
    if (!form.nama || !form.ket || !form.alamat || !form.hp) {
      Swal.fire({
        title: "⚠️ Kolom Kosong!",
        text: "Harap isi semua kolom sebelum menyimpan.",
        icon: "warning",
        confirmButtonText: "Oke, akan saya isi",
        confirmButtonColor: "#3B82F6",
        showClass: {
          popup: "animate__animated animate__headShake animate__faster",
        },
        hideClass: {
          popup: "animate__animated animate__fadeOutUp animate__faster",
        },
      });
      return;
    }

    
    Swal.fire({
      title: "Apakah kamu ingin menyimpan perubahan?",
      icon: "question",
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "💾 Simpan",
      denyButtonText: "🚫 Jangan simpan",
      cancelButtonText: "❌ Batal",
      confirmButtonColor: "#2563EB",
      denyButtonColor: "#F59E0B",
      cancelButtonColor: "#DC2626",
      showClass: {
        popup: "animate__animated animate__fadeInDown animate__faster",
      },
      hideClass: {
        popup: "animate__animated animate__fadeOutUp animate__faster",
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
         
        const endpoint = `http://localhost:5000/${kategori.toLowerCase()}/${id}`;
        try {
          const response = await fetch(endpoint, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
          });

          if (response.ok) {
            Swal.fire({
              icon: "success",
              title: "✅ Disimpan!",
              text: "Data berhasil diperbarui.",
              confirmButtonColor: "#3B82F6",
              showClass: {
                popup: "animate__animated animate__fadeInDown animate__faster",
              },
              hideClass: {
                popup: "animate__animated animate__fadeOutUp animate__faster",
              },
            }).then(() => {
              nav(`/apo?kategori=${kategori}`);
            });
          } else {
            throw new Error("Gagal update data");
          }
        } catch {
          Swal.fire({
            icon: "error",
            title: "❌ Gagal!",
            text: "Terjadi kesalahan saat memperbarui data!",
            confirmButtonColor: "#3B82F6",
          });
        }
      } else if (result.isDenied) {
        Swal.fire({
          icon: "info",
          title: "Perubahan tidak disimpan",
          text: "Data tetap seperti sebelumnya.",
          confirmButtonColor: "#3B82F6",
          showClass: {
            popup: "animate__animated animate__fadeInDown animate__faster",
          },
          hideClass: {
            popup: "animate__animated animate__fadeOutUp animate__faster",
          },
        });
      }
    });
  };

  if (loading) {
    return (
      <div className="p-8 font-[Segoe UI]">
        <h3>⏳ Sedang memuat data...</h3>
      </div>
    );
  }

  return (
    <div className="p-8 font-[Segoe UI] min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-lg p-8 border border-gray-200 animate__animated animate__fadeIn">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          ✏️ Edit Data {kategori}
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="font-semibold text-gray-700">Nama</label>
            <input
              name="nama"
              value={form.nama}
              onChange={handleChange}
              className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Masukkan nama"
            />
          </div>

          <div>
            <label className="font-semibold text-gray-700">
              {kategori === "Siswa"
                ? "Kelas"
                : kategori === "Guru"
                ? "Mapel"
                : "Jabatan"}
            </label>
            <input
              name="ket"
              value={form.ket}
              onChange={handleChange}
              className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={`Masukkan ${
                kategori === "Siswa"
                  ? "kelas"
                  : kategori === "Guru"
                  ? "mapel"
                  : "jabatan"
              }`}
            />
          </div>

          <div>
            <label className="font-semibold text-gray-700">Alamat</label>
            <input
              name="alamat"
              value={form.alamat}
              onChange={handleChange}
              className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Masukkan alamat"
            />
          </div>

          <div>
            <label className="font-semibold text-gray-700">Nomor HP</label>
            <input
              name="hp"
              value={form.hp}
              onChange={handleChange}
              className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Masukkan nomor HP"
            />
          </div>

          <button
            type="submit"
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition duration-200"
          >
            Simpan Perubahan
          </button>

          <button
            type="button"
            onClick={() => nav(`/apo?kategori=${kategori}`)}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-lg transition duration-200"
          >
            Batal
          </button>
        </form>
      </div>
    </div>
  );
}

export default Edit;
