// Calendario.jsx completo y corregido
import { useState, useEffect, useRef, useCallback } from "react";
import api from "../api";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import esLocale from "@fullcalendar/core/locales/es";
import "./Calendario.css";

const COLORES_ESTADO = {
  Pendiente: "#ffeb3b",
  Realizado: "#4caf50",
  Cancelado: "#f44336",
};

export default function Calendario() {
  const calendarRef = useRef(null);
  const [docsEvento, setDocsEvento] = useState([]);

  const [eventos, setEventos] = useState([]);
  const [eventoSeleccionado, setEventoSeleccionado] = useState(null);
  const [modalDetalles, setModalDetalles] = useState(null);
  const [modalEditar, setModalEditar] = useState(null);

  const obtenerColor = useCallback((estado, tipo) => {
    return (
      COLORES_ESTADO[estado] ||
      (tipo === "clase"
        ? "#4caf50"
        : tipo === "reunion"
          ? "#2196f3"
          : "#f44336")
    );
  }, []);

  // FORMATEO PARA MOSTRAR SOLO HH:mm
  const limpiarHora = (horaISO) => {
    if (!horaISO) return "";
    const sinTZ = horaISO.split(/[+-]/)[0];
    return sinTZ.slice(0, 5);
  };

  // ============================
  //   CARGAR EVENTOS DESDE BD
  // ============================
  // cargar eventos al inicio
  useEffect(() => {
    const cargarEventos = async () => {
      try {
        const res = await api.get("/eventos");
        const eventosFormateados = res.data.map((ev) => ({
          id: ev.Id,
          title: ev.Titulo,
          start: `${ev.FechaInicio}T${ev.HoraInicio}`,
          end: `${ev.FechaFin}T${ev.HoraFin}`,
          backgroundColor: obtenerColor(ev.Estado || "Pendiente", ev.Tipo),
          extendedProps: {
            estado: ev.Estado,
            descripcion: ev.Descripcion,
            ubicacion: ev.Ubicacion,
            dimension: ev.Dimension,
            asignarA: ev.AsignarA,
            materia: ev.Materia,
            tipo: ev.Tipo,
            archivoAdjunto: ev.ArchivoAdjunto,
          },
        }));
        setEventos(eventosFormateados);
      } catch (e) {
        console.error("❌ Error cargando eventos", e);
      }
    };

    cargarEventos();
  }, [obtenerColor]);

  // cargar documentos cuando se abre modalDetalles
  useEffect(() => {
    if (modalDetalles?.id) {
      api.get(`/documentos/evento/${modalDetalles.id}`)
        .then(res => setDocsEvento(res.data))
        .catch(err => console.error("Error cargando documentos del evento", err));
    } else {
      setDocsEvento([]); // limpiar cuando se cierra el modal
    }
  }, [modalDetalles]);




  // ============================
  //   ACTUALIZAR ESTADO EN BD
  // ============================
  const actualizarEstadoBD = async (id, nuevoEstado) => {
    try {
      await api.put(`/eventos/actualizarEstado/${id}`, {
        estado: nuevoEstado,
      });
    } catch (e) {
      console.error("❌ Error actualizando estado en BD", e);
    }
  };

  // ============================
  //   ACTUALIZAR SOLO EN PANTALLA
  // ============================
  const actualizarEstadoEnPantalla = (id, nuevoEstado) => {
    const calendar = calendarRef.current?.getApi();
    const evento = calendar?.getEventById(id);
    if (!evento) return;

    const nuevoColor = obtenerColor(nuevoEstado, evento.extendedProps.tipo);

    evento.setExtendedProp("estado", nuevoEstado);
    evento.setProp("backgroundColor", nuevoColor);

    setEventos((prev) =>
      prev.map((ev) =>
        ev.id === id
          ? {
            ...ev,
            backgroundColor: nuevoColor,
            extendedProps: {
              ...ev.extendedProps,
              estado: nuevoEstado,
            },
          }
          : ev
      )
    );
  };

  // ============================
  //   CLICK EN EVENTO
  // ============================
  const handleEventClick = (info) => {
    const ev = info.event;
    setEventoSeleccionado({
      id: ev.id,
      titulo: ev.title,
      inicio: ev.startStr,
      fin: ev.endStr,
      estado: ev.extendedProps.estado || "Pendiente",
      ubicacion: ev.extendedProps.ubicacion,
      descripcion: ev.extendedProps.descripcion,
      dimension: ev.extendedProps.dimension,
      materia: ev.extendedProps.materia,
      asignarA: ev.extendedProps.asignarA,
      archivoAdjunto: ev.extendedProps.archivoAdjunto // 👈 importante
    });
  };




  // ============================
  //     CAMBIAR ESTADO
  // ============================
  const cambiarEstado = async (nuevoEstado) => {
    if (!eventoSeleccionado) return;

    const id = eventoSeleccionado.id;

    actualizarEstadoEnPantalla(id, nuevoEstado);
    await actualizarEstadoBD(id, nuevoEstado);

    setEventoSeleccionado((prev) => ({
      ...prev,
      estado: nuevoEstado,
    }));
  };

  const guardarCambiosEvento = async () => {
    try {
      console.log("GUARDAR EVENTO EDITADO", modalEditar);

      if (!modalEditar) return;

      const data = {
        Titulo: modalEditar.titulo,
        Descripcion: modalEditar.descripcion,
        Ubicacion: modalEditar.ubicacion,
        FechaInicio: modalEditar.inicio.split("T")[0],
        HoraInicio: modalEditar.inicio.split("T")[1],
        FechaFin: modalEditar.fin.split("T")[0],
        HoraFin: modalEditar.fin.split("T")[1],
        Estado: modalEditar.estado || "Pendiente",
      };

      // 👉 Usamos TU instancia axios con baseURL + token automático
      await api.put(`/eventos/${modalEditar.id}`, data);

      console.log("✔ Evento actualizado en la BD");

      // 👉 Actualizamos también en pantalla
      setEventos(prev =>
        prev.map(ev =>
          ev.id === modalEditar.id
            ? {
              ...ev,
              title: data.Titulo,
              start: `${data.FechaInicio}T${data.HoraInicio}`,
              end: `${data.FechaFin}T${data.HoraFin}`,
              extendedProps: {
                ...ev.extendedProps,
                descripcion: data.Descripcion,
                ubicacion: data.Ubicacion,
                estado: data.Estado,
              }
            }
            : ev
        )
      );

      setModalEditar(null);
    } catch (error) {
      console.error("❌ Error al guardar el evento editado:", error);
    }
  };

  return (
    <div className="calendario-contenedor">
      <div className="calendario-box">
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{ left: 'prev,next today', center: 'title', right: 'dayGridMonth,timeGridWeek,timeGridDay' }}
          locale={esLocale}
          height="auto"
          events={eventos}
          eventClick={handleEventClick}
          eventMouseEnter={() => {
            // opción: mostrar tooltip o manejar hover
            // actualmente no hacemos nada para evitar errores
          }}
          eventMouseLeave={() => {
            // limpiar tooltip si se implementa en el futuro
          }}
        />
      </div>

      {eventoSeleccionado && (
        <div className="panel-evento">
          <h3>{eventoSeleccionado.titulo}</h3>

          <p>📍 {eventoSeleccionado.ubicacion}</p>
          <p>🕒 Inicio: {eventoSeleccionado.inicio}</p>
          <p>🕒 Fin: {eventoSeleccionado.fin}</p>
          <p>{eventoSeleccionado.descripcion}</p>

          <label>Estado del evento:</label>
          <select
            value={eventoSeleccionado.estado}
            onChange={(e) => cambiarEstado(e.target.value)}
          >
            <option value="Pendiente">🟡 Pendiente</option>
            <option value="Realizado">🟢 Realizado</option>
            <option value="Cancelado">🔴 Cancelado</option>
          </select>

          <button onClick={() => setEventoSeleccionado(null)}>Cerrar</button>
          <button
            className="btn-detalles"
            onClick={() => setModalDetalles(eventoSeleccionado)}
          >
            Detalles
          </button>
        </div>
      )}

      {/* MODAL DETALLES */}
      {modalDetalles && (

        <div className="modal-overlay">
          <div className="modal">
            <h2>Detalles del Evento</h2>

            <p><strong>Título:</strong> {modalDetalles.titulo}</p>
            <p><strong>Descripción:</strong> {modalDetalles.descripcion}</p>
            <p><strong>Ubicación:</strong> {modalDetalles.ubicacion}</p>
            <p><strong>Inicio:</strong> {modalDetalles.inicio}</p>
            <p><strong>Fin:</strong> {modalDetalles.fin}</p>
            <p><strong>Estado:</strong> {modalDetalles.estado}</p>

            {modalDetalles.dimension && (
              <p><strong>Dimensión:</strong> {modalDetalles.dimension}</p>
            )}

            {modalDetalles.materia && (
              <p><strong>Materia:</strong> {modalDetalles.materia}</p>
            )}

            {modalDetalles.asignadoNombre && (
              <p><strong>Asignado a:</strong> {modalDetalles.asignadoNombre}</p>
            )}


            {docsEvento.length > 0 && (
              <div>
                <strong>Archivos adjuntos:</strong>
                <ul>
                  {docsEvento.map(doc => (
                    <li key={doc.Id}>
                      <a
                        href={`http://localhost:3000/uploads/eventos/${doc.Ruta}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        📂 {doc.Nombre}
                      </a>
                    </li>
                  ))}
                </ul>
                <a href={`/repositorio?eventoId=${modalDetalles.id}`}>
                  👉 Ver todos en repositorio
                </a>
              </div>
            )}



            <div className="modal-botones">
              <button
                className="btn-editar"
                onClick={() => {
                  setModalEditar(modalDetalles);
                  setModalDetalles(null);
                }}
              >
                Editar
              </button>

              <button className="btn-cerrar" onClick={() => setModalDetalles(null)}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL EDITAR */}
      {modalEditar && (
        <div className="modal-overlay">
          <div className="modal modal-editar">
            <h2>Editar Evento</h2>

            <div className="grupo-form">
              <label>Título</label>
              <input
                value={modalEditar.titulo}
                onChange={(e) =>
                  setModalEditar((prev) => ({ ...prev, titulo: e.target.value }))
                }
              />
            </div>

            <div className="grupo-form-row">
              <div className="grupo-form">
                <label>Fecha inicio</label>
                <input
                  type="date"
                  value={modalEditar.inicio?.split("T")[0]}
                  onChange={(e) =>
                    setModalEditar((prev) => ({
                      ...prev,
                      inicio: `${e.target.value}T${prev.inicio.split("T")[1]}`,
                    }))
                  }
                />
              </div>

              <div className="grupo-form">
                <label>Fecha fin</label>
                <input
                  type="date"
                  value={modalEditar.fin?.split("T")[0]}
                  onChange={(e) =>
                    setModalEditar((prev) => ({
                      ...prev,
                      fin: `${e.target.value}T${prev.fin.split("T")[1]}`,
                    }))
                  }
                />
              </div>
            </div>

            <div className="grupo-form-row">
              <div className="grupo-form">
                <label>Hora inicio</label>
                <input
                  type="time"
                  value={limpiarHora(modalEditar.inicio?.split("T")[1])}
                  onChange={(e) =>
                    setModalEditar((prev) => ({
                      ...prev,
                      inicio: `${prev.inicio.split("T")[0]}T${e.target.value}`,
                    }))
                  }
                />
              </div>

              <div className="grupo-form">
                <label>Hora fin</label>
                <input
                  type="time"
                  value={limpiarHora(modalEditar.fin?.split("T")[1])}
                  onChange={(e) =>
                    setModalEditar((prev) => ({
                      ...prev,
                      fin: `${prev.fin.split("T")[0]}T${e.target.value}`,
                    }))
                  }
                />
              </div>
            </div>

            <div className="grupo-form">
              <label>Ubicación</label>
              <input
                value={modalEditar.ubicacion}
                onChange={(e) =>
                  setModalEditar((prev) => ({

                    ...prev,
                    ubicacion: e.target.value,
                  }))
                }
              />
            </div>

            <div className="grupo-form">
              <label>Descripción</label>
              <textarea
                value={modalEditar.descripcion}
                onChange={(e) =>
                  setModalEditar((prev) => ({
                    ...prev,
                    descripcion: e.target.value,
                  }))
                }
              />
            </div>

            <div className="grupo-form">
              <label>Estado</label>
              <select
                value={modalEditar.estado}
                onChange={(e) =>
                  setModalEditar((prev) => ({
                    ...prev,
                    estado: e.target.value,
                  }))
                }
              >
                <option value="Pendiente">Pendiente</option>
                <option value="Realizado">Realizado</option>
                <option value="Cancelado">Cancelado</option>
              </select>
            </div>

            <div className="acciones-modal">
              <button className="btn-guardar" onClick={guardarCambiosEvento}>
                Guardar cambios
              </button>

              <button className="btn-cerrar" onClick={() => setModalEditar(null)}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
