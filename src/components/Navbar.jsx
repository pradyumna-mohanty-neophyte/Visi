import React from "react";
import logo from "./image/neo-icr.png";

function Navbar() {
  return (
    <>
      <div className="flex md:justify-between items-center py-0 px-8 justify-center shadow-xl relative">
        <div className="text-center text-2xl">
          <img src={logo} alt="Another Logo" className="h-13 w-60" />
        </div>
        <div className=" md:text-center md:text-4xl hidden md:flex absolute left-[45%]">
          Neometry
        </div>
      </div>
    </>
  );
}

export default Navbar;
