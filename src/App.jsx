import { Routes, Route, useLocation } from "react-router-dom";

import Sidnav from "./Komponen/Sidnav";
import Dashboard from "./Komponen/Dashboard";

import Tagihan from "./pages/Tagihan/tagihan";
import KategoriTagihan from "./pages/Tagihan/kategoritagihan";
import RekapTagihan from "./pages/Tagihan/rekaptagihan";

import Login from "./Komponen/Login";
import Register from "./Komponen/Register";

import Masterdata from "./pages/masterdata/Masterdata";
import Tambahdata from "./pages/masterdata/TambahData";
import Edit from "./pages/masterdata/Editdata";
import RekapPresensi from "./pages/Tagihan/rPresensi";
 
import Tambahkategoridata from "./pages/data/tambahkategorid";
import Editkategoridata from "./pages/data/editkategorid";
import KategoriDataCRUD from "./pages/data/ambatigori";

import TambahKelas from "./pages/kelas/TambahKelas";
import Kelas from "./pages/kelas/Kelas";
import EditKelas from "./pages/kelas/Editkelas";

import Ekategori from "./pages/Tagihan/Ekategori";
import Tkategori from "./pages/Tagihan/Tkategori";
import TambahTagihan from "./pages/Tagihan/Tambahtagihan";
import PresensiPage from "./pages/Tagihan/Presensi";
import Trht from "./pages/Tagihan/Trht";


export default function App() {
  const loc = useLocation();
  const hideSidebar = ["/", "/register"];

  return (
    <div className="flex min-h-screen bg-gray-100">
      {!hideSidebar.includes(loc.pathname) && <Sidnav />}

      <div className="flex-1">
        <Routes>

          {/* AUTH */}
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* DASHBOARD */}
          <Route path="/dashboard" element={<Dashboard />} />

          {/* TAGIHAN */}
          <Route path="/tagihan" element={<Tagihan />} />
          <Route path="/kategori-tagihan" element={<KategoriTagihan />} />
          <Route path="/rekap" element={<RekapTagihan />} />
          <Route path="/garoet" element={<TambahTagihan />} />

          {/* MASTER DATA */}
          <Route path="/Masterdata" element={<Masterdata />} />
          <Route path="/tambahdata" element={<Tambahdata />} />
          <Route path="/editdata/:id" element={<Edit />} />

          {/* KELAS */}
          <Route path="/kelas" element={<Kelas />} />
          <Route path="/Trht" element={<Trht />} />
          <Route path="/brngn/:id" element={<EditKelas />} />
          <Route path="/tkelas" element={<TambahKelas />} />
<Route path="/presensi" element={<PresensiPage />} />
<Route path="/Rekappresensi" element={<RekapPresensi />} />

          {/* Kategori Tagihan */}
          <Route path="/Ekategori/:id" element={<Ekategori />} />
          <Route path="/tmbh" element={<Tkategori />} />
<Route path="/kategori-data" element={<KategoriDataCRUD />} />
<Route path="/kategori-data/:id" element={<KategoriDataCRUD />} />

          {/* KATEGORI DATA */}
      
          <Route path="/kategori-data/tambah" element={<Tambahkategoridata />} />
          <Route path="/kategori-data/edit/:id" element={<Editkategoridata />} />

        </Routes>
      </div>
    </div>
  );
}
