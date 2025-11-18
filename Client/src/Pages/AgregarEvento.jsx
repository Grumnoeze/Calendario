import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Logo from './img/Logo.jpg';
import './AgregarEvento.css';

function AgregarEvento() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        Titulo: '',
        Fecha: '',
        FechaFin: '',
        HoraInicio: '',
        HoraFin: '',
        Ubicacion: '',
        Dimension: '',
        AsignarA: '',
        Descripcion: '',
        Materia: '',
        Recordatorio: true
    });
    const [mensaje, setMensaje] = useState('');
    const [usuarios, setUsuarios] = useState([]);

    const usuarioLocal = JSON.parse(localStorage.getItem("usuario"));
    const UsuarioId = usuarioLocal?.Id;

    useEffect(() => {
        // Cargar usuarios para el select "Asignar a"
        axios.get('http://localhost:3000/api/listarUsuarios')
            .then(response => {
                // si tu API devuelve todos los usuarios, podes filtrar por estado si hace falta
                setUsuarios(response.data || []);
            })
            .catch(err => console.error('Error al cargar usuarios', err));
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (name === "Dimension") {
            setForm(prev => ({
                ...prev,
                Dimension: value,
                PermisoVisualizacion: value,
                PermisoEdicion: value
            }));
        } else {
            setForm(prev => ({
                ...prev,
                [name]: type === 'checkbox' ? checked : value
            }));
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const evento = {
                Titulo: form.Titulo,
                FechaInicio: form.Fecha,
                FechaFin: form.FechaFin || form.Fecha,
                HoraInicio: form.HoraInicio,
                HoraFin: form.HoraFin,
                Ubicacion: form.Ubicacion,
                Dimension: form.Dimension,
                AsignarA: form.AsignarA,
                Descripcion: form.Descripcion,
                Materia: form.Materia,
                PermisoVisualizacion: form.PermisoVisualizacion,
                PermisoEdicion: form.PermisoEdicion,
                Recordatorio: form.Recordatorio,
                Tipo: form.Dimension || 'evento',
                UsuarioId
            };


            const res = await axios.post('http://localhost:3000/api/crearEvento', evento);
            setMensaje(res.data?.Mensaje || 'Evento creado');

            setForm({
                Titulo: '',
                Fecha: '',
                FechaFin: '',
                HoraInicio: '',
                HoraFin: '',
                Ubicacion: '',
                Dimension: '',
                AsignarA: '',
                Descripcion: '',
                Materia: '',
                Recordatorio: true
            });
            setTimeout(() => setMensaje(''), 3000);
        } catch (error) {
            setMensaje(error.response?.data?.Error || 'Error desconocido');
            setTimeout(() => setMensaje(''), 4000);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="formulario-evento">
            <div className="grupo-form">
                <label>Título del evento *</label>
                <input
                    name="Titulo"
                    placeholder="Ej: Reunión de padres"
                    onChange={handleChange}
                    value={form.Titulo}
                    required
                />
            </div>
            <div className="grupo-form-row">
                <div className="grupo-form">
                    <label>Fecha inicio *</label>
                    <input
                        name="Fecha"
                        type="date"
                        onChange={handleChange}
                        value={form.Fecha}
                        required
                    />
                </div>
                <div className="grupo-form">
                    <label>Fecha fin</label>
                    <input
                        name="FechaFin"
                        type="date"
                        onChange={handleChange}
                        value={form.FechaFin}
                    />
                </div>
            </div>

            <div className="grupo-form-row">
                <div className="grupo-form">
                    <label>Hora de inicio *</label>
                    <input
                        name="HoraInicio"
                        type="time"
                        onChange={handleChange}
                        value={form.HoraInicio}
                        required
                    />
                </div>
                <div className="grupo-form">
                    <label>Hora de fin *</label>
                    <input
                        name="HoraFin"
                        type="time"
                        onChange={handleChange}
                        value={form.HoraFin}
                        required
                    />
                </div>
            </div>

            <div className="grupo-form">
                <label>Ubicación</label>
                <select
                    name="Ubicacion"
                    onChange={handleChange}
                    value={form.Ubicacion}
                >
                    <option value="">Seleccione una ubicación</option>
                    <option value="SUM">SUM</option>
                    <option value="Campo Deportes">Campo Deportes</option>
                    <option value="Aula 1">Aula 1</option>
                    <option value="Aula 2">Aula 2</option>
                    <option value="Biblioteca">Biblioteca</option>
                </select>
            </div>


            <div className="grupo-form">
                <label>Dimensión *</label>
                <select
                    name="Dimension"
                    onChange={handleChange}
                    value={form.Dimension}
                    required
                >
                    <option value="">Seleccione una dimensión</option>
                    <option value="Tecnico-Administrativa">Técnico-Administrativa</option>
                    <option value="Socio-Comunitaria">Socio-Comunitaria</option>
                    <option value="Pedadogica-Didactica">Pedagógica-Didáctica</option>
                    {/* <option value="Otro">Otro</option> */}
                </select>
            </div>

            {form.Dimension === 'Otro' && (
                <div className="grupo-form">
                    <label>Especificar dimensión *</label>
                    <input
                        name="DimensionOtro"
                        placeholder="Ingrese la dimensión personalizada"
                        onChange={handleChange}
                        value={form.Dimension}
                        required
                    />
                </div>
            )}
            <div className="grupo-form">
                <label>Asignar a</label>
                <select
                    name="AsignarA"
                    onChange={handleChange}
                    value={form.AsignarA}
                    required
                >
                    <option value="">Seleccione un usuario</option>
                    {usuarios.length > 0 ? (
                        usuarios.map(u => (
                            <option key={u.Id} value={u.Id}>
                                {u.Name} {u.Rol ? `(${u.Rol})` : ''}
                            </option>
                        ))
                    ) : (
                        <option disabled>Cargando usuarios...</option>
                    )}
                </select>

            </div>


            <div className="grupo-form">
                <label>Descripción</label>
                <textarea
                    name="Descripcion"
                    placeholder="Descripción detallada del evento"
                    onChange={handleChange}
                    value={form.Descripcion}
                    rows="4"
                />
            </div>

            <div className="grupo-form">
                <label>Materia</label>
                <select
                    name="Materia"
                    onChange={handleChange}
                    value={form.Materia}
                >
                    <option value="">Sin materia</option>
                    <option value="Matematicas">Matemáticas</option>
                    <option value="Educacion Fisica">Educación Física</option>
                    <option value="Practicas del Lenguaje">Prácticas del Lenguaje</option>
                    <option value="Musica">Música</option>
                    <option value="Ciencias Sociales">Ciencias Sociales</option>
                    <option value="Ciencias Naturales">Ciencias Naturales</option>
                    <option value="Ingles">Inglés</option>
                </select>
            </div>

            <div className="grupo-botones">
                <button type="submit" className="btn-submit">Crear evento</button>
                <button type="button" className="btn-cancelar" onClick={() => navigate("/calendario")}>Cancelar</button>
            </div>

            <div className="info-recordatorio">
                <p>ℹ️ Se enviará un recordatorio 2 días antes del evento</p>
            </div>

            {mensaje && <p className="mensaje">{mensaje}</p>}
        </form>
    );
}

export default AgregarEvento;
