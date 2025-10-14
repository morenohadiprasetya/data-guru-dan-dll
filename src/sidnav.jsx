import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

export default function Sidnav() {
  const nav = useNavigate();

  const handleLogout = () => {
    Swal.fire({
      title: "Yakin ingin logout?",
      text: "Kamu akan kembali ke halaman login.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, Logout",
      cancelButtonText: "Batal",
      confirmButtonColor: "#1e3a8a",
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

  return (
    <div
      style={{
        width: "200px",
        background: "#1e3a8a",
        color: "#fff",
        minHeight: "100vh",
        padding: 20,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <div>
        <h3>Menu</h3>
        <Link to="/apo" style={{ color: "#fff", textDecoration: "none" }}>
          📋 Tabel Data
        </Link>
      </div>
      <button
        onClick={handleLogout}
        style={{
          background: "#dc2626",
          border: "none",
          padding: 10,
          borderRadius: 8,
          color: "#fff",
          cursor: "pointer",
        }}
      >
        🚪 Logout
      </button>
    </div>
  );
}
