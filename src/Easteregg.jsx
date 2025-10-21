import React from "react";
import kiw from "../public/kiw.png"; // atau "/Kepp.jpg" kalau di public

const Easteregg = () => {
  return (
    <div className="flex items-center justify-center w-screen h-screen bg-black overflow-hidden">
      <img
        src={kiw}
        alt="Easteregg"
        className="max-w-full max-h-full object-contain"
      />
    </div>
  );
};

export default Easteregg;
