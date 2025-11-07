import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import './BuscarYFiltrar.css';

function BuscarYFiltrar() {
  const navigate = useNavigate();
  const [eventos, setEventos] = useState([]);
  const [filtros, setFiltros] = useState({
    texto: '',
    dimension: '',
    responsable: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFiltros({ ...filtros, [name]: value });
  };

  const buscarEventos = async () => {
    try {
      const params = new URLSearchParams(filtros);
      const res = await axios.get(`http://localhost:3000/api/filtrarEventos?${params}`);
      setEventos(res.data);
    } catch (error) {
      console.error("❌ Error al buscar eventos:", error);
    }
  };

  const limpiarFiltros = () => {
    setFiltros({ texto: '', dimension: '', responsable: '' });
    setEventos([]);
  };

  useEffect(() => {
    buscarEventos();
  }, [filtros]);

  return (
    <div className="buscar-filtrar-layout">
      <aside className="sidebar">
        {/* Podés reemplazar esto por un componente Sidebar reutilizable */}
        <h2 className="rol-usuario">Director</h2>
        <nav className="menu-navegacion">
          <button className="menu-btn" onClick={() => navigate("/calendario")}>Calendario</button>
          <button className="menu-btn" onClick={() => navigate("/agregar-evento")}>Crear evento</button>
          <button className="menu-btn activo" onClick={() => navigate("/buscar-filtrar")}>Buscar y filtrar</button>
          <button className="menu-btn" onClick={() => navigate("/admin-panel")}>Gestión de usuarios</button>
          <button className="menu-btn" onClick={() => navigate("/repositorio")}>Repositorio</button>
        </nav>
      </aside>

      <main className="contenido">
        <h2 className="titulo-vista">🔍 Buscar Evento</h2>

        <section className="filtros-busqueda">
          <input
            type="text"
            name="texto"
            value={filtros.texto}
            onChange={handleChange}
            placeholder="Buscar por título, descripción o palabra clave..."
            className="input-busqueda"
          />

          <div className="grupo-filtros">
            <select name="dimension" value={filtros.dimension} onChange={handleChange} className="filtro-select">
              <option value="">Todas las dimensiones</option>
              <option value="Tecnico-Administrativa">Técnico-Administrativa</option>
              <option value="Socio-Comunitaria">Socio-Comunitaria</option>
              <option value="Pedadogica-Didactica">Pedagógica-Didáctica</option>
            </select>

            <select name="responsable" value={filtros.responsable} onChange={handleChange} className="filtro-select">
              <option value="">Cualquier responsable</option>
              <option value="docente">Docente</option>
              <option value="director">Director</option>
            </select>

            <button className="btn-limpiar" onClick={limpiarFiltros}>Limpiar Filtros</button>
          </div>
        </section>

        <section className="resultados-busqueda">
          <h3>Resultados</h3>

          {eventos.length === 0 ? (
            <p>No se encontraron eventos</p>
          ) : (
            eventos.map(ev => (
              <div key={ev.Id} className="tarjeta-evento">
                <div className="evento-info">
                  <h4>{ev.Titulo}</h4>
                  <p>{ev.Descripcion}</p>
                  <span className="evento-rango">{ev.FechaInicio} - {ev.FechaFin}</span>
                  <span className="evento-tag">{ev.Dimension}</span>
                </div>
                <div className="evento-acciones">
                  <button className="btn-detalle">Ver detalle</button>
                  <button className="btn-editar">Editar</button>
                </div>
              </div>
            ))
          )}
        </section>
      </main>
    </div>
  );
}

export default BuscarYFiltrar;
