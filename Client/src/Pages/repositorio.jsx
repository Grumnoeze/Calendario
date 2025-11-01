// Importamos useNavigate para redireccionar entre vistas
import { useNavigate } from 'react-router-dom';

// Importamos el logo institucional desde la carpeta img
import Logo from './img/Logo.jpg';

// Importamos los estilos específicos para esta vista
import './repositorio.css';

// Componente principal del Repositorio
function Repositorio() {
  // Hook para redireccionar entre rutas
  const navigate = useNavigate();

  // Render del componente
  return (
    <div className="repositorio-layout">
      {/* 🟦 Barra lateral institucional */}
      <aside className="sidebar">
        <div className="logo-container">
          {/* Logo institucional */}
          <img src={Logo} alt="Logo institucional" className="logo-img" />
          <hr className="logo-divider" />
        </div>

        {/* Rol del usuario (puede cambiar dinámicamente si se desea) */}
        <h2 className="rol-usuario">Director</h2>

        {/* Menú de navegación lateral */}
        <nav className="menu-navegacion">
          <button className="menu-btn" onClick={() => navigate("/calendario")}>
            Calendario<br /><span>Vista mensual y diaria</span>
          </button>
          <button className="menu-btn" onClick={() => navigate("/agregar-evento")}>
            Crear evento<br /><span>Crear nuevo evento</span>
          </button>
          <button className="menu-btn" onClick={() => navigate("/buscar-filtrar")}>
            Buscar y filtrar<br /><span>Buscar un evento específico</span>
          </button>
          <button className="menu-btn" onClick={() => navigate("/admin-panel")}>
            Gestión de usuarios<br /><span>Usuarios y permisos</span>
          </button>
          <button className="menu-btn activo" onClick={() => navigate("/repositorio")}>
            Repositorio<br /><span>Documento adjunto</span>
          </button>
        </nav>
      </aside>

      {/* 🟨 Panel horizontal: filtros + tarjetas */}
      <main className="repositorio-panel">
        <section className="repositorio-superior">
          {/* 🔍 Filtros de búsqueda */}
          <div className="filtros-repositorio">
            {/* Campo de búsqueda por nombre o evento */}
            <input
              type="text"
              placeholder="Buscar documentos por nombre o evento..."
              className="input-busqueda"
            />

            {/* Selectores de dimensión y materia */}
            <div className="grupo-filtros">
              <select className="filtro-select">
                <option value="">Todas las dimensiones</option>
                <option value="tecnico">Técnico-Administrativa</option>
                <option value="pedagogico">Pedagógico-Didáctica</option>
                <option value="socio">Socio-Comunitaria</option>
              </select>

              <select className="filtro-select">
                <option value="">Materia</option>
                <option value="matematica">Matemática</option>
                <option value="lengua">Lengua</option>
                <option value="educacion">Educación Física</option>
              </select>
            </div>
          </div>

          {/* 📄 Tarjetas de documentos */}
          <div className="lista-documentos">
            <h3>Documentos (3)</h3>

            {/* Tarjeta 1 */}
            <div className="tarjeta-documento">
              <div className="documento-info">
                <span className="etiqueta tecnico">Técnico-Administrativa</span>
                <h4>Nombre archivo.pdf</h4>
                <p>Evento: Reunión de Personal Docente</p>
                <p>Materia(s): Matemática</p>
                <p>Fecha: 01/11/2025</p>
                <p>Tamaño: 3 MB | Tipo: PDF</p>
              </div>
              <button className="btn-descargar">Descargar</button>
            </div>

            {/* Tarjeta 2 */}
            <div className="tarjeta-documento">
              <div className="documento-info">
                <span className="etiqueta socio">Socio-Comunitaria</span>
                <h4>Nombre archivo.pdf</h4>
                <p>Evento: Reunión de Personal Docente</p>
                <p>Materia(s): Lengua</p>
                <p>Fecha: 01/11/2025</p>
                <p>Tamaño: 3 MB | Tipo: PDF</p>
              </div>
              <button className="btn-descargar">Descargar</button>
            </div>

            {/* Tarjeta 3 */}
            <div className="tarjeta-documento">
              <div className="documento-info">
                <span className="etiqueta pedagogico">Pedagógico-Didáctica</span>
                <h4>Nombre archivo.pdf</h4>
                <p>Evento: Reunión de Personal Docente</p>
                <p>Materia(s): Educación Física</p>
                <p>Fecha: 01/11/2025</p>
                <p>Tamaño: 3 MB | Tipo: PDF</p>
              </div>
              <button className="btn-descargar">Descargar</button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

// Exportamos el componente para que pueda usarse en otras vistas
export default Repositorio;
