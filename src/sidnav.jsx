import { Link } from "react-router-dom";

function Sidnav() {
  return (
    <div
      style={{
        width: "200px",
        background: "#1E3A8A",
        color: "white",
        height: "100vh",
        padding: "20px",
        position: "fixed",
        top: 0,
        left: 0,
      }}
    >
      <h3>Menu</h3>
      <ul style={{ listStyle: "none", padding: 0 }}>
        <li>
          <Link to="/apo" style={{ color: "white", textDecoration: "none" }}>
            Tabel data
          </Link>
        </li>
      </ul>
    </div>
  );
}

export default Sidnav;
