import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
<<<<<<< HEAD
import Baner from './img/Baner.png';
import './Login.css';
=======
>>>>>>> 75d59108e091a69d4a3e4a3ca0bc7ac5dc35f429

function Login() {
  const [form, setForm] = useState({
    User: '',
    Password: ''
  });

<<<<<<< HEAD
  const [showPassword, setShowPassword] = useState(false);
=======
>>>>>>> 75d59108e091a69d4a3e4a3ca0bc7ac5dc35f429
  const [mensaje, setMensaje] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

<<<<<<< HEAD
=======
    // Validación básica antes de enviar
>>>>>>> 75d59108e091a69d4a3e4a3ca0bc7ac5dc35f429
    if (!form.User.trim() || !form.Password.trim()) {
      setMensaje('Por favor completá todos los campos');
      return;
    }

    try {
<<<<<<< HEAD
      const res = await axios.post('/api/iniciarSesion', form);
=======
      console.log("📤 Enviando datos de login:", form);
      const res = await axios.post('/api/iniciarSesion', form);
      console.log("📥 Respuesta recibida:", res.data);

>>>>>>> 75d59108e091a69d4a3e4a3ca0bc7ac5dc35f429
      const usuario = res.data;
      localStorage.setItem('usuario', JSON.stringify(usuario));

      switch (usuario.Rol) {
        case 'admin':
          navigate('/admin-panel');
          break;
        case 'docente':
          navigate('/agregar-evento');
          break;
        case 'familia':
          navigate('/calendario');
          break;
        default:
          setMensaje('Rol desconocido');
      }
    } catch (error) {
<<<<<<< HEAD
=======
      console.error("❌ Error en login:", error);
>>>>>>> 75d59108e091a69d4a3e4a3ca0bc7ac5dc35f429
      const msg = error.response?.data?.Error || 'Error desconocido';
      setMensaje(msg);
    }
  };

  return (
<<<<<<< HEAD
    <div className="login-container">
      <div className="login-banner">
        <img src={Baner} alt="Banner Colegio San Agustín" className="login-logo" />
        <h1 className="login-title">Colegio San Agustín</h1>
      </div>

      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Iniciar sesión</h2>

        <input
          name="User"
          type="text"
          placeholder="Nombre de usuario"
          value={form.User}
          onChange={handleChange}
          required
          className="animated-input"
        />

        <div className="password-wrapper">
          <input
            name="Password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Contraseña"
            value={form.Password}
            onChange={handleChange}
            required
            className="animated-input password-input"
          />
          <span
            className="eye-icon"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? '🙈' : '👁️'}
          </span>
        </div>

        <button type="submit">Entrar</button>
        {mensaje && <p className="login-error">{mensaje}</p>}
      </form>
    </div>
=======
    <form onSubmit={handleSubmit}>
      <h2>Iniciar sesión</h2>
      <input
        name="User"
        type="text"
        placeholder="Nombre de usuario"
        value={form.User}
        onChange={handleChange}
        required
      />
      <input
        name="Password"
        type="password"
        placeholder="Contraseña"
        value={form.Password}
        onChange={handleChange}
        required
      />
      <button type="submit">Entrar</button>
      {mensaje && <p style={{ color: 'red' }}>{mensaje}</p>}
    </form>
>>>>>>> 75d59108e091a69d4a3e4a3ca0bc7ac5dc35f429
  );
}

export default Login;
