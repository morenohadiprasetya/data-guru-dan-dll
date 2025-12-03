import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "remixicon/fonts/remixicon.css";

export default function Sidnav() {
  const navigate = useNavigate();
  const location = useLocation();

  // Pisah state
  const [openDatabase, setOpenDatabase] = useState(false);
  const [openKeuangan, setOpenKeuangan] = useState(false);

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

  const isActive = (path) =>
    location.pathname === path
      ? "bg-blue-700 text-white shadow-md"
      : "text-blue-100 hover:bg-blue-800 hover:text-white";

  return (
    <div className="fixed top-0 left-0 h-screen w-56 bg-blue-900/95 backdrop-blur-xl 
                    text-white shadow-2xl border-r border-blue-800 flex flex-col justify-between z-50 transition-all">

      {/* HEADER */}
      <div>
        <div
          onClick={() => navigate("/")}
          className="flex items-center justify-center gap-2 text-xl font-bold py-4 
                     bg-blue-800/40 hover:bg-blue-700/40 transition cursor-pointer border-b border-blue-700"
        >
          <i className="ri-menu-line text-2xl"></i>
          MENU
        </div>

        <nav className="flex flex-col mt-4 px-3 space-y-2">

          {/* DASHBOARD */}
          <Link
            to="/dashboard"
            className={`flex items-center gap-3 px-4 py-2 text-white rounded-lg transition-all ${isActive("/dashboard")}`}
          >
            <i className="ri-dashboard-2-line text-xl"></i>
            Dashboard
          </Link>

          {/* DATABASE */}
          <button
            onClick={() => setOpenDatabase(!openDatabase)}
            className="flex justify-between items-center px-4 py-2 rounded-lg hover:bg-blue-800 transition"
          >
            <span className="flex items-center gap-3">
              <i className="ri-folder-2-line text-xl"></i>
              Database
            </span>
            <i className={`ri-arrow-down-s-line transition-transform ${openDatabase ? "rotate-180" : ""}`}></i>
          </button>

          {openDatabase && (
            <div className="ml-7 mt-1 flex flex-col gap-1 text-sm animate-slideFade">

              <Link to="/kategori-data" className="py-1 flex items-center gap-2 text-white hover:text-blue-200">
                <i className="ri-price-tag-3-line"></i> Kategori Data
              </Link>

              <Link to="/kelas" className="py-1 flex items-center gap-2 text-white hover:text-blue-200">
                <i className="ri-building-2-line"></i> Kelas
              </Link>

              <Link to="/Masterdata" className="py-1 flex items-center gap-2 text-white hover:text-blue-200">
                <i className="ri-user-3-line"></i> Masterdata
              </Link>

            </div>
          )}

          {/* KEUANGAN */}
          <button
            onClick={() => setOpenKeuangan(!openKeuangan)}
            className="flex justify-between items-center px-4 py-2 rounded-lg text-blue-100 
                       hover:bg-blue-800 transition"
          >
            <span className="flex items-center gap-3">
              <i className="ri-money-dollar-circle-line text-xl"></i>
              Keuangan
            </span>
            <i className={`ri-arrow-down-s-line transition-transform ${openKeuangan ? "rotate-180" : ""}`}></i>
          </button>

          {openKeuangan && (
            <div className="ml-7 mt-1 flex flex-col gap-1 text-sm animate-slideFade">

              <Link to="/kategori-tagihan" className="py-1 flex items-center gap-2 text-white hover:text-blue-200">
                <i className="ri-list-check-2"></i> Kategori Tagihan
              </Link>

              <Link to="/tagihan" className="py-1 flex items-center gap-2 text-white hover:text-blue-200">
                <i className="ri-receipt-line"></i> Tagihan
              </Link>

              <Link to="/rekap" className="py-1 flex items-center gap-2 text-white hover:text-blue-200">
                <i className="ri-bar-chart-box-line"></i> Rekap Tagihan
              </Link>
              <Link to="/presensi" className="py-1 flex items-center gap-2 text-white hover:text-blue-200">
              <i className="ri-calendar-check-line"></i>
 Presensi
              </Link>

            </div>
          )}

        </nav>
      </div>

      {/* LOGOUT */}
      <div className="p-4 rounded">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 bg-red-600 
                     hover:bg-red-700 transition text-white py-2 rounded shadow-md"
        >
          <i className="ri-logout-box-r-line text-xl"></i>
          Logout
        </button>
      </div>
    </div>
  );
}
