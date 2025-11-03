import { Routes, Route, useLocation } from "react-router-dom";
import Sidnav from "./sidnav";
import Login from "./Login";
import Register from "./Register";
import Apo from "./Tabeldata";
import Dashboard from "./Dashboard";
import Easteregg from "./Easteregg";
import TambahData from "./TambahData";
import Edit from "./Editdata";
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
          <Route path="/Apo" element={<Apo />} />
          <Route path="/s" element={<Easteregg />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
