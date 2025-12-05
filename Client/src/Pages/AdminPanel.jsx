import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Logo from './img/Logo.jpg';
import './pages.css';

function AdminPanel() {
  const navigate = useNavigate();
  const [usuarios, setUsuarios] = useState([]);
  const [mensaje, setMensaje] = useState('');
  const usuarioLocal = JSON.parse(localStorage.getItem("usuario")) || null;
  const esAdmin = usuarioLocal?.Rol?.toLowerCase() === "admin";

  useEffect(() => {
    axios.get('http://localhost:3000/api/listarUsuarios')
      .then(response => setUsuarios(response.data))
      .catch(err => console.error(err));
  }, []);

  const aceptarUsuario = (mail) => {
  axios.put(`http://localhost:3000/api/aceptarUsuario/${mail}`)
    .then(() => {
      setUsuarios(prev =>
        prev.map(u => u.Mail === mail ? { ...u, Estado: "aceptado" } : u)
      );
      setMensaje('Usuario aceptado');
      setTimeout(() => setMensaje(''), 3000);
    })
    .catch(err => {
      console.error(err);
      setMensaje('Error al aceptar usuario');
      setTimeout(() => setMensaje(''), 3000);
    });
};


  const rechazarUsuario = (mail) => {
    axios.put(`http://localhost:3000/api/rechazarUsuario/${mail}`)
      .then(() => {
        setUsuarios(prev => prev.filter(u => u.Mail !== mail));
        setMensaje('Usuario rechazado');
        setTimeout(() => setMensaje(''), 3000);
      })
      .catch(err => {
        console.error(err);
        setMensaje('Error al rechazar usuario');
        setTimeout(() => setMensaje(''), 3000);
      });
  };

  const eliminarUsuario = (mail) => {
    axios.delete(`http://localhost:3000/api/eliminarUsuario/${mail}`)
      .then(() => {
        setUsuarios(prev => prev.filter(u => u.Mail !== mail));
        setMensaje('Usuario eliminado');
        setTimeout(() => setMensaje(''), 3000);
      })
      .catch(err => {
        console.error(err);
        setMensaje('Error al eliminar usuario');
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

        <h2 className="rol-usuario">{usuarioLocal?.Rol ? usuarioLocal.Rol : 'Director'}</h2>

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
          <span>👤 {usuarioLocal?.Name ? usuarioLocal.Name : 'Usuario'} ({usuarioLocal?.Rol ? usuarioLocal.Rol : '—'})</span>
          <button className="cerrar-sesion" onClick={() => {
            localStorage.removeItem("usuario");
            navigate("/login");
          }}>
            Cerrar sesión
          </button>
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
                  <th>Permisos Ver</th>
                  <th>Permisos Editar</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>
                      No hay usuarios registrados
                    </td>
                  </tr>
                ) : (
                  usuarios.map(u => (
                    <tr key={u.Mail}>
                      <td>{u.Name}</td>
                      <td>{u.Mail}</td>
                      <td><span className="badge role">{u.Rol}</span></td>
                      <td>{u.PermisoVisualizacion || "—"}</td>
                      <td>{u.PermisoEdicion || "—"}</td>
                      <td className="acciones-tabla">
                        {u.Estado === "aceptado" ? (
                          <span className="texto-aceptado">✔ Usuario aceptado</span>
                        ) : (
                          <>
                            <button
                              className="btn-tabla btn-aceptar"
                              onClick={() => aceptarUsuario(u.Mail)}
                              title="Aceptar usuario"
                            >
                              ✓
                            </button>
                            <button
                              className="btn-tabla btn-rechazar"
                              onClick={() => rechazarUsuario(u.Mail)}
                              title="Rechazar usuario"
                            >
                              🗑️
                            </button>
                          </>
                        )}
                        <button
                          className="btn-tabla btn-eliminar"
                          onClick={() => eliminarUsuario(u.Mail)}
                          title="Eliminar usuario"
                        >
                          ❌
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
