// Client/src/Pages/AdminPanel.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api"; // tu instancia axios con baseURL + token
import "./pages.css";

function AdminPanel() {
  const navigate = useNavigate();

  const usuarioLocal = JSON.parse(localStorage.getItem("usuario"));
  const esAdmin = usuarioLocal?.Rol === "admin";

  const [usuarios, setUsuarios] = useState([]);
  const [mensaje, setMensaje] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [rolFiltro, setRolFiltro] = useState("");

  // ============================
  //   CARGAR USUARIOS DESDE BD
  // ============================
  useEffect(() => {
    api
      .get("/usuarios")
      .then((res) => setUsuarios(res.data))
      .catch((err) => console.error("❌ Error cargando usuarios", err));
  }, []);

  // ============================
  //   ELIMINAR USUARIO
  // ============================
  const eliminarUsuario = (mail) => {
    api
      .delete(`/usuarios/${mail}`)
      .then(() => {
        setUsuarios((prev) => prev.filter((u) => u.Mail !== mail));
        setMensaje("Usuario eliminado");
        setTimeout(() => setMensaje(""), 3000);
      })
      .catch((err) => {
        console.error(err);
        setMensaje("Error al eliminar usuario");
        setTimeout(() => setMensaje(""), 3000);
      });
  };

  // ============================
  //   FILTROS
  // ============================
  const usuariosFiltrados = usuarios.filter((u) => {
    const coincideBusqueda =
      busqueda === "" ||
      u.Name.toLowerCase().includes(busqueda.toLowerCase()) ||
      u.Mail.toLowerCase().includes(busqueda.toLowerCase());

    const coincideRol =
      rolFiltro === "" || u.Rol.toLowerCase() === rolFiltro.toLowerCase();

    return coincideBusqueda && coincideRol;
  });

  return (
    <div className="admin-layout">
      <main className="contenido">
        <header className="encabezado">
          <h2>🛠️ Panel de Administración</h2>
        </header>

        {mensaje && <div className="mensaje-exito">{mensaje}</div>}

        <section className="admin-seccion">
          <h3>👥 Gestión de Usuarios</h3>

          {/* Barra de búsqueda y filtro */}
          <div className="filtros-admin">
            <input
              type="text"
              placeholder="Buscar por nombre o mail..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="input-busqueda"
            />

            <select
              value={rolFiltro}
              onChange={(e) => setRolFiltro(e.target.value)}
              className="filtro-select"
            >
              <option value="">Todos los roles</option>
              <option value="admin">Admin/Director</option>
              <option value="docente">Docente</option>
              <option value="familia">Familia</option>
            </select>

            
              <button
                className="btn-agregar"
                onClick={() => navigate("/crear-usuario")}
              >
                ➕ Nuevo Usuario
              </button>
            
          </div>

          {/* Tabla de usuarios */}
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
                {usuariosFiltrados.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: "center", padding: "20px" }}>
                      No hay usuarios registrados
                    </td>
                  </tr>
                ) : (
                  usuariosFiltrados.map((u) => (
                    <tr key={u.Mail}>
                      <td>{u.Name}</td>
                      <td>{u.Mail}</td>
                      <td>
                        <span className="badge role">{u.Rol}</span>
                      </td>
                      <td>{u.PermisoVisualizacion || "—"}</td>
                      <td>{u.PermisoEdicion || "—"}</td>
                      <td className="acciones-tabla">
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
