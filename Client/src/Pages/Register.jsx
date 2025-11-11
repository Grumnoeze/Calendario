import { useState } from 'react';
import axios from 'axios';

function Register() {
 const [form, setForm] = useState({
  User: '',
  Password: '',
  Name: '',
  Rol: ''
});

  const [mensaje, setMensaje] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
    const res = await axios.post('http://localhost:3000/api/registrarUsuario', form);

      setMensaje(res.data.Mensaje || 'Registro exitoso');
    } catch (error) {
      setMensaje(error.response?.data?.Error || 'Error desconocido');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Crear cuenta</h2>
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
      <input
        name="Name"
        placeholder="Nombre completo"
        value={form.Name}
        onChange={handleChange}
        required
      />
      <select
        name="Rol"
        value={form.Rol}
        onChange={handleChange}
        required
      >
        <option value="">Seleccionar rol</option>
        <option value="admin">Administrador</option>
        <option value="docente">Docente</option>
        <option value="familia">Familia</option>
      </select>
      <button type="submit">Registrar</button>
      <p>{mensaje}</p>
    </form>
  );
}

export default Register;
