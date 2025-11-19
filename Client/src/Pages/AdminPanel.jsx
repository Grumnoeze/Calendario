import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Logo from './img/Logo.jpg';
import './pages.css';

function AdminPanel() {
  const navigate = useNavigate();
  const [usuarios, setUsuarios] = useState([]);
  const [mensaje, setMensaje] = useState('');
  const [menuDesplegableAbierto, setMenuDesplegableAbierto] = useState(false);

  const usuarioLocal = JSON.parse(localStorage.getItem("usuario"));
  const esAdmin = usuarioLocal?.Rol === "admin";

  useEffect(() => {
    axios.get('http://localhost:3000/api/listarUsuarios')
      .then(response => setUsuarios(response.data))
      .catch(err => console.error(err));
  }, []);

  const aceptarUsuario = (id) => {
    axios.post(`http://localhost:3000/api/aceptarUsuario/${id}`)
      .then(() => {
        setUsuarios(prev => prev.filter(u => u.Id !== id));
        setMensaje('Usuario aceptado');
        setTimeout(() => setMensaje(''), 3000);
      })
      .catch(err => {
        console.error(err);
        setMensaje('Error al aceptar usuario');
        setTimeout(() => setMensaje(''), 3000);
      });
  };

  const rechazarUsuario = (id) => {
    axios.post(`http://localhost:3000/api/rechazarUsuario/${id}`)
      .then(() => {
        setUsuarios(prev => prev.filter(u => u.Id !== id));
        setMensaje('Usuario rechazado');
        setTimeout(() => setMensaje(''), 3000);
      })
      .catch(err => {
        console.error(err);
        setMensaje('Error al rechazar usuario');
        setTimeout(() => setMensaje(''), 3000);
      });
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
                <p style={{ color: '#fff', margin: 0 }}>Aquí verás eventos (vista rápida)</p>
              </div>
            )}
          </div>
        </nav>

        <div className="usuario-sidebar">
          <span>{usuarioLocal?.Name} ({usuarioLocal?.Rol})</span>
          <button className="cerrar-sesion">Cerrar sesión</button>
        </div>
      </aside>

      <main className="contenido">
        <header className="encabezado">
          <h2>🛠️ Panel de Administración</h2>
        </header>

        {mensaje && <div className="mensaje-exito">{mensaje}</div>}

        <section className="admin-seccion">
          <h3>👥 Gestión de Usuarios</h3>

          {esAdmin && (
            <div className="boton-agregar-usuario">
              <button className="btn-agregar" onClick={() => navigate("/crear-usuario")}>
                ➕ Agregar nuevo usuario
              </button>
            </div>
          )}

          <div className="tabla-contenedor">
            <table className="admin-tabla">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Email</th>
                  <th>Rol</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.length === 0 ? (
                  <tr>
                    <td colSpan="4" style={{ textAlign: 'center', padding: '20px' }}>
                      No hay usuarios pendientes
                    </td>
                  </tr>
                ) : (
                  usuarios.map(u => (
                    <tr key={u.Id}>
                      <td>{u.Name}</td>
                   <td>{u.Mail}</td>

                      <td><span className="badge role">{u.Rol}</span></td>
                      <td className="acciones-tabla">
                        <button
                          className="btn-tabla btn-aceptar"
                          onClick={() => aceptarUsuario(u.Id)}
                          title="Aceptar usuario"
                        >
                          ✓
                        </button>

                        <button
                          className="btn-tabla btn-rechazar"
                          onClick={() => rechazarUsuario(u.Id)}
                          title="Rechazar usuario"
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}

export default AdminPanel;
