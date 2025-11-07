import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import axios from 'axios';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import Logo from './img/Logo.jpg';
import './Calendario.css';
import esLocaleOriginal from '@fullcalendar/core/locales/es';

const esConMayusculas = {
  ...esLocaleOriginal,
  options: {
    ...esLocaleOriginal.options,
    monthNames: [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ],
    monthNamesShort: [
      'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
      'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
    ]
  }
};


function Calendario() {
  const [eventos, setEventos] = useState([]);
  const [estadoSeleccionado, setEstadoSeleccionado] = useState('Todos');
  const [horaEvento, setHoraEvento] = useState('09:00');
  const [eventoHover, setEventoHover] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:3000/api/listarEventos')
      .then(res => {
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

  const handleMouseEnter = (info) => {
    setEventoHover({
      title: info.event.title,
      start: info.event.startStr,
      x: info.jsEvent.pageX,
      y: info.jsEvent.pageY
    });
  };

  const handleMouseLeave = () => {
    setEventoHover(null);
  };

  return (
    <div className="calendario-layout">
      <aside className="sidebar">
        <div className="logo-container">
          <img src={Logo} alt="Logo institucional" className="logo-img" />
          <hr className="logo-divider" />
        </div>

        <h2 className="rol-usuario">Director</h2>

        <nav className="menu-navegacion">
          <button className="menu-btn activo" onClick={() => navigate("/calendario")}>
            📅 Calendario<br /><span>Vista mensual y diaria</span>
          </button>
          <button className="menu-btn" onClick={() => navigate("/agregar-evento")}>
            ➕ Crear evento<br /><span>Crear nuevo evento</span>
          </button>
          <button className="menu-btn" onClick={() => navigate("/buscar-filtrar")}>
            🔍 Buscar y filtrar<br /><span>Buscar un evento específico</span>
          </button>
          <button className="menu-btn" onClick={() => navigate("/admin-panel")}>
            ⚙️ Panel Admin<br /><span>Usuarios y permisos</span>
          </button>
          <button className="menu-btn" onClick={() => navigate("/repositorio")}>
            📁 Repositorio<br /><span>Documento adjunto</span>
          </button>
        </nav>

        <div className="usuario-sidebar">
          <span>Pablo Gómez (admin)</span>
          <button className="cerrar-sesion">Cerrar sesión</button>
        </div>
      </aside>

      <main className="contenido">
        <header className="encabezado">
          <h2>📅 Calendario Institucional</h2>
        </header>

        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
          }}
          events={eventos}
          locale={esConMayusculas}
          height="auto"
          eventMouseEnter={handleMouseEnter}
          eventMouseLeave={handleMouseLeave}
        />

        {eventoHover && (
          <div
            className="popup-evento"
            style={{
              top: eventoHover.y + 10,
              left: eventoHover.x + 10
            }}
          >
            <strong>{eventoHover.title}</strong><br />
            <span>{new Date(eventoHover.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        )}

        <div className="evento-flotante">
          <div className="evento-flotante-contenido">
            <div className="evento-info">
              <h3 className="evento-titulo">Técnico-administrativo</h3>

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

              <div className="evento-descripcion">
                <p>Reunión trimestral con padres de familia para discutir el progreso académico</p>
              </div>
            </div>

            <div className="evento-acciones">
              <button className="detalles-btn">Detalles</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Calendario;
