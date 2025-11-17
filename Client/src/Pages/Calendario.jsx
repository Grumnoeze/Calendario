import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es';
import Logo from './img/Logo.jpg';
import './Calendario.css';

function Calendario() {
  const navigate = useNavigate();
  const calendarRef = useRef(null);

  const [eventoEditable, setEventoEditable] = useState(null);
  const [eventos, setEventos] = useState([]);
  const [eventoHover, setEventoHover] = useState(null);
  const [eventoSeleccionado, setEventoSeleccionado] = useState(null);
  const [menuDesplegableAbierto, setMenuDesplegableAbierto] = useState(false);
  const [mostrarDetalles, setMostrarDetalles] = useState(false);
  const prepararEventoEditable = (evento) => {
  const fechaInicio = new Date(evento.start);
  const fechaFin = new Date(evento.end);

  return {
    id: evento.id,
    title: evento.title,
    startDate: fechaInicio.toISOString().slice(0, 10), // yyyy-mm-dd
    startTime: fechaInicio.toISOString().slice(11, 16), // hh:mm
    endDate: fechaFin.toISOString().slice(0, 10),
    endTime: fechaFin.toISOString().slice(11, 16),
    ubicacion: evento.extendedProps?.ubicacion || '',
    materia: evento.extendedProps?.materia || '',
    descripcion: evento.extendedProps?.descripcion || '',
    estado: evento.extendedProps?.estado || 'Pendiente'
  };
};



  const actualizarColorEvento = (id, estado) => {
    const color =
      estado === "Pendiente" ? "#ffeb3b" :
        estado === "Cancelado" ? "#f44336" :
          estado === "Realizado" ? "#4caf50" : "#2196f3";

    setEventos(prev =>
      prev.map(ev =>
        ev.id === id ? { ...ev, backgroundColor: color, extendedProps: { ...ev.extendedProps, estado } } : ev
      )
    );
    setEventoEditable({ ...eventoSeleccionado });

    const calendarApi = calendarRef.current?.getApi();
    const evento = calendarApi?.getEventById(id);
    if (evento) {
      evento.setProp('backgroundColor', color);
      evento.setExtendedProp('estado', estado);
    }
  };
  

  const guardarEstadoEnBD = async (id, estado) => {
    try {
      await axios.put(`http://localhost:3000/api/actualizarEstado/${id}`, { estado });
    } catch (error) {
      console.error("❌ Error al actualizar estado:", error);
    }
  };

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
    setEventoHover({
      title: info.event.title,
      start: info.event.startStr,
      end: info.event.endStr,
      x: info.jsEvent.pageX,
      y: info.jsEvent.pageY
    });
  };

  const handleMouseLeave = () => setEventoHover(null);

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
                              irAlEvento(ev.id);
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
        <h2>📅 Calendario Institucional</h2>

        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
          }}
          events={eventos}
          locale={esLocale}
          height="auto"
          slotMinTime="08:00:00"
          scrollTime="08:00:00"
          eventMouseEnter={handleMouseEnter}
          eventMouseLeave={handleMouseLeave}
          eventClick={(info) => {
            const evento = info.event;
            const estado = evento.extendedProps.estado || "Pendiente";
            setEventoSeleccionado({
              id: evento.id,
              title: evento.title,
              start: evento.startStr,
              end: evento.endStr,
              estado
            });
          }}
        />

        {eventoHover && (
          <div className="popup-evento" style={{ top: eventoHover.y + 10, left: eventoHover.x + 10 }}>
            <strong>{eventoHover.title}</strong><br />
            <span>{new Date(eventoHover.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(eventoHover.end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        )}

        {eventoSeleccionado && (
          <div className="evento-flotante">
            <div className="evento-flotante-contenido">
              <h3>{eventoSeleccionado.title}</h3>
              <label>Estado:</label>
              <select
                value={eventoSeleccionado.estado}
                onChange={async (e) => {
                  const nuevoEstado = e.target.value;
                  setEventoSeleccionado({ ...eventoSeleccionado, estado: nuevoEstado });
                  actualizarColorEvento(eventoSeleccionado.id, nuevoEstado);
                  await guardarEstadoEnBD(eventoSeleccionado.id, nuevoEstado);
                }}
              >
                <option value="Pendiente">🕒 Pendiente</option>
                <option value="Realizado">✅ Realizado</option>
                <option value="Cancelado">❌ Cancelado</option>
              </select>
              <div className="botones-panel">
                <button onClick={() => setEventoSeleccionado(null)}>Cerrar</button>
                <button onClick={() => setMostrarDetalles(true)}>Detalles</button>
              </div>
            </div>
          </div>
        )}
        {mostrarDetalles && eventoEditable && (
          <div className="modal-overlay">
            <div className="modal-detalles">
              <h3>✏️ Editar Evento</h3>

              <label>Título:</label>
              <input
                type="text"
                value={eventoEditable.title}
                onChange={(e) => setEventoEditable({ ...eventoEditable, title: e.target.value })}
              />

              <label>Fecha de inicio:</label>
              <input
                type="datetime-local"
                value={eventoEditable.start}
                onChange={(e) => setEventoEditable({ ...eventoEditable, start: e.target.value })}
              />

              <label>Fecha de fin:</label>
              <input
                type="datetime-local"
                value={eventoEditable.end}
                onChange={(e) => setEventoEditable({ ...eventoEditable, end: e.target.value })}
              />

              <label>Ubicación:</label>
              <input
                type="text"
                value={eventoEditable.ubicacion || ''}
                onChange={(e) => setEventoEditable({ ...eventoEditable, ubicacion: e.target.value })}
              />

              <label>Materia:</label>
              <input
                type="text"
                value={eventoEditable.materia || ''}
                onChange={(e) => setEventoEditable({ ...eventoEditable, materia: e.target.value })}
              />

              <label>Descripción:</label>
              <textarea
                value={eventoEditable.descripcion || ''}
                onChange={(e) => setEventoEditable({ ...eventoEditable, descripcion: e.target.value })}
              />

              <label>Estado:</label>
              <select
                value={eventoEditable.estado}
                onChange={(e) => setEventoEditable({ ...eventoEditable, estado: e.target.value })}
              >
                <option value="Pendiente">🕒 Pendiente</option>
                <option value="Realizado">✅ Realizado</option>
                <option value="Cancelado">❌ Cancelado</option>
              </select>

              <div className="botones-modal">
                <button
                  onClick={async () => {
                    await axios.put(`http://localhost:3000/api/actualizarEvento/${eventoEditable.id}`, eventoEditable);
                    setMostrarDetalles(false);
                    setEventoSeleccionado(null);
                    buscarEventosDesdeBD(); // refresca el calendario
                  }}
                >
                  Guardar cambios
                </button>
                <button onClick={() => setMostrarDetalles(false)}>Cancelar</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default Calendario;
