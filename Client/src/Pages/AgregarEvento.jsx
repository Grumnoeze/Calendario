import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import Logo2 from './img/Logo2.png';

function Login() {
  const [form, setForm] = useState({
    User: '',
    Password: '',
    showPassword: false
  });
  const [mensaje, setMensaje] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:3000/api/iniciarSesion', form);
      const usuario = res.data;
      localStorage.setItem('usuario', JSON.stringify(usuario));

      if (usuario.Rol === 'admin') navigate('/admin-panel');
      else if (usuario.Rol === 'docente') navigate('/agregar-evento');
      else if (usuario.Rol === 'familia') navigate('/calendario');
    } catch (error) {
      setMensaje(error.response?.data?.Error || 'Error desconocido');
    }
  };

  return (
    <div className="login-layout">
      <div className="login-form">
        <h2>Iniciar sesión</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="User">Correo electrónico:</label>
          <input
            name="User"
            id="User"
            type="email"
            placeholder="Ingrese su correo electrónico"
            onChange={handleChange}
            required
          />

          <label htmlFor="Password">Contraseña:</label>
          <div className="password-wrapper">
            <input
              name="Password"
              id="Password"
              type={form.showPassword ? 'text' : 'password'}
              placeholder="Ingrese su contraseña"
              onChange={handleChange}
              required
            />
            <span
              className="password-icon"
              onClick={() => setForm({ ...form, showPassword: !form.showPassword })}
            >
              {form.showPassword ? '🙈' : '👁️'}
            </span>
          </div>

          <div className="login-links">
            <a href="#">¿Olvidaste tu contraseña?</a>
          </div>

          <button type="submit">Ingresar</button>
          <p className="login-error">{mensaje}</p>
        </form>
      </div>

      <div className="login-banner">
        <img src={Logo2} alt="Logo Colegio" className="login-logo" />
        <h1 className="login-nombre">Colegio San Agustín</h1>
      </div>
    </div>
  );
}

export default Login;
