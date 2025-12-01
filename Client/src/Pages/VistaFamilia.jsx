import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import esLocale from "@fullcalendar/core/locales/es";
import "./Calendario.css";

function VistaFamilia() {
  const navigate = useNavigate();
  const calendarRef = useRef(null);

  const [eventos, setEventos] = useState([]);
  const [eventoHover, setEventoHover] = useState(null);
  const [eventoSeleccionado, setEventoSeleccionado] = useState(null);

  // 📌 Preparar detalles del evento para mostrar
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
    // 📌 Mostrar detalles completos del evento al pasar el mouse
    const detalles = prepararEventoDetalles(info.event);
    setEventoHover({
      ...detalles,
      x: info.jsEvent.pageX,
      y: info.jsEvent.pageY,
    });
  };

  const handleMouseLeave = () => setEventoHover(null);

  return (
    <div className="vista-familia-layout">
      {/* 📌 SIN BARRA LATERAL - SOLO CALENDARIO */}
      <main className="contenido-familia">
        {/* ENCABEZADO */}
        <div className="encabezado-familia">
          <h2 className="main-title">📅 Calendario Institucional</h2>
          <button
            className="btn-cerrar-sesion"
            onClick={() => {
              localStorage.removeItem("usuario");
              navigate("/login");
            }}
          >
            Cerrar sesión
          </button>
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
            // ⚠️ COMENTADO: En familia no se puede editar, solo ver detalles
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

        {/* TOOLTIP AL PASAR MOUSE */}
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
          </div>
        )}

        {/* PANEL FLOTANTE: VER DETALLES (SIN EDICIÓN) */}
        {eventoSeleccionado && (
          <div className="evento-flotante">
            <div className="evento-flotante-contenido">
              <h3>{eventoSeleccionado.title}</h3>

              <p>
                <strong>Estado:</strong> {eventoSeleccionado.estado}
              </p>

              <div className="botones-panel">
                <button onClick={() => setEventoSeleccionado(null)}>
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

export default VistaFamilia;
