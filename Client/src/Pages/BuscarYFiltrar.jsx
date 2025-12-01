import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../api";           // <-- ESTE ES EL CORRECTO
import "./BuscarYFiltrar.css";

export default function BuscarYFiltrar() {
  const navigate = useNavigate();

  const [eventos, setEventos] = useState([]);

  const [filtros, setFiltros] = useState({
    texto: "",
    dimension: "",
    asignadoA: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFiltros({ ...filtros, [name]: value });
  };

  const limpiarFiltros = () => {
    setFiltros({ texto: "", dimension: "", asignadoA: "" });
    setEventos([]);
  };

  const irAlEvento = (eventoId) => {
    navigate("/calendario", { state: { eventoId } });
  };

  useEffect(() => {
    const buscarEventos = async () => {
      try {
        const res = await api.get("/eventos");   // ← usa la instancia con token
        const todos = res.data;

        const filtrados = todos.filter((ev) => {
          const coincideTexto =
            filtros.texto === "" ||
            ev.Titulo.toLowerCase().includes(filtros.texto.toLowerCase()) ||
            ev.Descripcion.toLowerCase().includes(filtros.texto.toLowerCase());

          const coincideDimension =
            filtros.dimension === "" ||
            ev.Dimension === filtros.dimension;

          const coincideAsignado =
            filtros.asignadoA === "" ||
            ev.AsignarA === filtros.asignadoA;

          return coincideTexto && coincideDimension && coincideAsignado;
        });

        setEventos(filtrados);
      } catch (error) {
        console.error("❌ Error al buscar eventos:", error);
      }
    };

    buscarEventos();
  }, [filtros]);

  return (
    <div className="buscar-filtrar-wrapper">

      <h2 className="titulo-vista">🔍 Buscar y Filtrar Eventos</h2>

      <section className="filtros-container">
        <input
          type="text"
          name="texto"
          value={filtros.texto}
          onChange={handleChange}
          placeholder="Buscar por título, descripción o palabra clave..."
          className="input-busqueda"
        />

        <div className="grupo-filtros">
          <select
            name="dimension"
            value={filtros.dimension}
            onChange={handleChange}
            className="filtro-select"
          >
            <option value="">Todas las dimensiones</option>
            <option value="Tecnico-Administrativa">Técnico-Administrativa</option>
            <option value="Socio-Comunitaria">Socio-Comunitaria</option>
            <option value="Pedagogica-Didactica">Pedagógica-Didáctica</option>
          </select>

          <select
            name="asignadoA"
            value={filtros.asignadoA}
            onChange={handleChange}
            className="filtro-select"
          >
            <option value="">Asignado a: Todos</option>
            <option value="docente">Docente</option>
            <option value="director">Director</option>
            <option value="familia">Familia</option>
          </select>

          <button className="btn-limpiar" onClick={limpiarFiltros}>
            Limpiar Filtros
          </button>
        </div>
      </section>

      <section className="tabla-container">
        <h3>Resultados</h3>

        {eventos.length === 0 ? (
          <p>No se encontraron eventos</p>
        ) : (
          <table className="tabla-eventos">
            <thead>
              <tr>
                <th>Título</th>
                <th>Descripción</th>
                <th>Inicio</th>
                <th>Fin</th>
                <th>Dimensión</th>
                <th>Asignado a</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {eventos.map((ev) => (
                <tr key={ev.Id}>
                  <td>{ev.Titulo}</td>
                  <td>{ev.Descripcion}</td>
                  <td>{ev.FechaInicio} {ev.HoraInicio}</td>
                  <td>{ev.FechaFin} {ev.HoraFin}</td>
                  <td>{ev.Dimension}</td>
                  <td>{ev.AsignarA}</td>

                  <td>
                    <button
                      className="btn-tabla-ver"
                      onClick={() => irAlEvento(ev.Id)}
                    >
                      🔗 Abrir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}
