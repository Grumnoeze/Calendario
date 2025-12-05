import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CrearUsuario.css';
import axios from "axios";


function CrearUsuario() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nombre: '',
    correo: '',
    rol: '',
    permisos: {
      tecnico: { ver: false, editar: false },
      socio: { ver: false, editar: false },
      pedagogico: { ver: false, editar: false }
    }
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handlePermisoChange = (dimension, tipo) => {
    setForm(prev => ({
      ...prev,
      permisos: {
        ...prev.permisos,
        [dimension]: {
          ...prev.permisos[dimension],
          [tipo]: !prev.permisos[dimension][tipo]
        }
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Convertir permisos a strings
    const permisoVisualizacion = Object.keys(form.permisos)
      .filter(dim => form.permisos[dim].ver)
      .join(','); // ej: "tecnico,socio"

    const permisoEdicion = Object.keys(form.permisos)
      .filter(dim => form.permisos[dim].editar)
      .join(','); // ej: "pedagogico"

    const nuevoUsuario = {
      Mail: form.correo,
      Name: form.nombre,
      Rol: form.rol,
      PermisoVisualizacion: permisoVisualizacion,
      PermisoEdicion: permisoEdicion
    };

    try {
      const res = await axios.post("http://localhost:3000/api/registrarUsuario", nuevoUsuario);
      console.log("Usuario creado:", res.data);
      navigate("/admin-panel");
    } catch (error) {
      console.error("❌ Error al crear usuario:", error.response?.data || error.message);
    }
  };


  return (
    <div className="crear-usuario-panel">
      <h2 className="titulo-formulario">➕ Agregar Nuevo Usuario</h2>

      <form onSubmit={handleSubmit} className="formulario-admin">
        <div className="grupo-formulario">
          <label>Nombre completo</label>
          <input
            name="nombre"
            placeholder="Ingrese el nombre completo"
            onChange={handleChange}
            required
          />
        </div>

        <div className="grupo-formulario">
          <label>Correo electrónico</label>
          <input
            name="correo"
            type="email"
            placeholder="usuario@"
            onChange={handleChange}
            required
          />
        </div>

        <div className="grupo-formulario">
          <label>Rol</label>
          <select name="rol" onChange={handleChange} required>
            <option value="">Seleccionar rol</option>
            <option value="docente">Docente</option>
            <option value="familia">Familia</option>
          </select>

        </div>

        <fieldset className="seccion-permisos">
          <legend>Permisos por dimensión</legend>

          {[
            { key: 'tecnico', label: '🛠️ Técnico–Administrativa' },
            { key: 'socio', label: '🤝 Socio–Comunitaria' },
            { key: 'pedagogico', label: '📘 Pedagógica–Didáctica' }
          ].map(({ key, label }) => (
            <div key={key} className="grupo-permisos">
              <label className="permiso-titulo">{label}</label>
              <div className="permiso-opciones">
                <label>
                  <input
                    type="checkbox"
                    checked={form.permisos[key].ver}
                    onChange={() => handlePermisoChange(key, 'ver')}
                  />
                  Ver eventos
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={form.permisos[key].editar}
                    onChange={() => handlePermisoChange(key, 'editar')}
                  />
                  Crear/Editar eventos
                </label>
              </div>
            </div>
          ))}
        </fieldset>

        <div className="botones-formulario">
          <button type="button" onClick={() => navigate('/admin-panel')}>Cancelar</button>
          <button type="submit">Crear Usuario</button>
        </div>
      </form>
    </div>
  );
}
export default CrearUsuario;
