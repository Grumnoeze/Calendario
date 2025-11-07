import { useNavigate } from 'react-router-dom';
import Logo from './img/Logo.jpg';
import './repositorio.css';

function Repositorio() {
  const navigate = useNavigate();

  return (
    <div className="repositorio-layout">
      {/* 🟦 Barra lateral institucional */}
      <aside className="sidebar">
        <div className="logo-container">
          <img src={Logo} alt="Logo institucional" className="logo-img" />
          <hr className="logo-divider" />
        </div>

        <h2 className="rol-usuario">Director</h2>

        <nav className="menu-navegacion">
          <button className="menu-btn" onClick={() => navigate("/calendario")}>
            📅 Calendario<br /><span>Vista mensual y diaria</span>
          </button>
          <button className="menu-btn" onClick={() => navigate("/agregar-evento")}>
            ➕ Crear evento<br /><span>Crear nuevo evento</span>
          </button>
          <button className="menu-btn" onClick={() => navigate("/buscar-filtrar")}>
            🔍 Buscar y filtrar<br /><span>Buscar un evento específico</span>
          </button>
          <button className="menu-btn" onClick={() => navigate("/admin-panel")}>
            ⚙️ Panel Admin<br /><span>Usuarios y permisos</span>
          </button>
          <button className="menu-btn activo" onClick={() => navigate("/repositorio")}>
            📁 Repositorio<br /><span>Documento adjunto</span>
          </button>
        </nav>

        <div className="usuario-sidebar">
          <span>👤 Pablo Gómez (admin)</span>
          <button className="cerrar-sesion" onClick={() => {
            localStorage.removeItem("usuario");
            navigate("/login");
          }}>
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* 🟨 Panel horizontal: filtros + tarjetas */}
      <main className="repositorio-panel">
        <section className="repositorio-superior">
          <div className="filtros-repositorio">
            <input
              type="text"
              placeholder="🔍 Buscar documentos por nombre o evento..."
              className="input-busqueda"
            />

            <div className="grupo-filtros">
              <select className="filtro-select">
                <option value="">📂 Todas las dimensiones</option>
                <option value="tecnico">🛠️ Técnico-Administrativa</option>
                <option value="pedagogico">📘 Pedagógico-Didáctica</option>
                <option value="socio">🤝 Socio-Comunitaria</option>
              </select>

              <select className="filtro-select">
                <option value="">📚 Materia</option>
                <option value="matematica">➗ Matemática</option>
                <option value="lengua">📖 Lengua</option>
                <option value="educacion">🏃 Educación Física</option>
              </select>
            </div>
          </div>

          <div className="lista-documentos">
            <h3>📄 Documentos (3)</h3>

            <div className="tarjeta-documento">
              <div className="documento-info">
                <span className="etiqueta tecnico">🛠️ Técnico-Administrativa</span>
                <h4>Nombre archivo.pdf</h4>
                <p>📅 Evento: Reunión de Personal Docente</p>
                <p>📚 Materia(s): Matemática</p>
                <p>🗓️ Fecha: 01/11/2025</p>
                <p>📦 Tamaño: 3 MB | Tipo: PDF</p>
              </div>
              <button className="btn-descargar">⬇️ Descargar</button>
            </div>

            <div className="tarjeta-documento">
              <div className="documento-info">
                <span className="etiqueta socio">🤝 Socio-Comunitaria</span>
                <h4>Nombre archivo.pdf</h4>
                <p>📅 Evento: Reunión de Personal Docente</p>
                <p>📚 Materia(s): Lengua</p>
                <p>🗓️ Fecha: 01/11/2025</p>
                <p>📦 Tamaño: 3 MB | Tipo: PDF</p>
              </div>
              <button className="btn-descargar">⬇️ Descargar</button>
            </div>

            <div className="tarjeta-documento">
              <div className="documento-info">
                <span className="etiqueta pedagogico">📘 Pedagógico-Didáctica</span>
                <h4>Nombre archivo.pdf</h4>
                <p>📅 Evento: Reunión de Personal Docente</p>
                <p>📚 Materia(s): Educación Física</p>
                <p>🗓️ Fecha: 01/11/2025</p>
                <p>📦 Tamaño: 3 MB | Tipo: PDF</p>
              </div>
              <button className="btn-descargar">⬇️ Descargar</button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Repositorio;
