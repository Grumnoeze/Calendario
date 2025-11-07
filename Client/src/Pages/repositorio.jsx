import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Logo from './img/Logo.jpg';
import './repositorio.css';


function Repositorio() {
  const navigate = useNavigate();
  const [documentos, setDocumentos] = useState([]);
  const [filtros, setFiltros] = useState({ texto: '', dimension: '', materia: '' });

  const buscarDocumentos = async () => {
    const params = new URLSearchParams(filtros);
    const res = await axios.get(`http://localhost:3000/api/documentos?${params}`);
    console.log("Documentos recibidos:", res.data);
    setDocumentos(res.data);
  };
  const [mostrarModal, setMostrarModal] = useState(false);
  const [form, setForm] = useState({
    nombre: '',
    dimension: '',
    materia: '',
    eventoId: '',
    archivo: null
  });


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFiltros(prev => ({ ...prev, [name]: value }));
  };


  useEffect(() => {
    buscarDocumentos();
  }, [filtros]);

  return (
    <div className="repositorio-layout">
      {/* 🟦 Barra lateral institucional */}
      <aside className="sidebar">
        <div className="logo-container">
          <img src={Logo} alt="Logo institucional" className="logo-img" />
          <hr className="logo-divider" />
        </div>

        <h2 className="rol-usuario">Director</h2>

        <nav className="menu-navegacion">
          <button className="menu-btn" onClick={() => navigate("/calendario")}>
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
          <button className="menu-btn activo" onClick={() => navigate("/repositorio")}>
            📁 Repositorio<br /><span>Documento adjunto</span>
          </button>
        </nav>

        <div className="usuario-sidebar">
          <span>👤 Pablo Gómez (admin)</span>
          <button className="cerrar-sesion" onClick={() => {
            localStorage.removeItem("usuario");
            navigate("/login");
          }}>
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* 🟨 Panel horizontal: filtros + tarjetas */}
      <main className="repositorio-panel">
        <section className="repositorio-superior">
          <div className="filtros-repositorio">
            <input
              type="text"
              name="texto"
              value={filtros.texto}
              onChange={handleChange}
              placeholder="🔍 Buscar documentos por nombre o evento..."
              className="input-busqueda"
            />

            <div className="grupo-filtros">
              <select name="dimension" value={filtros.dimension} onChange={handleChange} className="filtro-select">
                <option value="">📂 Todas las dimensiones</option>
                <option value="Tecnico-Administrativa">🛠️ Técnico-Administrativa</option>
                <option value="Pedadogica-Didactica">📘 Pedagógico-Didáctica</option>
                <option value="Socio-Comunitaria">🤝 Socio-Comunitaria</option>
              </select>

              <select name="materia" value={filtros.materia} onChange={handleChange} className="filtro-select">
                <option value="">📚 Materia</option>
                <option value="Matematicas">➗ Matemática</option>
                <option value="Practicas del Lenguaje">📖 Lengua</option>
                <option value="Educacion Fisica">🏃 Educación Física</option>
              </select>
            </div>
          </div>

          <button className="btn-subir" onClick={() => setMostrarModal(true)}>
            📤 Subir nuevo documento
          </button>

          <div className="lista-documentos">
            {documentos.length === 0 ? (
              <p>No se encontraron documentos</p>
            ) : (
              documentos.map(doc => (
                <div key={doc.Id} className="tarjeta-documento">
                  <div className="documento-info">
                    <span className={`etiqueta ${doc.Dimension.toLowerCase()}`}>{doc.Dimension}</span>
                    <h4>{doc.Nombre}</h4>
                    <p>📅 Evento ID: {doc.EventoId}</p>
                    <p>📚 Materia: {doc.Materia}</p>
                    <p>🗓️ Fecha: {doc.FechaSubida}</p>
                    <p>📦 Archivo: {doc.Ruta}</p>
                  </div>
                  <a
                    href={`http://localhost:3000/uploads/${doc.Ruta}`}
                    className="btn-descargar"
                    download
                  >
                    ⬇️ Descargar
                  </a>
                </div>
              ))
            )}

            {mostrarModal && (
              <div className="modal-overlay">
                <div className="modal-contenido">
                  <h3>📤 Subir Documento</h3>
                  <form onSubmit={async (e) => {
                    e.preventDefault();
                    const data = new FormData();
                    data.append('archivo', form.archivo);
                    data.append('nombre', form.nombre);
                    data.append('dimension', form.dimension);
                    data.append('materia', form.materia);
                    data.append('eventoId', form.eventoId);

                    await axios.post('http://localhost:3000/api/subirDocumento', data);
                    setMostrarModal(false);
                    buscarDocumentos(); // refresca la lista
                  }}>
                    <input type="text" placeholder="Nombre del archivo" onChange={(e) => setForm({ ...form, nombre: e.target.value })} required />
                    <select onChange={(e) => setForm({ ...form, dimension: e.target.value })} required>
                      <option value="">Dimensión</option>
                      <option value="Tecnico-Administrativa">Técnico-Administrativa</option>
                      <option value="Pedadogica-Didactica">Pedagógica-Didáctica</option>
                      <option value="Socio-Comunitaria">Socio-Comunitaria</option>
                    </select>
                    <select onChange={(e) => setForm({ ...form, materia: e.target.value })} required>
                      <option value="">Materia</option>
                      <option value="Matematicas">Matemáticas</option>
                      <option value="Practicas del Lenguaje">Lengua</option>
                      <option value="Educacion Fisica">Educación Física</option>
                    </select>
                    <input type="number" placeholder="ID del evento" onChange={(e) => setForm({ ...form, eventoId: e.target.value })} required />
                    <input type="file" onChange={(e) => setForm({ ...form, archivo: e.target.files[0] })} required />
                    <button type="submit">Subir</button>
                    <button type="button" onClick={() => setMostrarModal(false)}>Cancelar</button>
                  </form>
                </div>
              </div>
            )}

          </div>
        </section>
      </main>
    </div>

  );
}

export default Repositorio;
