import { useNavigate } from 'react-router-dom';
import Logo from './img/Logo.jpg';
import AgregarEvento from './AgregarEvento';
import './Calendario.css';

function CrearEventoVista() {
  const navigate = useNavigate();
  
  // 📌 Obtener rol del usuario desde localStorage
  const usuarioLocal = JSON.parse(localStorage.getItem("usuario"));
  const rolUsuario = usuarioLocal?.Rol || "docente";
  const nombreUsuario = usuarioLocal?.Name || "Usuario";

  return (
    <div className="calendario-layout">
      {/* 🟦 Barra lateral institucional */}
      <aside className="sidebar">
        <div className="logo-container">
          <img src={Logo} alt="Logo institucional" className="logo-img" />
          <hr className="logo-divider" />
        </div>

        <h2 className="rol-usuario">{rolUsuario === "docente" ? "Docente" : "Director"}</h2>

        <nav className="menu-navegacion">
          {/* 📌 Opciones según rol */}
          <button className="menu-btn" onClick={() => navigate("/vista-docente")}>
            📅 Calendario<br /><span>Vista mensual y diaria</span>
          </button>
          <button className="menu-btn activo" onClick={() => navigate("/agregar-evento")}>
            ➕ Crear evento<br /><span>Crear nuevo evento</span>
          </button>
          <button className="menu-btn" onClick={() => navigate("/buscar-filtrar")}>
            🔍 Buscar y filtrar<br /><span>Buscar un evento específico</span>
          </button>
          
          {/* 📌 Opciones solo para admin */}
          {rolUsuario?.toLowerCase() === "admin" && (
            <>
              <button className="menu-btn" onClick={() => navigate("/admin-panel")}>
                ⚙️ Panel Admin<br /><span>Usuarios y permisos</span>
              </button>
              <button className="menu-btn" onClick={() => navigate("/repositorio")}>
                📁 Repositorio<br /><span>Documento adjunto</span>
              </button>
            </>
          )}
        </nav>

        <div className="usuario-sidebar">
          <span>👤 {nombreUsuario} ({rolUsuario})</span>
          <button className="cerrar-sesion" onClick={() => {
            localStorage.removeItem("usuario");
            navigate("/login");
          }}>
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* 🟨 Área principal con el formulario */}
      <main className="contenido">
        <header className="encabezado">
          <h2>📝 Crear nuevo evento</h2>
        </header>

        <div className="formulario-evento">
          <AgregarEvento />
        </div>
      </main>
    </div>
  );
}

export default CrearEventoVista;
