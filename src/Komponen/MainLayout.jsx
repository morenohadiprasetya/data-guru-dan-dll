import React from "react";
import Sidnav from "./sidnav";
import Dashboard from "./Dashboard";  
export default function MainLayout() {
  return (
    <div className="flex">
      
      <Sidnav />

    
      <div className="flex-1 ml-48 p-6 bg-gradient-to-b from-blue-50 to-white min-h-screen overflow-auto">
        <Dashboard />
      </div>
    </div>
  );
}
