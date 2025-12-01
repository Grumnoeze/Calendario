import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import Logo2 from "./img/logo2.png";

function Login() {
  const [form, setForm] = useState({ Mail: "", Password: "" });
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [tipoMensaje, setTipoMensaje] = useState("");
  const [mostrarOlvidePassword, setMostrarOlvidePassword] = useState(false);
  const [emailRecuperacion, setEmailRecuperacion] = useState("");
  const navigate = useNavigate();

  const handleChange = e =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.Mail.trim() || !form.Password.trim()) {
      setMensaje("Por favor completá todos los campos");
      setTipoMensaje("error");
      return;
    }
    try {
      const { data } = await axios.post(
        "http://localhost:3000/api/usuarios/login",
        form
      );

      // Guardar token y datos del usuario
      localStorage.setItem("token", data.token);
      localStorage.setItem("usuario", JSON.stringify({
        Mail: data.Mail,
        Name: data.Name,
        Rol: data.Rol
      }));

      // Configurar axios para mandar token en cada request
      axios.defaults.headers.common['Authorization'] = 
        `Bearer ${data.token}`;

      // Normalizar rol
      let rol = data.Rol?.toLowerCase();
      if (rol === "director") rol = "admin";

      if (!["admin", "docente", "familia"].includes(rol)) {
        setMensaje("Rol de usuario no válido");
        setTipoMensaje("error");
        return;
      }

      // Redirección según rol
      navigate(
        rol === "admin"
          ? "/calendario"
          : rol === "docente"
          ? "/vista-docente"
          : "/vista-familia"
      );
    } catch (error) {
      setMensaje(error.response?.data?.Error || "Error desconocido");
      setTipoMensaje("error");
    }
  };

  // Recuperar contraseña (placeholder)
  const handleRecuperarPassword = async e => {
    e.preventDefault();
    if (!emailRecuperacion.trim()) {
      setMensaje("Por favor ingresa tu correo electrónico");
      setTipoMensaje("error");
      return;
    }
    try {
      setMensaje(
        "Se ha enviado un correo con instrucciones para recuperar tu contraseña"
      );
      setTipoMensaje("success");
      setEmailRecuperacion("");
      setTimeout(() => {
        setMostrarOlvidePassword(false);
        setMensaje("");
      }, 3000);
    } catch (error) {
      setMensaje(
        error.response?.data?.Error ||
          "Error al intentar recuperar la contraseña"
      );
      setTipoMensaje("error");
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-left">
        <h1 className="titulo-colegio">Colegio San Agustín</h1>
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Correo Electrónico</label>
            <input
              name="Mail"
              type="email"
              placeholder="Ingresa tu correo electrónico"
              value={form.Mail}
              onChange={handleChange}
            />
          </div>
          <div className="input-group">
            <label>Contraseña</label>
            <div className="password-wrapper">
              <input
                name="Password"
                type={mostrarPassword ? "text" : "password"}
                placeholder="Ingresa tu contraseña"
                value={form.Password}
                onChange={handleChange}
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setMostrarPassword(!mostrarPassword)}
              >
                {mostrarPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>
          <button className="login-btn" type="submit">
            Ingresar
          </button>
          {mensaje && <p className={`login-message ${tipoMensaje}`}>{mensaje}</p>}
          <button
            type="button"
            className="forgot-password-btn"
            onClick={() => setMostrarOlvidePassword(true)}
          >
            ¿Olvidaste tu contraseña?
          </button>
        </form>
      </div>
      <div className="login-right">
        <img src={Logo2} alt="Logo" className="banner-logo" />
      </div>
      {mostrarOlvidePassword && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button
              className="modal-close"
              onClick={() => {
                setMostrarOlvidePassword(false);
                setMensaje("");
              }}
            >
              ✕
            </button>
            <h2>Recuperar contraseña</h2>
            <p>Ingresa tu correo electrónico para recibir instrucciones de recuperación</p>
            <form onSubmit={handleRecuperarPassword}>
              <div className="input-group">
                <label>Correo Electrónico</label>
                <input
                  type="email"
                  placeholder="Tu correo electrónico"
                  value={emailRecuperacion}
                  onChange={e => setEmailRecuperacion(e.target.value)}
                  required
                />
              </div>
              {mensaje && (
                <p className={`modal-message ${tipoMensaje}`}>{mensaje}</p>
              )}
              <button type="submit" className="modal-btn">
                Enviar instrucciones
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Login;
