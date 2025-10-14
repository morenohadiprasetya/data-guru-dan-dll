import { Routes, Route, useLocation } from "react-router-dom";
import Sidnav from "./sidnav";
import Login from "./Login";
import Register from "./Register";
import Apo from "./Apo";
import "./App.css";

function App() {
  const location = useLocation();
 
  const hideSidnav = ["/", "/register"];
  const isHideSidnav = hideSidnav.includes(location.pathname);

  return (
    <div style={{ display: "flex" }}>
      
      {!isHideSidnav && location.pathname === "/apo" && <Sidnav />}

   
      <div
        style={{
          flex: 1,
          marginLeft: !isHideSidnav && location.pathname === "/apo" ? "200px" : "0",
          padding: "20px",
        }}
      >
        <Routes>
         
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />

        
          <Route path="/apo" element={<Apo />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
