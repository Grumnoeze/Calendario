import { useNavigate, useLocation } from "react-router-dom";
import Logo from "../Pages/img/logo2.png";
import "./Sidebar.css";


export default function Sidebar({ sidebarColapsada }) {
const navigate = useNavigate();
const location = useLocation();
const usuario = JSON.parse(localStorage.getItem("usuario"));


const menu = [
{ path: "/calendario", icon: "📅", txt: "Calendario" },
{ path: "/agregar-evento", icon: "➕", txt: "Crear evento" },
{ path: "/buscar-filtrar", icon: "🔍", txt: "Buscar y filtrar" },
{ path: "/admin-panel", icon: "⚙️", txt: "Panel Admin" },
{ path: "/repositorio", icon: "📁", txt: "Repositorio" },
];


return (
<aside className={`sidebar ${sidebarColapsada ? "colapsada" : ""}`}>
{!sidebarColapsada && (
<div className="logo-container">
<img src={Logo} className="logo-img" />
<hr />
</div>
)}


{!sidebarColapsada && <h2 className="rol-usuario">{usuario?.Rol}</h2>}


<nav className="menu-navegacion">
{menu.map((item) => (
<button
key={item.path}
className={`menu-btn ${location.pathname === item.path ? "activo" : ""}`}
onClick={() => navigate(item.path)}
>
{item.icon} {!sidebarColapsada && item.txt}
</button>
))}
</nav>


<div className="usuario-sidebar">
{!sidebarColapsada && (
<span>{usuario?.Name} ({usuario?.Rol?.toLowerCase()})</span>
)}


<button className="cerrar-sesion" onClick={() => {
localStorage.removeItem("usuario");
localStorage.removeItem("token");
navigate("/login");
}}>
Cerrar sesión
</button>
</div>
</aside>
);
}