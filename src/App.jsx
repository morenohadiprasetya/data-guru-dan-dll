import { Routes, Route } from 'react-router-dom';
import Sidnav from './sidnav';
import './App.css';

function App() {
  return (
    <Routes>
 
      <Route path="/" element={<Sidnav />} />
      <Route path="/Sidnav" element={<Sidnav />} />
    </Routes>
  );
}

export default App;
