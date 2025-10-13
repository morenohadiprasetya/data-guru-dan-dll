import { Routes, Route } from 'react-router-dom';
import Sidnav from './sidnav';
import Login from './Login';
import Register from './Register' 
import Apo from './Apo';  

import './App.css';

function App() {
  return (
    <Routes>
      <Route path="/apo" element={<Apo />} />
         <Route path="/" element={<Login />} />
      <Route path="/sidnav" element={<Sidnav />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
}

export default App;
