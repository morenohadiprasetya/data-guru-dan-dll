import { Link, useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

export default function Sidnav() {
  const nav = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    Swal.fire({
      title: "Yakin ingin logout?",
      text: "Kamu akan kembali ke halaman login.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, Logout",
      cancelButtonText: "Batal",
      confirmButtonColor: "#2563eb",
      cancelButtonColor: "#dc2626",
    }).then((r) => {
      if (r.isConfirmed) {
        Swal.fire({
          title: "Berhasil Logout!",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
        setTimeout(() => nav("/"), 1500);
      }
    });
  };

  
  const isActive = (path) =>
    location.pathname === path
      ? { background: "#2563eb", padding: "10px", borderRadius: "8px" }
      : {};

  return (
    <div
      style={{
        width: "220px",
        background: "#1e3a8a",
        color: "#fff",
        minHeight: "100vh",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        boxShadow: "2px 0 10px rgba(0,0,0,0.1)",
      }}
    >
       
      <div>
        <h2 style={{ marginBottom: "30px", textAlign: "center" }}>📊 MENU</h2>

        <nav style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          <Link
            to="/dash"
            style={{
              color: "#fff",
              textDecoration: "none",
              ...isActive("/dash"),
            }}
          >
            🏠 Dashboard
          </Link>

          <Link
            to="/apo"
            style={{
              color: "#fff",
              textDecoration: "none",
              ...isActive("/apo"),
            }}
          >
            📋 Tabel Data
          </Link>
        </nav>
      </div>

     
      <button
        onClick={handleLogout}
        style={{
          background: "#dc2626",
          border: "none",
          padding: "10px",
          borderRadius: "8px",
          color: "#fff",
          cursor: "pointer",
          fontWeight: "bold",
          transition: "0.3s",
        }}
        onMouseEnter={(e) => (e.target.style.background = "#b91c1c")}
        onMouseLeave={(e) => (e.target.style.background = "#dc2626")}
      >
        🚪 Logout
      </button>
    </div>
  );
}
