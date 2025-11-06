import { Routes, Route, useLocation } from "react-router-dom";
import Sidnav from "./Sidnav";
import Login from "./Login";
import Register from "./Register";
import Data from "./data";
import Dashboard from "./Dashboard";
import Easteregg from "./Easteregg";
import TambahData from "./TambahData";
import Edit from "./Editdata";
 import Masterdata from "./masterdata";
import Kelas from "./Kelas";
import Tagihan from "./tagihan";
import KategoriTagihan from "./kategoritagihan";
import RekapTagihan from "./rekaptagihan";
import "./App.css";

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
          <Route path="/Edit" element={<Edit />} />
          <Route path="/Ta" element={<TambahData />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/apo" element={<Data />} />
          <Route path="/kategori" element={<KategoriTagihan />} />
          <Route path="/s" element={<Easteregg />} />
          <Route path="/rekap" element={<RekapTagihan />} />
        
          <Route path="/kelas" element={<Kelas />} />
          <Route path="/masterData" element={<Masterdata />} />
          <Route path="/tagihan" element={<Tagihan />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
