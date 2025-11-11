// Importamos hooks de React para manejar estado y efectos
import { useEffect, useState, useRef } from 'react';

// Importamos useNavigate para redireccionar entre vistas
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
  const [eventoHover, setEventoHover] = useState(null);
  const [eventoSeleccionado, setEventoSeleccionado] = useState(null);
  const [menuDesplegableAbierto, setMenuDesplegableAbierto] = useState(false);
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

  useEffect(() => {
    axios.get('http://localhost:3000/api/listarEventos')
      .then(res => {
        const eventosFormateados = res.data.map(ev => ({
          id: ev.Id,
          title: ev.Titulo,
          start: `${ev.FechaInicio}T${ev.HoraInicio}`,
          end: `${ev.FechaFin}T${ev.HoraFin}`,
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


  const handleMouseEnter = (info) => {
    // Guardamos start y end (si existe). Preferimos objetos Date cuando estén disponibles
    const startIso = info.event.start ? info.event.start.toISOString() : info.event.startStr;
    const endIso = info.event.end ? info.event.end.toISOString() : (info.event.endStr || startIso);
    setEventoHover({
      title: info.event.title,
      start: startIso,
      end: endIso,
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

          {/* Desplegable de Eventos */}
          <div className="menu-desplegable-wrapper">
            <button 
              className="menu-btn menu-desplegable-toggle" 
              onClick={() => setMenuDesplegableAbierto(!menuDesplegableAbierto)}
            >
              📋 Eventos<br /><span>Ver y editar eventos</span>
              <span className={`chevron ${menuDesplegableAbierto ? 'abierto' : ''}`}>▼</span>
            </button>
            
            {menuDesplegableAbierto && (
              <div className="menu-desplegable-contenido">
                {eventos.length === 0 ? (
                  <div className="desplegable-vacio">
                    <p>No hay eventos</p>
                  </div>
                ) : (
                  <ul className="eventos-lista">
                    {eventos.slice(0, 5).map(ev => (
                      <li key={ev.id} className="evento-item">
                        <div className="evento-item-info">
                          <p className="evento-item-titulo">{ev.title}</p>
                          <span className="evento-item-fecha">{new Date(ev.start).toLocaleDateString()}</span>
                        </div>
                        <div className="evento-item-acciones">
                          <button 
                            className="btn-item-ver"
                            onClick={() => {
                              setEventoSeleccionado(ev);
                              setMenuDesplegableAbierto(false);
                            }}
                            title="Ver evento"
                          >
                            👁️
                          </button>
                          <button 
                            className="btn-item-editar"
                            onClick={() => navigate("/agregar-evento")}
                            title="Editar evento"
                          >
                            ✏️
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
                {eventos.length > 5 && (
                  <div className="desplegable-footer">
                    <button className="btn-ver-todos" onClick={() => navigate("/buscar-filtrar")}>
                      Ver todos los eventos →
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
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
          /* Hacer que la vista horaria comience a las 08:00 y que el scroll inicial muestre esa franja */
          slotMinTime="08:00:00"
          scrollTime="08:00:00"
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
            <span>
              {new Date(eventoHover.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(eventoHover.end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        )}

        {eventoSeleccionado && (
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

                  <label>🕒 Hora de inicio:</label>
                  <input
                    type="time"
                    value={eventoSeleccionado.start?.slice(11, 16) || ""}
                    readOnly
                    className="hora-input"
                  />

                  <label>Estado:</label>
                  <select
                    value={eventoSeleccionado.estado}
                    onChange={async (e) => {
                      const nuevoEstado = e.target.value;
                      setEventoSeleccionado({ ...eventoSeleccionado, estado: nuevoEstado });
                      actualizarColorEvento(eventoSeleccionado.id, nuevoEstado);
                      await guardarEstadoEnBD(eventoSeleccionado.id, nuevoEstado);
                    }}
                    className="estado-dropdown"
                  >
                    <option value="Pendiente">🕒 Pendiente</option>
                    <option value="Realizado">✅ Realizado</option>
                    <option value="Cancelado">❌ Cancelado</option>
                  </select>

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
          </div>
        )}


      </main>
    </div>
  );
}

export default Calendario;
