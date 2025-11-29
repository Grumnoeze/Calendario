import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import Logo2 from "./img/logo2.png";

function Login() {
  const [form, setForm] = useState({
    Mail: "",
    Password: "",
  });

  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [tipoMensaje, setTipoMensaje] = useState(""); // "error" o "success"
  const [mostrarOlvidePassword, setMostrarOlvidePassword] = useState(false);
  const [emailRecuperacion, setEmailRecuperacion] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.Mail.trim() || !form.Password.trim()) {
      setMensaje("Por favor completá todos los campos");
      setTipoMensaje("error");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:3000/api/iniciarSesion",
        form
      );

      const usuario = res.data;
      localStorage.setItem("usuario", JSON.stringify(usuario));

      // Validar que el usuario tenga un rol válido
      const rolesValidos = ["admin", "docente", "familia"];
      if (!rolesValidos.includes(usuario.Rol?.toLowerCase())) {
        setMensaje("Rol de usuario no válido");
        setTipoMensaje("error");
        return;
      }

      // Redirigir según el rol
      switch (usuario.Rol?.toLowerCase()) {
        case "admin":
          navigate("/admin-panel");
          break;
        case "docente":
          navigate("/agregar-evento");
          break;
        case "familia":
          navigate("/calendario");
          break;
        default:
          setMensaje("Rol desconocido");
          setTipoMensaje("error");
      }
    } catch (error) {
      const msg = error.response?.data?.Error || "Error desconocido";
      setMensaje(msg);
      setTipoMensaje("error");
    }
  };

  const handleRecuperarPassword = async (e) => {
    e.preventDefault();

    if (!emailRecuperacion.trim()) {
      setMensaje("Por favor ingresa tu correo electrónico");
      setTipoMensaje("error");
      return;
    }

    try {
      // Nota: Esta es una solicitud a un endpoint que podría no existir en el backend
      // Si el backend no tiene esta funcionalidad, esta sección puede comentarse
      // const res = await axios.post(
      //   "http://localhost:3000/api/recuperarPassword",
      //   { Email: emailRecuperacion }
      // );

      // Mientras tanto, mostramos un mensaje genérico
      setMensaje("Se ha enviado un correo con instrucciones para recuperar tu contraseña");
      setTipoMensaje("success");
      setEmailRecuperacion("");
      
      // Cerrar modal después de 3 segundos
      setTimeout(() => {
        setMostrarOlvidePassword(false);
        setMensaje("");
      }, 3000);
    } catch (error) {
      const msg = error.response?.data?.Error || "Error al intentar recuperar la contraseña";
      setMensaje(msg);
      setTipoMensaje("error");
    }
  };

  return (
    <div className="login-wrapper">
      {/* COLUMNA IZQUIERDA: FORMULARIO */}
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

            {/* ENVOLTORIO PARA ALINEAR CORRECTAMENTE */}
            <div className="password-wrapper">
              <input
                name="Password"
                type={mostrarPassword ? "text" : "password"}
                placeholder="Ingresa tu contraseña"
                value={form.Password}
                onChange={handleChange}
              />

              {/* BOTÓN PROFESIONAL Y CENTRADO */}
              <button
                type="button"
                className="toggle-password"
                onClick={() => setMostrarPassword(!mostrarPassword)}
              >
                {mostrarPassword ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#555"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-5.52 0-10-4-10-8a9.77 9.77 0 012.27-5.94m3.2-2.31A9.88 9.88 0 0112 4c5.52 0 10 4 10 8a9.77 9.77 0 01-1.92 4.84" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#555"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <button className="login-btn" type="submit">
            Ingresar
          </button>

          {mensaje && (
            <p className={`login-message ${tipoMensaje}`}>
              {mensaje}
            </p>
          )}

          <button
            type="button"
            className="forgot-password-btn"
            onClick={() => setMostrarOlvidePassword(true)}
          >
            ¿Olvidaste tu contraseña?
          </button>
        </form>
      </div>

      {/* COLUMNA DERECHA: LOGO */}
      <div className="login-right">
        <img src={Logo2} alt="Logo" className="banner-logo" />
      </div>

      {/* MODAL: RECUPERAR CONTRASEÑA */}
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
                  onChange={(e) => setEmailRecuperacion(e.target.value)}
                  required
                />
              </div>

              {mensaje && (
                <p className={`modal-message ${tipoMensaje}`}>
                  {mensaje}
                </p>
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
