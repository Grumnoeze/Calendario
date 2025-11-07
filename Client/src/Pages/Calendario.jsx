// Importamos hooks de React para manejar estado y efectos
import { useEffect, useState, useRef } from 'react';

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
  const [eventoSeleccionado, setEventoSeleccionado] = useState(null);
  const calendarRef = useRef(null);
  const guardarEstadoEnBD = async (id, estado) => {
    try {
      await axios.put(`http://localhost:3000/api/actualizarEstado/${id}`, { estado });
    } catch (error) {
      console.error("Error al guardar el estado:", error);
    }
  };



  // Estado para el horario del evento
  const [horaEvento, setHoraEvento] = useState('09:00');
  const actualizarColorEvento = (id, estado) => {
    const nuevoColor =
      estado === "Pendiente" ? "#ffeb3b" :
        estado === "Cancelado" ? "#f44336" :
          estado === "Realizado" ? "#4caf50" : "#2196f3";

    // Actualizamos el estado local
    setEventos(prev => {
      const actualizados = prev.map(ev =>
        ev.id === id
          ? {
            ...ev,
            backgroundColor: nuevoColor,
            extendedProps: { ...ev.extendedProps, estado }
          }
          : ev
      );
      return [...actualizados];
    });

    // Actualizamos directamente en el calendario
    const calendarApi = calendarRef.current?.getApi();
    const evento = calendarApi?.getEventById(id);
    if (evento) {
      evento.setProp('backgroundColor', nuevoColor);
      evento.setExtendedProp('estado', estado);
    }
  };



  // Hook para redireccionar entre rutas
  const navigate = useNavigate();

  // useEffect para cargar los eventos al montar el componente
  useEffect(() => {
    axios.get('http://localhost:3000/api/listarEventos')
      .then(res => {
        const eventosFormateados = res.data.map(ev => ({
          id: ev.Id,
          title: ev.Titulo,
          start: ev.FechaInicio,
          end: ev.FechaFin,
          backgroundColor:
            ev.Estado === 'Pendiente' ? '#ffeb3b' :
              ev.Estado === 'Cancelado' ? '#f44336' :
                ev.Estado === 'Realizado' ? '#4caf50' :
                  ev.Tipo === 'clase' ? '#4caf50' :
                    ev.Tipo === 'reunion' ? '#2196f3' : '#f44336',
          extendedProps: {
            tipo: ev.Tipo,
            estado: ev.Estado || 'Pendiente'
          }
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
          <button className="nuevo-evento" onClick={() => navigate("/agregar-evento")}>+ Nuevo evento</button>
        </header>

        {/* Componente de calendario con eventos cargados */}
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin]}
          initialView="dayGridMonth"
          events={eventos}
          height="auto"
          locale={esLocale}
          eventClick={(info) => {
            const evento = info.event;
            setEventoSeleccionado({
              id: evento.id,
              title: evento.title,
              start: evento.startStr,
              tipo: evento.extendedProps.tipo,
              estado: evento.extendedProps.estado || 'Pendiente'
            });
          }}
        />


        {eventoSeleccionado && (
          <div className="evento-flotante">
            <div className="evento-flotante-contenido">
              <div className="evento-info">
                <h3 className="evento-titulo">{eventoSeleccionado.tipo}</h3>

                <div className="evento-hora-estado">
                  <label>🕒 Hora de inicio:</label>
                  <input type="time" value={eventoSeleccionado.start.slice(11, 16)} readOnly className="hora-input" />

                  <label>Estado:</label>
                  <select
                    value={eventoSeleccionado.estado}
                    onChange={async (e) => {
                      const nuevoEstado = e.target.value;
                      setEventoSeleccionado({ ...eventoSeleccionado, estado: nuevoEstado });
                      actualizarColorEvento(eventoSeleccionado.id, nuevoEstado);
                      await guardarEstadoEnBD(eventoSeleccionado.id, nuevoEstado); // ← guarda en BD
                    }}

                    className="estado-dropdown"
                  >
                    <option value="Pendiente">🕒 Pendiente</option>
                    <option value="Realizado">✅ Realizado</option>
                    <option value="Cancelado">❌ Cancelado</option>
                  </select>

                </div>

                <label>
                  <input type="checkbox" checked={eventoSeleccionado.estado === "Realizado"} readOnly />
                  Evento marcado como realizado
                </label>

                <div className="evento-descripcion">
                  <p>{eventoSeleccionado.title}</p>
                </div>
              </div>

              <div className="evento-acciones">
                <button onClick={() => setEventoSeleccionado(null)}>Cancelar</button>
                <button className="detalles-btn">Detalles</button>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}

// Exportamos el componente para que pueda usarse en otras vistas
export default Calendario;
