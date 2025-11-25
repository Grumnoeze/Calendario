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

function Calendario() {
  const navigate = useNavigate();
  const calendarRef = useRef(null);

  const [eventos, setEventos] = useState([]);
  const [eventoHover, setEventoHover] = useState(null);
  const [eventoSeleccionado, setEventoSeleccionado] = useState(null);
  const [sidebarColapsada, setSidebarColapsada] = useState(false);
  const [mostrarDetalles, setMostrarDetalles] = useState(false);
  const [eventoEditable, setEventoEditable] = useState(null);

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
    setEventoHover({
      title: info.event.title,
      start: info.event.startStr,
      end: info.event.endStr,
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
      permisoVisualizacion:
        evento.extendedProps?.permisoVisualizacion || "N/A",
      permisoEdicion: evento.extendedProps?.permisoEdicion || "N/A",
      recordatorio: evento.extendedProps?.recordatorio || "Sí",
      estado: evento.extendedProps?.estado || "Pendiente",
      tipo: evento.extendedProps?.tipo || "General",
    };
  };

  return (
    <div className={`calendario-layout ${sidebarColapsada ? "colapsado" : ""}`}>
      {/* SIDEBAR */}
      <aside className={`sidebar ${sidebarColapsada ? "colapsada" : ""}`}>
        <div className="logo-container">
          <img src={Logo} alt="Logo institucional" className="logo-img" />
          <hr className="logo-divider" />
        </div>

        <h2 className="rol-usuario">{!sidebarColapsada ? "Director" : ""}</h2>

        <nav className="menu-navegacion">
          <button className={`menu-btn activo`} onClick={() => navigate("/calendario")}>
            📅 {!sidebarColapsada ? "Calendario" : ""}
            {!sidebarColapsada && <span>Vista mensual y diaria</span>}
          </button>

          <button className="menu-btn" onClick={() => navigate("/agregar-evento")}>
            ➕ {!sidebarColapsada ? "Crear evento" : ""}
            {!sidebarColapsada && <span>Crear nuevo evento</span>}
          </button>

          <button className="menu-btn" onClick={() => navigate("/buscar-filtrar")}>
            🔍 {!sidebarColapsada ? "Buscar y filtrar" : ""}
            {!sidebarColapsada && <span>Buscar un evento específico</span>}
          </button>

          <button className="menu-btn" onClick={() => navigate("/admin-panel")}>
            ⚙️ {!sidebarColapsada ? "Panel Admin" : ""}
            {!sidebarColapsada && <span>Usuarios y permisos</span>}
          </button>

          <button className="menu-btn" onClick={() => navigate("/repositorio")}>
            📁 {!sidebarColapsada ? "Repositorio" : ""}
            {!sidebarColapsada && <span>Documento adjunto</span>}
          </button>
        </nav>

        <div className="usuario-sidebar">
          <span>{!sidebarColapsada ? "Pablo Gómez (admin)" : ""}</span>
          <button className="cerrar-sesion">Cerrar sesión</button>
        </div>
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <main className={`contenido ${sidebarColapsada ? "expandido" : ""}`}>
        {/* ENCABEZADO: aquí está el botón hamburguesa integrado a la barra */}
        <div className="encabezado">
          <div className="header-left">
            {/* BOTÓN HAMBURGUESA ubicado dentro del header, esquina izquierda */}
          <button
  className="header-hamburger"
  onClick={() => setSidebarColapsada(!sidebarColapsada)}
  aria-label={sidebarColapsada ? "Abrir menú" : "Cerrar menú"}
>
  {sidebarColapsada ? "☰" : "✖"}
</button>


            {/* TÍTULO */}
            <h2 className="main-title">📅 Calendario Institucional</h2>
          </div>

          {/* MENU DESPLEGABLE ubicado en la esquina derecha del header */}
          <div className="menu-desplegable">
          

            <div className="menu-desplegable-contenido">
              <button onClick={() => navigate("/perfil")}>Perfil</button>
              <button onClick={() => navigate("/configuracion")}>Configuración</button>
              <button onClick={() => console.log("Cerrar sesión")}>Cerrar sesión</button>
            </div>
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
            const estado = evento.extendedProps.estado || "Pendiente";
            setEventoSeleccionado({
              id: evento.id,
              title: evento.title,
              start: evento.startStr,
              end: evento.endStr,
              estado,
            });
          }}
        />

        {eventoHover && (
          <div
            className="popup-evento"
            style={{ top: eventoHover.y + 10, left: eventoHover.x + 10 }}
          >
            <strong>{eventoHover.title}</strong>
            <br />
            <span>
              {new Date(eventoHover.start).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}{" "}
              -{" "}
              {new Date(eventoHover.end).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
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
                      const detalles = prepararEventoDetalles(evento);
                      setEventoEditable(detalles);
                      setMostrarDetalles(true);
                    }
                  }}
                >
                  Detalles
                </button>
              </div>
            </div>
          </div>
        )}

        {mostrarDetalles && eventoEditable && (
          <div className="modal-overlay">
            <div className="modal-detalles">
              <h3>📋 Detalles del evento</h3>

              <p>
                <strong>Título:</strong> {eventoEditable.title}
              </p>
              <p>
                <strong>Fecha inicio:</strong> {eventoEditable.fechaInicio}{" "}
                {eventoEditable.horaInicio}
              </p>
              <p>
                <strong>Fecha fin:</strong> {eventoEditable.fechaFin}{" "}
                {eventoEditable.horaFin}
              </p>
              <p>
                <strong>Ubicación:</strong> {eventoEditable.ubicacion}
              </p>
              <p>
                <strong>Dimensión:</strong> {eventoEditable.dimension}
              </p>
              <p>
                <strong>Asignado a:</strong> {eventoEditable.asignarA}
              </p>
              <p>
                <strong>Materia:</strong> {eventoEditable.materia}
              </p>
              <p>
                <strong>Descripción:</strong> {eventoEditable.descripcion}
              </p>
              <p>
                <strong>Permiso visualización:</strong>{" "}
                {eventoEditable.permisoVisualizacion}
              </p>
              <p>
                <strong>Permiso edición:</strong>{" "}
                {eventoEditable.permisoEdicion}
              </p>
              <p>
                <strong>Recordatorio:</strong> {eventoEditable.recordatorio}
              </p>
              <p>
                <strong>Estado:</strong> {eventoEditable.estado}
              </p>
              <p>
                <strong>Tipo:</strong> {eventoEditable.tipo}
              </p>

              <div className="botones-modal">
                <button onClick={() => setMostrarDetalles(false)}>
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default Calendario;
