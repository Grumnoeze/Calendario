import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Logo from './img/Logo.jpg';
import './BuscarYFiltrar.css';

function BuscarYFiltrar() {
  const navigate = useNavigate();
  const [eventos, setEventos] = useState([]);
  const [eventosCalendario, setEventosCalendario] = useState([]);
  const [menuDesplegableAbierto, setMenuDesplegableAbierto] = useState(false);

  // 📌 Obtener rol del usuario desde localStorage
  const usuarioLocal = JSON.parse(localStorage.getItem("usuario"));
  const rolUsuario = usuarioLocal?.Rol || "docente";
  const nombreUsuario = usuarioLocal?.Name || "Usuario";
  const esAdminODocente = rolUsuario.toLowerCase() === "admin" || rolUsuario.toLowerCase() === "docente";
  const esAdmin = rolUsuario.toLowerCase() === "admin";

  const [filtros, setFiltros] = useState({
    texto: '',
    dimension: '',
    asignadoA: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFiltros({ ...filtros, [name]: value });
  };

  const limpiarFiltros = () => {
    setFiltros({ texto: '', dimension: '', asignadoA: '' });
    setEventos([]);
  };

  const irAlEvento = (eventoId) => {
    navigate('/calendario', { state: { eventoId } });
  };

  useEffect(() => {
    const buscarEventos = async () => {
      try {
        const params = new URLSearchParams(filtros);
        const res = await axios.get(`http://localhost:3000/api/filtrarEventos?${params}`);
        setEventos(res.data);
      } catch (error) {
        console.error("❌ Error al buscar eventos:", error);
      }
    };
    buscarEventos();
  }, [filtros]);

  useEffect(() => {
    axios.get('http://localhost:3000/api/listarEventos')
      .then(res => {
        const eventosFormateados = res.data.map(ev => ({
          id: ev.Id,
          title: ev.Titulo,
          start: `${ev.FechaInicio}T${ev.HoraInicio}`,
          end: `${ev.FechaFin}T${ev.HoraFin}`,
        }));
        setEventosCalendario(eventosFormateados);
      })
      .catch(() => console.error("Error al cargar eventos"));
  }, []);

  return (
    <div className="buscar-filtrar-layout">
      <aside className="sidebar">
        <div className="logo-container">
          <img src={Logo} alt="Logo institucional" className="logo-img" />
          <hr className="logo-divider" />
        </div>

        <h2 className="rol-usuario">{rolUsuario === "docente" ? "Docente" : "Director"}</h2>

        <nav className="menu-navegacion">
          <button className="menu-btn" onClick={() => navigate("/vista-docente")}>
            📅 Calendario<br /><span>Vista mensual y diaria</span>
          </button>

          <button className="menu-btn" onClick={() => navigate("/agregar-evento")}>
            ➕ Crear evento<br /><span>Crear nuevo evento</span>
          </button>

          <button className="menu-btn activo" onClick={() => navigate("/buscar-filtrar")}>
            🔍 Buscar y filtrar<br /><span>Buscar un evento específico</span>
          </button>

          {/* 📌 Panel Admin y Repositorio: Solo para Admin */}
          {esAdmin && (
            <>
              <button className="menu-btn" onClick={() => navigate("/admin-panel")}>
                ⚙️ Panel Admin<br /><span>Usuarios y permisos</span>
              </button>

              <button className="menu-btn" onClick={() => navigate("/repositorio")}>
                📁 Repositorio<br /><span>Documento adjunto</span>
              </button>
            </>
          )}

          {/* 📌 MENÚ DESPLEGABLE */}
          <div className="menu-desplegable-wrapper">
            <button 
              className="menu-btn menu-desplegable-toggle" 
              onClick={() => setMenuDesplegableAbierto(!menuDesplegableAbierto)}
            >
              📋 Eventos<br /><span>Ver y editar eventos</span>
              <span className={`chevron ${menuDesplegableAbierto ? 'abierto' : ''}`}>▼</span>
            </button>
            
            {menuDesplegableAbierto && (
              <div className="menu-desplegable-contenido">
                {eventosCalendario.length === 0 ? (
                  <div className="desplegable-vacio">
                    <p>No hay eventos</p>
                  </div>
                ) : (
                  <ul className="eventos-lista">
                    {eventosCalendario.slice(0, 5).map(ev => (
                      <li key={ev.id} className="evento-item">
                        <div className="evento-item-info">
                          <p className="evento-item-titulo">{ev.title}</p>
                          <span className="evento-item-fecha">{new Date(ev.start).toLocaleDateString()}</span>
                        </div>

                        <div className="evento-item-acciones">
                          <button 
                            className="btn-item-ver"
                            onClick={() => {
                              irAlEvento(ev.id);
                              setMenuDesplegableAbierto(false);
                            }}
                          >
                            👁️
                          </button>

                          <button 
                            className="btn-item-editar"
                            onClick={() => navigate("/agregar-evento")}
                          >
                            ✏️
                          </button>

                          {/* 📌 NUEVO: BOTÓN VISUAL “ELIMINAR EVENTO” */}
                          {esAdminODocente && (
                            <button 
                              className="btn-item-eliminar"
                              title="Eliminar evento (visual)"
                            >
                              🗑️
                            </button>
                          )}

                        </div>
                      </li>
                    ))}
                  </ul>
                )}

                {eventosCalendario.length > 5 && (
                  <div className="desplegable-footer">
                    <button className="btn-ver-todos" onClick={() => navigate("/buscar-filtrar")}>
                      Ver todos los eventos →
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </nav>

        <div className="usuario-sidebar">
          <span>{nombreUsuario} ({rolUsuario})</span>
          <button className="cerrar-sesion" onClick={() => {
            localStorage.removeItem("usuario");
            navigate("/login");
          }}>
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* 🔍 CONTENIDO PRINCIPAL */}
      <main className="contenido">
        <h2 className="titulo-vista">🔍 Buscar Evento</h2>

        <section className="filtros-busqueda">
          <input
            type="text"
            name="texto"
            value={filtros.texto}
            onChange={handleChange}
            placeholder="Buscar por título, descripción o palabra clave..."
            className="input-busqueda"
          />

          <div className="grupo-filtros">
            <select name="dimension" value={filtros.dimension} onChange={handleChange} className="filtro-select">
              <option value="">Todas las dimensiones</option>
              <option value="Tecnico-Administrativa">Técnico-Administrativa</option>
              <option value="Socio-Comunitaria">Socio-Comunitaria</option>
              <option value="Pedadogica-Didactica">Pedagógica-Didáctica</option>
            </select>

            <input
              type="text"
              name="asignadoA"
              value={filtros.asignadoA}
              onChange={handleChange}
              placeholder="Buscar por nombre y apellido..."
              className="filtro-input"
            />

            <button className="btn-limpiar" onClick={limpiarFiltros}>Limpiar Filtros</button>
          </div>
        </section>

        <section className="resultados-busqueda">
          <h3>Resultados</h3>

          {eventos.length === 0 ? (
            <p>No se encontraron eventos</p>
          ) : (
            eventos.map(ev => (
              <div key={ev.Id} className="tarjeta-evento">
                <div className="evento-info">
                  <h4>{ev.Titulo}</h4>
                  <p>{ev.Descripcion}</p>
                  <span className="evento-rango">{ev.FechaInicio} - {ev.FechaFin}</span>
                  <span className="evento-tag">{ev.Dimension}</span>
                </div>

                <div className="evento-acciones">
                  <button className="btn-ir-evento" onClick={() => irAlEvento(ev.Id)}>
                    🔗 Ir al Evento
                  </button>

                  {/* 📌 NUEVO: botón visual de eliminar también en las tarjetas */}
                  {esAdminODocente && (
                    <button className="btn-eliminar-visual">
                      🗑️ Eliminar
                    </button>
                  )}

                </div>
              </div>
            ))
          )}
        </section>
      </main>
    </div>
  );
}

export default BuscarYFiltrar;
