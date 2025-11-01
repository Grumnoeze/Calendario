// Importamos hooks de React para manejar estado y efectos
import { useEffect, useState } from 'react';

// Importamos useNavigate para redireccionar entre vistas
import { useNavigate } from 'react-router-dom';

// Importamos la localización en español para el calendario
import esLocale from '@fullcalendar/core/locales/es';

// Importamos axios para hacer peticiones HTTP
import axios from 'axios';

// Importamos el componente principal de calendario
import FullCalendar from '@fullcalendar/react';

// Importamos el plugin para vista mensual (dayGrid)
import dayGridPlugin from '@fullcalendar/daygrid';

// Importamos el logo institucional
import Logo from './img/Logo.jpg';

// Importamos los estilos específicos del calendario
import './Calendario.css';

// Componente principal del calendario institucional
function Calendario() {
  // Estado para guardar los eventos que vienen del backend
  const [eventos, setEventos] = useState([]);

  // Estado para el selector de estado del evento (realizado, pendiente, cancelado)
  const [estadoSeleccionado, setEstadoSeleccionado] = useState('Todos');

  // Estado para el horario del evento
  const [horaEvento, setHoraEvento] = useState('09:00');

  // Hook para redireccionar entre rutas
  const navigate = useNavigate();

  // useEffect para cargar los eventos al montar el componente
  useEffect(() => {
    axios.get('http://localhost:3000/api/listarEventos')
      .then(res => {
        // Formateamos los eventos para que FullCalendar los entienda
        const eventosFormateados = res.data.map(ev => ({
          title: ev.Titulo,
          start: ev.FechaInicio,
          end: ev.FechaFin,
          backgroundColor: ev.Tipo === 'clase' ? '#4caf50' :
                          ev.Tipo === 'reunion' ? '#2196f3' : '#f44336'
        }));
        setEventos(eventosFormateados);
      })
      .catch(err => console.error(err));
  }, []);

  // Render del componente
  return (
    <div className="calendario-layout">
      {/* 🟦 Barra lateral institucional */}
      <aside className="sidebar">
        <div className="logo-container">
          <img src={Logo} alt="Logo institucional" className="logo-img" />
          <hr className="logo-divider" />
        </div>

        <h2 className="rol-usuario">Director</h2>

        {/* Menú de navegación lateral */}
        <nav className="menu-navegacion">
          <button className="menu-btn activo" onClick={() => navigate("/calendario")}>
            Calendario<br /><span>Vista mensual y diaria</span>
          </button>
          <button className="menu-btn" onClick={() => navigate("/agregar-evento")}>
            Crear evento<br /><span>Crear nuevo evento</span>
          </button>
          <button className="menu-btn" onClick={() => navigate("/buscar-filtrar")}>
            Buscar y filtrar<br /><span>Buscar un evento específico</span>
          </button>
          <button className="menu-btn" onClick={() => navigate("/admin-panel")}>
            Gestión de usuarios<br /><span>Usuarios y permisos</span>
          </button>
          <button className="menu-btn" onClick={() => navigate("/repositorio")}>
            Repositorio<br /><span>Documento adjunto</span>
          </button>
        </nav>
      </aside>

      {/* 🟨 Contenido principal del calendario */}
      <main className="contenido">
        {/* Encabezado con título y botón */}
        <header className="encabezado">
          <h2>📅 Calendario Institucional</h2>
          <button className="nuevo-evento">+ Nuevo evento</button>
        </header>

        {/* Componente de calendario con eventos cargados */}
        <FullCalendar
          plugins={[dayGridPlugin]}         // Plugin para vista mensual
          initialView="dayGridMonth"        // Vista inicial
          events={eventos}                  // Eventos cargados desde el backend
          height="auto"                     // Altura automática
          locale={esLocale}                 // Localización en español
        />

        {/* Panel flotante con detalles del evento */}
        <div className="evento-flotante">
          <div className="evento-flotante-contenido">
            <div className="evento-info">
              <h3 className="evento-titulo">Técnico-administrativo</h3>

              {/* Selector de horario y estado */}
              <div className="evento-hora-estado">
                <label htmlFor="hora">🕒 Horario:</label>
                <input
                  type="time"
                  id="hora"
                  value={horaEvento}
                  onChange={(e) => setHoraEvento(e.target.value)}
                  className="hora-input"
                />

                <select
                  id="estado"
                  value={estadoSeleccionado}
                  onChange={(e) => setEstadoSeleccionado(e.target.value)}
                  className="estado-dropdown"
                >
                  <option value="Realizado">✅ Realizado</option>
                  <option value="Pendiente">🕒 Pendiente</option>
                  <option value="Cancelado">❌ Cancelado</option>
                </select>
              </div>

              {/* Descripción del evento */}
              <div className="evento-descripcion">
                <p>Reunión trimestral con padres de familia para discutir el progreso académico</p>
              </div>
            </div>

            {/* Botón de acción */}
            <div className="evento-acciones">
              <button className="detalles-btn">Detalles</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// Exportamos el componente para que pueda usarse en otras vistas
export default Calendario;
