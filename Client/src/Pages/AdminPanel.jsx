import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Logo from './img/Logo.jpg';
import './pages.css';

function AdminPanel() {
  const navigate = useNavigate();
  const [eventos, setEventos] = useState([]);
  const [eventosCalendario, setEventosCalendario] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [mensaje, setMensaje] = useState('');
  const [menuDesplegableAbierto, setMenuDesplegableAbierto] = useState(false);

  useEffect(() => {
    axios.get('http://localhost:3000/api/listarEventos')
        .then(res => {
          setEventos(res.data);
          const eventosFormateados = res.data.map(ev => ({
            id: ev.Id,
            title: ev.Titulo,
            start: `${ev.FechaInicio}T${ev.HoraInicio}`,
            end: `${ev.FechaFin}T${ev.HoraFin}`,
          }));
          setEventosCalendario(eventosFormateados);
        })
      .catch(err => console.error(err));

    axios.get('http://localhost:3000/api/listarUsuarios')
      .then(res => setUsuarios(res.data))
      .catch(err => console.error(err));
  }, []);

  const eliminarEvento = (id) => {
    axios.delete(`http://localhost:3000/api/eliminarEvento/${id}`)
      .then(() => {
        setEventos(eventos.filter(ev => ev.Id !== id));
        setMensaje("Evento eliminado");
      });
  };

  const eliminarUsuario = (id) => {
    axios.delete(`http://localhost:3000/api/eliminarUsuario/${id}`)
      .then(() => {
        setUsuarios(usuarios.filter(u => u.Id !== id));
        setMensaje("Usuario eliminado");
      });
  };

    const irAlEvento = (eventoId) => {
      navigate('/calendario', { state: { eventoId } });
    };

  return (
      <div className="admin-layout">
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
            <button className="menu-btn activo" onClick={() => navigate("/admin-panel")}>
              ⚙️ Panel Admin<br /><span>Usuarios y permisos</span>
            </button>
            <button className="menu-btn" onClick={() => navigate("/repositorio")}>
              📁 Repositorio<br /><span>Documento adjunto</span>
            </button>

            {/* Desplegable de Eventos */}
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
                              title="Ver evento"
                            >
                              👁️
                            </button>
                            <button 
                              className="btn-item-editar"
                              onClick={() => navigate("/agregar-evento")}
                              title="Editar evento"
                            >
                              ✏️
                            </button>
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
            <span>Pablo Gómez (admin)</span>
            <button className="cerrar-sesion">Cerrar sesión</button>
          </div>
        </aside>

        <main className="contenido">
          <header className="encabezado">
            <h2>🛠️ Panel de Administración</h2>
          </header>

          {mensaje && <div className="mensaje-exito">{mensaje}</div>}

        <section className="admin-seccion">
          <h3>📅 Gestión de Eventos</h3>
          <div className="tabla-contenedor">
          <table className="admin-tabla">
          <thead>
            <tr>
              <th>Título</th><th>Inicio</th><th>Fin</th><th>Tipo</th><th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {eventos.map(ev => (
              <tr key={ev.Id}>
                <td>{ev.Titulo}</td>
                <td>{ev.FechaInicio}</td>
                <td>{ev.FechaFin}</td>
                    <td><span className="badge">{ev.Tipo}</span></td>
                    <td className="acciones-tabla">
                      <button 
                        className="btn-tabla btn-ver"
                        onClick={() => irAlEvento(ev.Id)}
                        title="Ver evento"
                      >
                        �️
                      </button>
                      <button 
                        className="btn-tabla btn-editar"
                        onClick={() => navigate("/agregar-evento")}
                        title="Editar evento"
                      >
                        ✏️
                      </button>
                      <button 
                        className="btn-tabla btn-eliminar"
                        onClick={() => eliminarEvento(ev.Id)}
                        title="Eliminar evento"
                      >
                        🗑️
                      </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </section>

      <section className="admin-seccion">
        <h3>👥 Gestión de Usuarios</h3>
        <div className="tabla-contenedor">
        <table className="admin-tabla">
          <thead>
            <tr>
              <th>Nombre</th><th>Usuario</th><th>Rol</th><th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map(u => (
              <tr key={u.Id}>
                <td>{u.Name}</td>
                <td>{u.User}</td>
                    <td><span className="badge role">{u.Rol}</span></td>
                    <td className="acciones-tabla">
                      <button 
                        className="btn-tabla btn-editar"
                        onClick={() => alert("Función de editar pendiente")}
                        title="Editar usuario"
                      >
                        ✏️
                      </button>
                      <button 
                        className="btn-tabla btn-eliminar"
                        onClick={() => eliminarUsuario(u.Id)}
                        title="Eliminar usuario"
                      >
                        🗑️
                      </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </section>
      </main>
    </div>
  );
}

export default AdminPanel;
