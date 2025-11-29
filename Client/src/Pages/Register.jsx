import { useState } from "react";
import axios from "axios";
import "./Register.css";
import Logo2 from "./img/logo2.png";

function Register() {
  const [form, setForm] = useState({
    Mail: "",
    Name: "",
    Rol: "",
  });

  const [mensaje, setMensaje] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:3000/api/registrarUsuario",
        {
          Mail: form.Mail,
          Name: form.Name,
          Rol: form.Rol
        }
      );

      setMensaje(res.data.Mensaje || "Registro exitoso");
      setForm({ Mail: "", Name: "", Rol: "" });
    } catch (error) {
      setMensaje(error.response?.data?.Error || "Error desconocido");
    }
  };

  return (
    <div className="register-wrapper">
      {/* COLUMNA IZQUIERDA: FORMULARIO */}
      <div className="register-left">
        <h1 className="titulo-registro">Crear nueva cuenta</h1>

        <form className="register-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Correo Electrónico</label>
            <input
              name="Mail"
              type="email"
              placeholder="Ingresa tu correo electrónico"
              value={form.Mail}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label>Contraseña</label>
            <input
              name="Password"
              type="password"
              placeholder="Ingresa tu contraseña"
              value={form.Password}
              onChange={handleChange}
              required
            />
          </div>



          <div className="input-group">
            <label>Nombre completo</label>
            <input
              name="Name"
              type="text"
              placeholder="Ingresa tu nombre completo"
              value={form.Name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label>Rol del usuario</label>
            <select
              name="Rol"
              value={form.Rol}
              onChange={handleChange}
              required
            >
              <option value="">Seleccionar rol</option>
              <option value="admin">Admin</option>
              <option value="docente">Docente</option>
              <option value="familia">Familia</option>
            </select>
          </div>

          <button className="register-btn" type="submit">
            Registrar
          </button>

          {mensaje && <p className="register-message">{mensaje}</p>}
        </form>
      </div>

      {/* COLUMNA DERECHA: LOGO */}
      <div className="register-right">
        <img src={Logo2} alt="Logo" className="banner-logo" />
      </div>
    </div>
  );
}

export default Register;
