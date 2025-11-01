import { useNavigate } from 'react-router-dom';
import Logo from './img/Logo.jpg';
import './BuscarYFiltrar.css';

function BuscarYFiltrar() {
  const navigate = useNavigate();

  return (
    <div className="buscar-filtrar-layout">
      <aside className="sidebar">
        <div className="logo-container">
          <img src={Logo} alt="Logo institucional" className="logo-img" />
          <hr className="logo-divider" />
        </div>

        <h2 className="rol-usuario">Director</h2>

        <nav className="menu-navegacion">
          <button className="menu-btn" onClick={() => navigate("/calendario")}>
            Calendario<br /><span>Vista mensual y diaria</span>
          </button>
          <button className="menu-btn" onClick={() => navigate("/agregar-evento")}>
            Crear evento<br /><span>Crear nuevo evento</span>
          </button>
          <button className="menu-btn activo" onClick={() => navigate("/buscar-filtrar")}>
            Buscar y filtrar<br /><span>Buscar un evento específico</span>
          </button>
          <button className="menu-btn" onClick={() => navigate("/admin-panel")}>
            Gestión de usuarios<br /><span>Usuarios y permisos</span>
          </button>
          <button className="menu-btn" onClick={() => navigate("/repositorio")}>
            Repositorio<br /><span>Documento adjunto</span>
          </button>
        </nav>
      </aside>

      <main className="contenido">
        <h2 className="titulo-vista">🔍 Buscar Evento</h2>

        <section className="filtros-busqueda">
          <input type="text" placeholder="Buscar por título, descripción o palabra clave..." className="input-busqueda" />

          <div className="grupo-filtros">
            <select className="filtro-select">
              <option value="">Todas las dimensiones</option>
              <option value="técnica">Técnica</option>
              <option value="administrativa">Administrativa</option>
            </select>

            <select className="filtro-select">
              <option value="">Cualquier fecha</option>
              <option value="hoy">Hoy</option>
              <option value="esta-semana">Esta semana</option>
              <option value="este-mes">Este mes</option>
            </select>

            <select className="filtro-select">
              <option value="">Cualquier responsable</option>
              <option value="docente">Docente</option>
              <option value="director">Director</option>
            </select>

            <button className="btn-limpiar">Limpiar Filtros</button>
          </div>
        </section>

        <section className="resultados-busqueda">
          <h3>Resultado de Búsqueda</h3>

          <div className="tarjeta-evento">
            <div className="evento-info">
              <h4>Reunión de Personal Docente</h4>
              <p>Todas las reuniones del personal docente</p>
              <span className="evento-rango">2 años - 0 veces</span>
              <span className="evento-tag">Técnica - administrativa</span>
            </div>
            <div className="evento-acciones">
              <button className="btn-detalle">Ver detalle</button>
              <button className="btn-editar">Editar</button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default BuscarYFiltrar;
