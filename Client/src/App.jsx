import Layouts from "./Components/Layouts";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import PrivateRoute from "./Components/PrivateRoute";
import AdminPanel from "./Pages/AdminPanel";
import AgregarEvento from "./Pages/AgregarEvento";
import Calendario from "./Pages/Calendario";
import Repositorio from "./Pages/repositorio";
import BuscarFiltrar from "./Pages/BuscarYFiltrar";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

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
          <PrivateRoute roles={["admin"]}>
            <AdminPanel />
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
      </Routes>
    </>
  );
}

export default App;
