import { Routes, Route, useLocation } from "react-router-dom";
import Sidnav from "./Komponen/sidnav";
import Login from "./Komponen/Login";
 import Register from "./Komponen/Register"
import Dashboard from "./Komponen/Dashboard";
import Easteregg from "./Easteregg";
import TambahData from "./pages/masterdata/TambahData";
import Edit from "./pages/masterdata/Editdata";
//  import Masterdata from "./pages/tagihan/database/masterdata";
import Kelas from "./Kelas";
import Tagihan from "./pages/Tagihan/tagihan";
import KategoriTagihan from "./pages/Tagihan/kategoritagihan";
import RekapTagihan from "./pages/Tagihan/rekaptagihan";
import "./App.css";
import TabelDataPegawai from "./pages/masterdata/Masterdata";
import TabelLevel from "./pages/kategori data/kategoridata";
import TambahLevel from "./pages/kategori data/tambahkategorid";
import EditLevel from "./pages/kategori data/editkategorid";

function App() {
  const location = useLocation();

  const hideSidnav = ["/", "/register", "/s"];
  const isHideSidnav = hideSidnav.includes(location.pathname);

  return (
    <div className="flex">
      {!isHideSidnav && <Sidnav />}

      <div className="flex-1 min-h-screen">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/Edit/:id" element={<Edit />} />
          <Route path="/Tambahdata" element={<TambahData />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/apo" element={<TabelDataPegawai />} />
          <Route path="/kategori" element={<KategoriTagihan />} />
          <Route path="/s" element={<Easteregg />} />
          <Route path="/rekap" element={<RekapTagihan />} />
        
          <Route path="/kelas" element={<Kelas />} />
          <Route path="/tagihan" element={<Tagihan />} />
          {/* kategori data */}
          <Route path="/kategoril" element={<TabelLevel />} />
          <Route path="/tambahkategoril" element={<TambahLevel />} />
          <Route path="/editkategoril/:id" element={<EditLevel />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
