import Layouts from "./Components/Layouts";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import PrivateRoute from "./Components/PrivateRoute";
import AdminPanel from "./Pages/AdminPanel";
import AgregarEvento from "./Pages/AgregarEvento";
import CrearEventoVista from "./Pages/CrearEventoVista";
import Calendario from "./Pages/Calendario";
import VistaFamilia from "./Pages/VistaFamilia";
import VistaDocente from "./Pages/VistaDocente";
import Repositorio from "./Pages/repositorio";
import BuscarFiltrar from "./Pages/BuscarYFiltrar";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import CrearUsuario from "./Pages/CrearUsuario"; // Asegurate que esté en la carpeta Pages

function App() {
  return (
    <>
      <Layouts />
    <Routes>
  <Route path="/" element={<Navigate to="/calendario" />} />
  <Route path="/login" element={<Login />} />
  <Route path="/register" element={<Register />} />

  <Route path="/calendario" element={
    <PrivateRoute roles={["familia", "docente", "admin"]}>
      <Calendario />
    </PrivateRoute>
  } />
  <Route path="/agregar-evento" element={
    <PrivateRoute roles={["docente", "admin"]}>
      <CrearEventoVista />
    </PrivateRoute>
  } />
  <Route path="/admin-panel" element={
    <PrivateRoute roles={["admin", "docente"]}>
      <AdminPanel />
    </PrivateRoute>
  } />
  <Route path="/crear-usuario" element={
    <PrivateRoute roles={["admin"]}>
      <CrearUsuario />
    </PrivateRoute>
  } />
  <Route path="/repositorio" element={
    <PrivateRoute roles={["docente", "admin"]}>
      <Repositorio />
    </PrivateRoute>
  } />
  <Route path="/buscar-filtrar" element={
    <PrivateRoute roles={["docente", "admin"]}>
      <BuscarFiltrar />
    </PrivateRoute>
  } />
  
  {/* 📌 NUEVAS RUTAS: Vista Familia y Vista Docente */}
  <Route path="/vista-familia" element={
    <PrivateRoute roles={["familia"]}>
      <VistaFamilia />
    </PrivateRoute>
  } />
  
  <Route path="/vista-docente" element={
    <PrivateRoute roles={["docente"]}>
      <VistaDocente />
    </PrivateRoute>
  } />
</Routes>

    </>
  );
}

export default App;
