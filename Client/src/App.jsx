import Layouts from "./Components/Layouts";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import AgregarEvento from "./Pages/AgregarEvento";
import PrivateRoute from "./Components/PrivateRoute";
import AdminPanel from "./Pages/AdminPanel";
import Calendario from "./Pages/Calendario";
import VistaFamilia from "./Pages/VistaFamilia";
import VistaDocente from "./Pages/VistaDocente";
import Repositorio from "./Pages/repositorio";
import BuscarFiltrar from "./Pages/BuscarYFiltrar";
import CrearUsuario from "./Pages/CrearUsuario";
import { Routes, Route, Navigate } from "react-router-dom";

function App() {
  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Layout con Sidebar */}
      <Route element={<Layouts />}>
        <Route path="/" element={<Navigate to="/calendario" />} />

        <Route
          path="/calendario"
          element={
            <PrivateRoute roles={["familia", "docente", "admin"]}>
              <Calendario />
            </PrivateRoute>
          }
        />

        <Route
          path="/agregar-evento"
          element={
            <PrivateRoute roles={["docente", "admin"]}>
              <AgregarEvento />
            </PrivateRoute>
          }
        />


        <Route
          path="/admin-panel"
          element={
            <PrivateRoute roles={["admin", "docente"]}>
              <AdminPanel />
            </PrivateRoute>
          }
        />

        <Route
          path="/crear-usuario"
          element={
            <PrivateRoute roles={["admin"]}>
              <CrearUsuario />
            </PrivateRoute>
          }
        />

        <Route
          path="/repositorio"
          element={
            <PrivateRoute roles={["docente", "admin"]}>
              <Repositorio />
            </PrivateRoute>
          }
        />

        <Route
          path="/buscar-filtrar"
          element={
            <PrivateRoute roles={["docente", "admin"]}>
              <BuscarFiltrar />
            </PrivateRoute>
          }
        />

        <Route
          path="/vista-familia"
          element={
            <PrivateRoute roles={["familia"]}>
              <VistaFamilia />
            </PrivateRoute>
          }
        />

        <Route
          path="/vista-docente"
          element={
            <PrivateRoute roles={["docente"]}>
              <VistaDocente />
            </PrivateRoute>
          }
        />
      </Route>
    </Routes>
  );
}

export default App;
