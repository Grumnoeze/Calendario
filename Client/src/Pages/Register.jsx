// Importamos React y el hook useState para manejar el estado del formulario
import { useState } from 'react';

// Importamos axios para hacer la petición POST al backend
import axios from 'axios';

// Importamos el logo institucional desde la carpeta img (dentro de Pages)
import Logo from './img/Logo.jpg';

// Importamos los estilos específicos para este componente
import './Register.css';

// Componente principal de registro
function Register() {
  // Estado inicial del formulario con los campos necesarios
  const [form, setForm] = useState({
    User: '',
    Password: '',
    Name: '',
    Rol: ''
  });

  // Estado para mostrar mensajes de éxito o error
  const [mensaje, setMensaje] = useState('');

  // Función que actualiza el estado del formulario cada vez que se escribe en un campo
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Función que se ejecuta al enviar el formulario
  const handleSubmit = async (e) => {
    e.preventDefault(); // Evita que se recargue la página

    try {
      // Enviamos los datos del formulario al backend
      const res = await axios.post('http://localhost:3000/api/registrarUsuario', form);

      // Si todo sale bien, mostramos el mensaje de respuesta
      setMensaje(res.data.Mensaje);
    } catch (error) {
      // Si hay un error, mostramos el mensaje de error
      setMensaje(error.response?.data?.Error || 'Error desconocido');
    }
  };

  // Render del componente
  return (
    <div className="register-wrapper">
      {/* Panel izquierdo con el logo institucional */}
      <div className="logo-panel">
        <img src={Logo} alt="Logo institucional" className="logo-img" />
      </div>

      {/* Panel derecho con el formulario de registro */}
      <div className="form-panel">
        <h2 className="register-title">Crear cuenta</h2>

        {/* Formulario con campos controlados */}
        <form className="register-form" onSubmit={handleSubmit}>
          {/* Campo de usuario */}
          <input
            name="User"
            placeholder="Usuario"
            onChange={handleChange}
            required
            className="register-input"
          />

          {/* Campo de contraseña */}
          <input
            name="Password"
            type="password"
            placeholder="Contraseña"
            onChange={handleChange}
            required
            className="register-input"
          />

          {/* Campo de nombre completo */}
          <input
            name="Name"
            placeholder="Nombre completo"
            onChange={handleChange}
            required
            className="register-input"
          />

          {/* Selector de rol */}
          <select
            name="Rol"
            onChange={handleChange}
            required
            className="register-select"
          >
            <option value="">Seleccionar rol</option>
            <option value="admin">Administrador</option>
            <option value="docente">Docente</option>
            <option value="familia">Familia</option>
          </select>

          {/* Botón para enviar el formulario */}
          <button type="submit" className="register-button">Registrar</button>

          {/* Mensaje de respuesta del servidor */}
          <p className="register-message">{mensaje}</p>
        </form>
      </div>
    </div>
  );
}

// Exportamos el componente para que pueda usarse en otras partes del proyecto
export default Register;
