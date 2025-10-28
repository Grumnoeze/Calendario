import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
// import './Login.css';


function Login() {
  const [form, setForm] = useState({ User: '', Password: '' });
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

      // Store user data in localStorage
      localStorage.setItem('usuario', JSON.stringify(usuario));

      // Redirect based on role
      if (usuario.Rol === 'admin') navigate('/admin-panel');
      else if (usuario.Rol === 'docente') navigate('/agregar-evento');
      else if (usuario.Rol === 'familia') navigate('/calendario');
    } catch (error) {
      setMensaje(error.response?.data?.Error || 'Error desconocido');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Iniciar sesión</h2>
      <input
        name="User"
        placeholder="Usuario"
        onChange={handleChange}
        required
      />
      <input
        name="Password"
        type="password"
        placeholder="Contraseña"
        onChange={handleChange}
        required
      />
      <button type="submit">Entrar</button>
      <p>{mensaje}</p>
    </form>
  );
}

export default Login;
