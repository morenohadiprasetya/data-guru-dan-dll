import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "remixicon/fonts/remixicon.css";

export default function Sidnav() {
  const navigate = useNavigate();
  const [openMenu, setOpenMenu] = useState(null);

  const toggleMenu = (menu) => setOpenMenu(openMenu === menu ? null : menu);

  const handleLogout = () => {
    Swal.fire({
      title: "Yakin ingin logout?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, logout",
      cancelButtonText: "Batal",
    }).then((res) => {
      if (res.isConfirmed) navigate("/");
    });
  };

  return (
    <div className="fixed top-0 left-0 h-screen w-48 bg-blue-900 text-white flex flex-col justify-between shadow-lg z-50">
      <div>
        <h2 className="text-lg font-bold text-center py-4 border-b border-blue-700 cursor-pointer hover:bg-blue-800 transition" onClick={() => navigate("/")}>
          <i className="ri-menu-line mr-2"></i>MENU
        </h2>
        <nav className="flex flex-col mt-4 space-y-2 px-3">
          <Link to="/Dashboard" className="flex items-center gap-2 bg-blue-800 hover:bg-blue-700 rounded-md px-3 py-2 transition">
            <i className="ri-dashboard-3-line text-xl"></i> Dashboard
          </Link>

          <button onClick={() => toggleMenu("database")} className="flex justify-between items-center px-3 py-2 hover:bg-blue-800 rounded-md transition">
            <div className="flex items-center gap-2"><i className="ri-database-2-line"></i> Database</div>
            <span>{openMenu === "database" ? "▲" : "▼"}</span>
          </button>
          {openMenu === "database" && (
            <div className="flex flex-col ml-6 mt-1">
              <Link to="/apo" className="py-1 hover:text-blue-200">Kategori Data</Link>
              <Link to="/kelas" className="py-1 hover:text-blue-200">Kelas</Link>
              <Link to="/masterdata" className="py-1 hover:text-blue-200">Masterdata</Link>
            </div>
          )}

          <button onClick={() => toggleMenu("keuangan")} className="flex justify-between items-center px-3 py-2 hover:bg-blue-800 rounded-md transition">
            <div className="flex items-center gap-2"><i className="ri-money-dollar-circle-line"></i> Keuangan</div>
            <span>{openMenu === "keuangan" ? "▲" : "▼"}</span>
          </button>
          {openMenu === "keuangan" && (
            <div className="flex flex-col ml-6 mt-1">
              <Link to="/kategori-tagihan" className="py-1 hover:text-blue-200">Kategori Tagihan</Link>
              <Link to="/tagihan" className="py-1 hover:text-blue-200">Tagihan</Link>
              <Link to="/rekap-tagihan" className="py-1 hover:text-blue-200">Rekap Tagihan</Link>
            </div>
          )}
        </nav>
      </div>

      <div className="p-4">
        <button onClick={handleLogout} className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white w-full py-2 rounded-md transition">
          <i className="ri-logout-box-r-line"></i> Logout
        </button>
      </div>
    </div>
  );
}
