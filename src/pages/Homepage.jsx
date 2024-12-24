import React from "react";
import Navbar from "../components/Navbar";
// import Home from '../components/Home'
import Home2 from "../components/Home2";

export default function Homepage() {
  return (
    <div className=" flex-col w-screen">
      <Navbar />
      <Home2 />
    </div>
  );
}
