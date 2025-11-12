import { Routes, Route, useLocation } from "react-router-dom";

import Sidnav from "./Komponen/Sidnav";
import Dashboard from "./Komponen/Dashboard";

import Tagihan from "./pages/Tagihan/tagihan";
import KategoriTagihan from "./pages/Tagihan/kategoritagihan";
import RekapTagihan from "./pages/Tagihan/rekaptagihan";

import Login from "./Komponen/Login";
import Register from "./Komponen/Register";

import Masterdata from "./pages/masterdata/Masterdata";
import Ambatigori from "./pages/data/Ambatigori";
import Tambahkategoridata from "./pages/data/tambahkategorid";
import Edit from "./pages/masterdata/Editdata";
import Tambahdata from "./pages/masterdata/TambahData"; // Pastikan ini konsisten

export default function App() {
  const loc = useLocation();
  const hide = ["/", "/register"];

  return (
    <div className="flex min-h-screen bg-gray-100">
      {!hide.includes(loc.pathname) && <Sidnav />}
      <div className="flex-1">
        <Routes>
          {/* Auth */}
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Dashboard */}
          <Route path="/dashboard" element={<Dashboard />} />

          {/* Tagihan */}
          <Route path="/tagihan" element={<Tagihan />} />
          <Route path="/kategori-tagihan" element={<KategoriTagihan />} />
          <Route path="/rekap" element={<RekapTagihan />} />

          {/* Data */}
          <Route path="/kategoril" element={<Ambatigori />} />
          <Route path="/apo" element={<Masterdata />} />
          <Route path="/tambahdata" element={<Tambahdata />} /> {/* Perbaiki penamaan */}
          <Route path="/tambahkategori" element={<Tambahkategoridata />} />
        </Routes>
      </div>
    </div>
  );
}
