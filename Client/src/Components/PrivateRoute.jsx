import { Navigate } from 'react-router-dom';

function PrivateRoute({ children, roles }) {
  const usuario = JSON.parse(localStorage.getItem("usuario"));

  if (!usuario) {
    return <Navigate to="/login" />;
  }

  if (!roles.includes(usuario.Rol)) {
    return <h2>⛔ Acceso denegado</h2>;
  }

  return children;
}

export default PrivateRoute;
