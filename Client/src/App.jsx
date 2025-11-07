import Layouts from "./Components/Layouts"
import Login from "./Pages/Login"
import Register from "./Pages/Register"

import PrivateRoute from "./Components/PrivateRoute"
import AdminPanel from "./Pages/AdminPanel"
import CrearEventoVista from "./Pages/CrearEventoVista"
import Calendario from "./Pages/Calendario"
import BuscarFiltrar from "./Pages/BuscarYFiltrar"
import Repositorio from "./Pages/Repositorio"

import { BrowserRouter, Routes, Route } from "react-router-dom"



function App() {

  return (
    <>
      <Layouts />
      <Routes>
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

        <Route path="/buscar-filtrar" element={
          <PrivateRoute roles={["docente", "admin"]}>
            <BuscarFiltrar />
          </PrivateRoute>
        } />
        <Route path="/repositorio" element={
          <PrivateRoute roles={["docente", "admin"]}>
            <Repositorio />
          </PrivateRoute>
        } />




      </Routes>
    </>
  )
}

export default App
