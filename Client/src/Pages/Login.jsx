import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [form, setForm] = useState({
    User: '',
    Password: ''
  });

  const [mensaje, setMensaje] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación básica antes de enviar
    if (!form.User.trim() || !form.Password.trim()) {
      setMensaje('Por favor completá todos los campos');
      return;
    }

    try {
      console.log("📤 Enviando datos de login:", form);
      const res = await axios.post('/api/iniciarSesion', form);
      console.log("📥 Respuesta recibida:", res.data);

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
      console.error("❌ Error en login:", error);
      const msg = error.response?.data?.Error || 'Error desconocido';
      setMensaje(msg);
    }
  };

  return (
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
  );
}

export default Login;
