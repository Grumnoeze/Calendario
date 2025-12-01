import { useState } from "react";
import Sidebar from "./Sidebar";
import "./Layouts.css";
import { Outlet } from "react-router-dom";


export default function Layouts() {
  const [sidebarColapsada, setSidebarColapsada] = useState(false);


  return (
    <div className={`layout-wrapper ${sidebarColapsada ? "colapsado" : ""}`}>
      <button
        className="toggle-sidebar-btn"
        onClick={() => setSidebarColapsada(!sidebarColapsada)}
      >
        {sidebarColapsada ? "☰" : "✖"}
      </button>


      <Sidebar sidebarColapsada={sidebarColapsada} />


      <div className="contenido">
        <Outlet />
      </div>
    </div>
  );
}