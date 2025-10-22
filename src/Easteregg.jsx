import React from "react";
import video1 from "../public/ssstik.io_@batagor100k_1761116756727.mp4";
import video2 from "../public/ssstik.io_@vierifers_1761117485998.mp4";
import video3 from "../public/ssstik.io_@thug_hunter123_1761117808891.mp4";

const Easteregg = () => {
  return (
    <div className="flex flex-row items-center justify-center w-screen h-screen bg-black overflow-x-auto p-4 space-x-4">
      <video
        src={video1}
        autoPlay
        loop
        muted
        playsInline
        className="max-h-[70vh] object-contain rounded-lg"
      />
      <video
        src={video2}
        autoPlay
        loop
        muted
        playsInline
        className="max-h-[70vh] object-contain rounded-lg"
      />
      <video
        src={video3}
        autoPlay
        loop
        muted
        playsInline
        className="max-h-[70vh] object-contain rounded-lg"
      />
    </div>
  );
};

export default Easteregg;
