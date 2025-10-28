import { useNavigate } from 'react-router-dom';

function Encabezado() {
  const navigate = useNavigate();
  const usuario = JSON.parse(localStorage.getItem("usuario"));

  const cerrarSesion = () => {
    localStorage.removeItem("usuario");
    navigate("/login");
  };

  return (
    <header className="encabezado">
      <img src={null} alt="Logo" />

      <nav className="menu">
        {!usuario && (
          <>
            <a href="/register">Registrar Usuario</a>
            <a href="/login">Iniciar Sesión</a>
          </>
        )}
        <a href="/calendario">Calendario</a>
        {["docente", "admin"].includes(usuario?.Rol) && <a href="/agregar-evento">Agregar Evento</a>}
        {usuario?.Rol === "admin" && <a href="/admin-panel">Panel Admin</a>}
      </nav>

      {usuario && (
        <div className="usuario">
          <span>👤 {usuario.Name} ({usuario.Rol})</span>
          <button onClick={cerrarSesion}>Cerrar sesión</button>
        </div>
      )}
    </header>
  );
}

export default Encabezado;
