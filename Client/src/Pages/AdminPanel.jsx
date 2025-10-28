import { useEffect, useState } from 'react';
import axios from 'axios';

import './pages.css'; 

function AdminPanel() {
  const [eventos, setEventos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    axios.get('http://localhost:3000/api/listarEventos')
      .then(res => setEventos(res.data))
      .catch(err => console.error(err));

    axios.get('http://localhost:3000/api/listarUsuarios')
      .then(res => setUsuarios(res.data))
      .catch(err => console.error(err));
  }, []);

  const eliminarEvento = (id) => {
    axios.delete(`http://localhost:3000/api/eliminarEvento/${id}`)
      .then(() => {
        setEventos(eventos.filter(ev => ev.Id !== id));
        setMensaje("Evento eliminado");
      });
  };

  const eliminarUsuario = (id) => {
    axios.delete(`http://localhost:3000/api/eliminarUsuario/${id}`)
      .then(() => {
        setUsuarios(usuarios.filter(u => u.Id !== id));
        setMensaje("Usuario eliminado");
      });
  };

  return (
    <div>
      <h2>🛠️ Panel de Administración</h2>
      <p>{mensaje}</p>

      <section>
        <h3>📅 Eventos</h3>
        <table>
          <thead>
            <tr>
              <th>Título</th><th>Inicio</th><th>Fin</th><th>Tipo</th><th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {eventos.map(ev => (
              <tr key={ev.Id}>
                <td>{ev.Titulo}</td>
                <td>{ev.FechaInicio}</td>
                <td>{ev.FechaFin}</td>
                <td>{ev.Tipo}</td>
                <td>
                  <button onClick={() => eliminarEvento(ev.Id)}>🗑️</button>
                  <button onClick={() => alert("Función de editar pendiente")}>✏️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section>
        <h3>👥 Usuarios</h3>
        <table>
          <thead>
            <tr>
              <th>Nombre</th><th>Usuario</th><th>Rol</th><th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map(u => (
              <tr key={u.Id}>
                <td>{u.Name}</td>
                <td>{u.User}</td>
                <td>{u.Rol}</td>
                <td>
                  <button onClick={() => eliminarUsuario(u.Id)}>🗑️</button>
                  <button onClick={() => alert("Función de editar pendiente")}>✏️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}

export default AdminPanel;
