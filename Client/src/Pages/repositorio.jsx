import { useState, useEffect, useCallback } from "react";
import api from "../api"; // usa axios con token
import "./repositorio.css";

export default function Repositorio() {
  const [documentos, setDocumentos] = useState([]);
  const [eventos, setEventos] = useState([]);
  const [filtros, setFiltros] = useState({
    texto: "",
    dimension: "",
    materia: "",
  });

  const [mostrarModal, setMostrarModal] = useState(false);
  const [form, setForm] = useState({
    nombre: "",
    dimension: "",
    materia: "",
    eventoId: "",
    archivo: null,
  });

  // =============================
  // 📌 BUSCAR DOCUMENTOS
  // =============================
  const buscarDocumentos = useCallback(async () => {
    try {
      const res = await api.get("/documentos");
      let docs = res.data;

      // FILTROS FRONTEND
      docs = docs.filter((d) => {
        const coincideTexto =
          filtros.texto === "" ||
          d.Nombre.toLowerCase().includes(filtros.texto.toLowerCase());

        const coincideDimension =
          filtros.dimension === "" || d.Dimension === filtros.dimension;

        const coincideMateria =
          filtros.materia === "" || d.Materia === filtros.materia;

        return coincideTexto && coincideDimension && coincideMateria;
      });

      setDocumentos(docs);
    } catch (err) {
      console.error("Error al buscar documentos:", err);
    }
  }, [filtros]);

  useEffect(() => {
    buscarDocumentos();
  }, [buscarDocumentos]);

  // =============================
  // 📌 LISTAR EVENTOS REALES PARA EL SELECT
  // =============================
  useEffect(() => {
    const cargarEventos = async () => {
      try {
        const res = await api.get("/eventos");
        setEventos(res.data);
      } catch (err) {
        console.error("Error al cargar eventos:", err);
      }
    };
    cargarEventos();
  }, []);

  // =============================
  // 📌 Manejo de filtros
  // =============================
  const handleChangeFiltros = (e) => {
    const { name, value } = e.target;
    setFiltros((prev) => ({ ...prev, [name]: value }));
  };

  // =============================
  // 📌 Subir archivo
  // =============================
  const handleUpload = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();
      data.append("archivo", form.archivo);
      data.append("Nombre", form.nombre);
      data.append("Dimension", form.dimension);
      data.append("Materia", form.materia);
      data.append("EventoId", form.eventoId);

      await api.post("/documentos", data);

      setMostrarModal(false);
      buscarDocumentos();
    } catch (err) {
      console.error("Error al subir documento:", err);
    }
  };

  return (
    <div className="repositorio-panel-solo">
      <h1>📁 Repositorio de documentos</h1>

      {/* ===========================
          FILTROS
      ============================ */}
      <section className="filtros-repositorio">
        <input
          type="text"
          name="texto"
          value={filtros.texto}
          onChange={handleChangeFiltros}
          placeholder="Buscar documentos..."
          className="input-busqueda"
        />

        <select
          name="dimension"
          value={filtros.dimension}
          onChange={handleChangeFiltros}
          className="filtro-select"
        >
          <option value="">Todas las dimensiones</option>
          <option value="Tecnico-Administrativa">Técnico-Administrativa</option>
          <option value="Pedagogica-Didactica">Pedagógica-Didáctica</option>
          <option value="Socio-Comunitaria">Socio-Comunitaria</option>
        </select>

        <select
          name="materia"
          value={filtros.materia}
          onChange={handleChangeFiltros}
          className="filtro-select"
        >
          <option value="">Todas las materias</option>
          <option value="Matematicas">Matemáticas</option>
          <option value="Practicas del Lenguaje">
            Prácticas del Lenguaje
          </option>
          <option value="Educacion Fisica">Educación Física</option>
        </select>

        <button className="btn-subir" onClick={() => setMostrarModal(true)}>
          📤 Subir documento
        </button>
      </section>

      {/* ===========================
          LISTA DE DOCUMENTOS
      ============================ */}
      <section className="lista-documentos">
        {documentos.length === 0 ? (
          <p>No se encontraron documentos.</p>
        ) : (
          documentos.map((doc) => (
            <div key={doc.Id} className="tarjeta-documento">
              <h4>{doc.Nombre}</h4>
              <p>
                <strong>Dimensión:</strong> {doc.Dimension}
              </p>
              <p>
                <strong>Materia:</strong> {doc.Materia}
              </p>
              <p>
                <strong>Evento:</strong> {doc.EventoId || "—"}
              </p>

              <a
                className="btn-descargar"
                href={`http://localhost:3000/api/documentos/descargar/${doc.Ruta}`}
              >
                ⬇️ Descargar
              </a>
            </div>
          ))
        )}
      </section>

      {/* ===========================
          MODAL SUBIR DOCUMENTO
      ============================ */}
      {mostrarModal && (
        <div className="modal-overlay">
          <div className="modal-contenido">
            <h3>📤 Subir Documento</h3>

            <form onSubmit={handleUpload}>
              <input
                type="text"
                placeholder="Nombre del archivo"
                required
                onChange={(e) =>
                  setForm((f) => ({ ...f, nombre: e.target.value }))
                }
              />

              <select
                required
                onChange={(e) =>
                  setForm((f) => ({ ...f, dimension: e.target.value }))
                }
              >
                <option value="">Dimensión</option>
                <option value="Tecnico-Administrativa">
                  Técnico-Administrativa
                </option>
                <option value="Pedagogica-Didactica">
                  Pedagógica-Didáctica
                </option>
                <option value="Socio-Comunitaria">Socio-Comunitaria</option>
              </select>

              <select
                required
                onChange={(e) =>
                  setForm((f) => ({ ...f, materia: e.target.value }))
                }
              >
                <option value="">Materia</option>
                <option value="Matematicas">Matemáticas</option>
                <option value="Practicas del Lenguaje">
                  Prácticas del Lenguaje
                </option>
                <option value="Educacion Fisica">Educación Física</option>
              </select>

              <select
                required
                onChange={(e) =>
                  setForm((f) => ({ ...f, eventoId: e.target.value }))
                }
              >
                <option value="">Asociar a evento</option>
                {eventos.map((ev) => (
                  <option key={ev.Id} value={ev.Id}>
                    {ev.Titulo}
                  </option>
                ))}
              </select>

              <input
                type="file"
                required
                onChange={(e) =>
                  setForm((f) => ({ ...f, archivo: e.target.files[0] }))
                }
              />

              <div className="modal-buttons">
                <button type="submit">Subir</button>
                <button type="button" onClick={() => setMostrarModal(false)}>
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
