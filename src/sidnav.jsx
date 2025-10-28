import React from "react";
import { Link } from "react-router-dom";
import "remixicon/fonts/remixicon.css";

function Sidnav() {
  return (
  <div className="fixed top-0 left-0 h-screen w-48 bg-blue-900 text-white flex flex-col justify-between shadow-lg z-50">

      <div>
        <h2 className="text-lg font-bold text-center py-4 border-b border-blue-700">
          <i className="ri-menu-line mr-2"></i>MENU
        </h2>
        <nav className="flex flex-col mt-4 space-y-2 px-4">
          <Link
            to="/Dashboard"
            className="flex items-center gap-2 hover:bg-blue-800 rounded-md px-3 py-2 transition"
          >
            <i className="ri-dashboard-3-line text-xl"></i>
            Dashboard
          </Link>
          <Link
            to="/Apo"
            className="flex items-center gap-2 hover:bg-blue-800 rounded-md px-3 py-2 transition"
          >
            <i className="ri-table-line text-xl"></i>
            Tabel Data
          </Link>
        </nav>
      </div>
      <div className="p-4">
        <button className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white w-full py-2 rounded-md transition">
          <i className="ri-logout-box-r-line text-xl"></i>
          Logout
        </button>
      </div>
    </div>
  );
}

export default Sidnav;
