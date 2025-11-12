import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Baner from './img/Baner.png';
import './Login.css';

function Login() {
  const [form, setForm] = useState({
    User: '',
    Password: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.User.trim() || !form.Password.trim()) {
      setMensaje('Por favor completá todos los campos');
      return;
    }

    try {
      const res = await axios.post('/api/iniciarSesion', form);
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
      const msg = error.response?.data?.Error || 'Error desconocido';
      setMensaje(msg);
    }
  };

  return (
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
  );
}

export default Login;
