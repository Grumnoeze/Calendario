import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import Logo2 from "./img/Baner.png";

function Login() {
  const [form, setForm] = useState({
    Mail: "",
    Password: "",
  });

  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.Mail.trim() || !form.Password.trim()) {
      setMensaje("Por favor completá todos los campos");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:3000/api/iniciarSesion",
        form
      );

      const usuario = res.data;
      localStorage.setItem("usuario", JSON.stringify(usuario));

      switch (usuario.Rol) {
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
      }
    } catch (error) {
      const msg = error.response?.data?.Error || "Error desconocido";
      setMensaje(msg);
    }
  };

  return (
    <div className="login-container">

      {/* BANNER DEL LOGO */}
      <div className="login-banner">
        <img src={Logo2} alt="Logo Institucional" className="login-banner-img" />
      </div>

      <form className="login-box" onSubmit={handleSubmit}>
        <h2 className="login-title">🔐 Iniciar sesión</h2>

        <div className="input-group">
          <label>Correo electrónico</label>
          <input
            name="Mail"
            type="email"
            placeholder="ejemplo@correo.com"
            value={form.Mail}
            onChange={handleChange}
          />
        </div>

        {/* INPUT DE CONTRASEÑA CON OJO */}
        <div className="input-group">
          <label>Contraseña</label>

          <div className="password-wrapper">
            <input
              name="Password"
              type={mostrarPassword ? "text" : "password"}
              placeholder="••••••••"
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
          Entrar
        </button>

        {mensaje && <p className="login-error">{mensaje}</p>}
      </form>
    </div>
  );
}

export default Login;
