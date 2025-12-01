import { Navigate } from 'react-router-dom';

function PrivateRoute({ children, roles }) {
  const usuario = JSON.parse(localStorage.getItem("usuario"));

  if (!usuario) {
    return <Navigate to="/login" />;
  }

  // Normalizar rol
  let rolNormalizado = usuario.Rol?.toLowerCase();

  // Mapear "director" a "admin"
  if (rolNormalizado === "director") {
    rolNormalizado = "admin";
  }

  const rolesNormalizados = roles.map(r => r.toLowerCase());

  if (!rolesNormalizados.includes(rolNormalizado)) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        flexDirection: 'column',
        backgroundColor: '#f5f5f5'
      }}>
        <h2 style={{ color: '#f44336' }}>⛔ Acceso denegado</h2>
        <p>No tienes permisos para acceder a esta página</p>
      </div>
    );
  }

  return children;
}

export default PrivateRoute;
