import Layouts from "./Components/Layouts"
import Login from "./Pages/Login"
import Register from "./Pages/Register"

import PrivateRoute from "./Components/PrivateRoute"
import AdminPanel from "./Pages/AdminPanel"
import AgregarEvento from "./Pages/AgregarEvento"
import Calendario from "./Pages/Calendario"

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
            <AgregarEvento />
          </PrivateRoute>
        } />
        <Route path="/admin-panel" element={
          <PrivateRoute roles={["admin"]}>
            <AdminPanel />
          </PrivateRoute>
        } />

      </Routes>
    </>
  )
}

export default App
