import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import esLocale from "@fullcalendar/core/locales/es";
import Logo from "./img/Logo.jpg";
import "./Calendario.css";

function VistaDocente() {
  const navigate = useNavigate();
  const calendarRef = useRef(null);

  const [eventos, setEventos] = useState([]);
  const [eventoHover, setEventoHover] = useState(null);
  const [eventoSeleccionado, setEventoSeleccionado] = useState(null);
  const [sidebarColapsada, setSidebarColapsada] = useState(false);

  // 📌 NUEVO: Estados para el modal de edición
  const [mostrarModalEdicion, setMostrarModalEdicion] = useState(false);
  const [eventoEnEdicion, setEventoEnEdicion] = useState(null);
  const [formEdicion, setFormEdicion] = useState({
    titulo: '',
    descripcion: '',
    fechaInicio: '',
    horaInicio: '',
    fechaFin: '',
    horaFin: '',
    ubicacion: '',
    dimension: '',
    asignarA: '',
    materia: '',
    tipo: '',
    estado: 'Pendiente',
  });

  const actualizarColorEvento = (id, estado) => {
    const color =
      estado === "Pendiente"
        ? "#ffeb3b"
        : estado === "Cancelado"
        ? "#f44336"
        : estado === "Realizado"
        ? "#4caf50"
        : "#2196f3";

    setEventos((prev) =>
      prev.map((ev) =>
        ev.id === id
          ? {
              ...ev,
              backgroundColor: color,
              extendedProps: { ...ev.extendedProps, estado },
            }
          : ev
      )
    );

    const calendarApi = calendarRef.current?.getApi();
    const evento = calendarApi?.getEventById(id);
    if (evento) {
      evento.setProp("backgroundColor", color);
      evento.setExtendedProp("estado", estado);
    }
  };

  const guardarEstadoEnBD = async (id, estado) => {
    try {
      await axios.put(
        `http://localhost:3000/api/actualizarEstado/${id}`,
        { estado }
      );
    } catch (error) {
      console.error("❌ Error al actualizar estado:", error);
    }
  };

  // 📌 NUEVO: Función para abrir modal de edición
  const abrirModalEdicion = (evento) => {
    const fechaInicio = new Date(evento.start);
    const fechaFin = new Date(evento.end);

    setEventoEnEdicion(evento);
    setFormEdicion({
      titulo: evento.title,
      descripcion: evento.extendedProps?.descripcion || '',
      fechaInicio: fechaInicio.toISOString().split('T')[0],
      horaInicio: fechaInicio.toTimeString().slice(0, 5),
      fechaFin: fechaFin.toISOString().split('T')[0],
      horaFin: fechaFin.toTimeString().slice(0, 5),
      ubicacion: evento.extendedProps?.ubicacion || '',
      dimension: evento.extendedProps?.dimension || '',
      asignarA: evento.extendedProps?.asignarA || '',
      materia: evento.extendedProps?.materia || '',
      tipo: evento.extendedProps?.tipo || '',
      estado: evento.extendedProps?.estado || 'Pendiente',
    });
    setMostrarModalEdicion(true);
  };

  // 📌 NUEVO: Función para manejar cambios en el formulario de edición
  const manejarCambioEdicion = (e) => {
    const { name, value } = e.target;
    setFormEdicion(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // 📌 NUEVO: Función para guardar cambios del evento
  const guardarCambiosEvento = async () => {
    try {
      // ⚠️ COMENTADO: Descomenta cuando el endpoint esté disponible:
      // await axios.put(
      //   `http://localhost:3000/api/actualizarEvento/${eventoEnEdicion.id}`,
      //   { ...formEdicion }
      // );
      
      console.log("✅ Evento actualizado (simulado):", formEdicion);
      setMostrarModalEdicion(false);
    } catch (error) {
      console.error("❌ Error al guardar cambios:", error);
    }
  };

  // Cargar eventos
  useEffect(() => {
    axios
      .get("http://localhost:3000/api/listarEventos")
      .then((res) => {
        const eventosFormateados = res.data.map((ev) => ({
          id: ev.Id,
          title: ev.Titulo,
          start: `${ev.FechaInicio}T${ev.HoraInicio}`,
          end: `${ev.FechaFin}T${ev.HoraFin}`,
          backgroundColor:
            ev.Estado === "Pendiente"
              ? "#ffeb3b"
              : ev.Estado === "Cancelado"
              ? "#f44336"
              : ev.Estado === "Realizado"
              ? "#4caf50"
              : ev.Tipo === "clase"
              ? "#4caf50"
              : ev.Tipo === "reunion"
              ? "#2196f3"
              : "#f44336",
          extendedProps: {
            estado: ev.Estado || "Pendiente",
            ubicacion: ev.Ubicacion,
            dimension: ev.Dimension,
            asignarA: ev.AsignarA,
            descripcion: ev.Descripcion,
            materia: ev.Materia,
            permisoVisualizacion: ev.PermisoVisualizacion,
            permisoEdicion: ev.PermisoEdicion,
            recordatorio: ev.Recordatorio,
            tipo: ev.Tipo,
            usuarioId: ev.UsuarioId,
          },
        }));
        setEventos(eventosFormateados);
      })
      .catch((err) => console.error(err));
  }, []);

  const handleMouseEnter = (info) => {
    const detalles = prepararEventoDetalles(info.event);
    setEventoHover({
      ...detalles,
      x: info.jsEvent.pageX,
      y: info.jsEvent.pageY,
    });
  };

  const handleMouseLeave = () => setEventoHover(null);

  const prepararEventoDetalles = (evento) => {
    const fechaInicio = new Date(evento.start);
    const fechaFin = new Date(evento.end);

    return {
      id: evento.id,
      title: evento.title,
      fechaInicio: fechaInicio.toLocaleDateString(),
      horaInicio: fechaInicio.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      fechaFin: fechaFin.toLocaleDateString(),
      horaFin: fechaFin.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      ubicacion: evento.extendedProps?.ubicacion || "Sin ubicación",
      dimension: evento.extendedProps?.dimension || "Sin dimensión",
      asignarA: evento.extendedProps?.asignarA || "No asignado",
      descripcion: evento.extendedProps?.descripcion || "Sin descripción",
      materia: evento.extendedProps?.materia || "Sin materia",
      permisoVisualizacion: evento.extendedProps?.permisoVisualizacion || "N/A",
      permisoEdicion: evento.extendedProps?.permisoEdicion || "N/A",
      recordatorio: evento.extendedProps?.recordatorio || "Sí",
      estado: evento.extendedProps?.estado || "Pendiente",
      tipo: evento.extendedProps?.tipo || "General",
    };
  };

  return (
    <div className={`calendario-layout ${sidebarColapsada ? "colapsado" : ""}`}>
      {/* SIDEBAR - MENÚ DOCENTE */}
      <aside className={`sidebar ${sidebarColapsada ? "colapsada" : ""}`}>
        <div className="logo-container">
          <img src={Logo} alt="Logo institucional" className="logo-img" />
          <hr className="logo-divider" />
        </div>

        <h2 className="rol-usuario">{!sidebarColapsada ? "Docente" : ""}</h2>

        <nav className="menu-navegacion">
          {/* 📌 MENÚ LIMITADO: Solo Calendario, Agregar Evento, Buscar */}
          <button
            className="menu-btn activo"
            onClick={() => navigate("/vista-docente")}
          >
            📅 {!sidebarColapsada ? "Calendario" : ""}
            {!sidebarColapsada && <span>Vista mensual y diaria</span>}
          </button>

          <button
            className="menu-btn"
            onClick={() => navigate("/agregar-evento")}
          >
            ➕ {!sidebarColapsada ? "Crear evento" : ""}
            {!sidebarColapsada && <span>Crear nuevo evento</span>}
          </button>

          <button
            className="menu-btn"
            onClick={() => navigate("/buscar-filtrar")}
          >
            🔍 {!sidebarColapsada ? "Buscar y filtrar" : ""}
            {!sidebarColapsada && <span>Buscar un evento específico</span>}
          </button>
        </nav>

        <div className="usuario-sidebar">
          <span>{!sidebarColapsada ? "Docente" : ""}</span>
          <button
            className="cerrar-sesion"
            onClick={() => {
              localStorage.removeItem("usuario");
              navigate("/login");
            }}
          >
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <main className={`contenido ${sidebarColapsada ? "expandido" : ""}`}>
        {/* ENCABEZADO */}
        <div className="encabezado">
          <div className="header-left">
            <button
              className="header-hamburger"
              onClick={() => setSidebarColapsada(!sidebarColapsada)}
              aria-label={sidebarColapsada ? "Abrir menú" : "Cerrar menú"}
            >
              {sidebarColapsada ? "☰" : "✖"}
            </button>

            <h2 className="main-title">📅 Calendario Institucional</h2>
          </div>
        </div>

        {/* CALENDARIO */}
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
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
            setEventoSeleccionado({
              id: evento.id,
              title: evento.title,
              start: evento.startStr,
              end: evento.endStr,
              estado: evento.extendedProps.estado || "Pendiente",
            });
          }}
        />

        {/* TOOLTIP */}
        {eventoHover && (
          <div
            className="popup-evento"
            style={{ top: eventoHover.y + 10, left: eventoHover.x + 10 }}
          >
            <strong>{eventoHover.title}</strong>
            <br />
            <span className="popup-tiempo">
              {eventoHover.horaInicio} - {eventoHover.horaFin}
            </span>
            <br />
            <span className="popup-fecha">{eventoHover.fechaInicio}</span>
            {eventoHover.ubicacion && eventoHover.ubicacion !== "Sin ubicación" && (
              <>
                <br />
                <span className="popup-info">📍 {eventoHover.ubicacion}</span>
              </>
            )}
            {eventoHover.dimension && eventoHover.dimension !== "Sin dimensión" && (
              <>
                <br />
                <span className="popup-info">📊 {eventoHover.dimension}</span>
              </>
            )}
            {eventoHover.asignarA && eventoHover.asignarA !== "No asignado" && (
              <>
                <br />
                <span className="popup-info">👤 {eventoHover.asignarA}</span>
              </>
            )}
          </div>
        )}

        {/* PANEL FLOTANTE: VER Y EDITAR EVENTO */}
        {eventoSeleccionado && (
          <div className="evento-flotante">
            <div className="evento-flotante-contenido">
              <h3>{eventoSeleccionado.title}</h3>
              <label>Estado:</label>
              <select
                value={eventoSeleccionado.estado}
                onChange={async (e) => {
                  const nuevoEstado = e.target.value;
                  setEventoSeleccionado({
                    ...eventoSeleccionado,
                    estado: nuevoEstado,
                  });
                  actualizarColorEvento(eventoSeleccionado.id, nuevoEstado);
                  await guardarEstadoEnBD(eventoSeleccionado.id, nuevoEstado);
                }}
              >
                <option value="Pendiente">🕒 Pendiente</option>
                <option value="Realizado">✅ Realizado</option>
                <option value="Cancelado">❌ Cancelado</option>
              </select>
              <div className="botones-panel">
                <button onClick={() => setEventoSeleccionado(null)}>
                  Cerrar
                </button>
                <button
                  onClick={() => {
                    const calendarApi = calendarRef.current?.getApi();
                    const evento = calendarApi?.getEventById(
                      eventoSeleccionado.id
                    );
                    if (evento) {
                      abrirModalEdicion(evento);
                      setEventoSeleccionado(null);
                    }
                  }}
                >
                  Editar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 📌 MODAL DE EDICIÓN */}
        {mostrarModalEdicion && eventoEnEdicion && (
          <div className="modal-overlay">
            <div className="modal-edicion">
              <h3>✏️ Editar Evento</h3>

              <form onSubmit={(e) => { e.preventDefault(); guardarCambiosEvento(); }}>
                <div className="form-grupo">
                  <label>Título:</label>
                  <input
                    type="text"
                    name="titulo"
                    value={formEdicion.titulo}
                    onChange={manejarCambioEdicion}
                    required
                  />
                </div>

                <div className="form-grupo">
                  <label>Descripción:</label>
                  <textarea
                    name="descripcion"
                    value={formEdicion.descripcion}
                    onChange={manejarCambioEdicion}
                    rows="3"
                  ></textarea>
                </div>

                <div className="form-grupo">
                  <label>Fecha Inicio:</label>
                  <input
                    type="date"
                    name="fechaInicio"
                    value={formEdicion.fechaInicio}
                    onChange={manejarCambioEdicion}
                    required
                  />
                </div>

                <div className="form-grupo">
                  <label>Hora Inicio:</label>
                  <input
                    type="time"
                    name="horaInicio"
                    value={formEdicion.horaInicio}
                    onChange={manejarCambioEdicion}
                    required
                  />
                </div>

                <div className="form-grupo">
                  <label>Fecha Fin:</label>
                  <input
                    type="date"
                    name="fechaFin"
                    value={formEdicion.fechaFin}
                    onChange={manejarCambioEdicion}
                    required
                  />
                </div>

                <div className="form-grupo">
                  <label>Hora Fin:</label>
                  <input
                    type="time"
                    name="horaFin"
                    value={formEdicion.horaFin}
                    onChange={manejarCambioEdicion}
                    required
                  />
                </div>

                <div className="form-grupo">
                  <label>Ubicación:</label>
                  <input
                    type="text"
                    name="ubicacion"
                    value={formEdicion.ubicacion}
                    onChange={manejarCambioEdicion}
                  />
                </div>

                <div className="form-grupo">
                  <label>Dimensión:</label>
                  <select
                    name="dimension"
                    value={formEdicion.dimension}
                    onChange={manejarCambioEdicion}
                  >
                    <option value="">Selecciona dimensión</option>
                    <option value="Tecnico-Administrativa">Técnico-Administrativa</option>
                    <option value="Socio-Comunitaria">Socio-Comunitaria</option>
                    <option value="Pedagogica-Didactica">Pedagógica-Didáctica</option>
                  </select>
                </div>

                <div className="form-grupo">
                  <label>Asignar A:</label>
                  <input
                    type="text"
                    name="asignarA"
                    value={formEdicion.asignarA}
                    onChange={manejarCambioEdicion}
                  />
                </div>

                <div className="form-grupo">
                  <label>Materia:</label>
                  <input
                    type="text"
                    name="materia"
                    value={formEdicion.materia}
                    onChange={manejarCambioEdicion}
                  />
                </div>

                <div className="form-grupo">
                  <label>Tipo:</label>
                  <input
                    type="text"
                    name="tipo"
                    value={formEdicion.tipo}
                    onChange={manejarCambioEdicion}
                  />
                </div>

                <div className="form-grupo">
                  <label>Estado:</label>
                  <select
                    name="estado"
                    value={formEdicion.estado}
                    onChange={manejarCambioEdicion}
                  >
                    <option value="Pendiente">🕒 Pendiente</option>
                    <option value="Realizado">✅ Realizado</option>
                    <option value="Cancelado">❌ Cancelado</option>
                  </select>
                </div>

                <div className="botones-modal-edicion">
                  <button type="button" onClick={() => setMostrarModalEdicion(false)} className="btn-cancelar">
                    Cancelar
                  </button>
                  <button type="submit" className="btn-guardar">
                    Guardar Cambios
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default VistaDocente;
