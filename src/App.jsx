import { Routes, Route, useLocation } from "react-router-dom";
 import Sidnav from "./sidnav";
import Login from "./Login";
import Register from "./Register";
import Apo from "./Apo";
import Dashboard from "./Dashboard";
import Easteregg from "./Easteregg";
import "./App.css";

function App() {
  const location = useLocation();

 
  const hideSidnav = ["/", "/register"];
  const isHideSidnav = hideSidnav.includes(location.pathname);

  return (
    <div style={{ display: "flex" }}> 
      {!isHideSidnav && <Sidnav />}

      <div
        style={{
          flex: 1,
          marginLeft: !isHideSidnav ? "220px" : "0",
          padding: "20px",
          transition: "margin-left 0.3s ease",
        }}
      >
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/s" element={<Easteregg />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dash" element={<Dashboard />} />
          <Route path="/apo" element={<Apo />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
