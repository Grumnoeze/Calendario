import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Logo from './img/Logo.jpg';
import './AgregarEvento.css';

function AgregarEvento() {
    const navigate = useNavigate();
    // estados relacionados con el sidebar/desplegable eliminados porque el formulario
    // se renderiza dentro de la vista que contiene el menú lateral
    const [form, setForm] = useState({
        Titulo: '',
        Fecha: '',
        HoraInicio: '',
        HoraFin: '',
        Ubicacion: '',
        Dimension: '',
        DimensionOtro: '',
        AsignarA: '',
        Descripcion: '',
        Materia: '',
        PermisoVisualizacion: '',
        PermisoEdicion: '',
        Recordatorio: true
    });
    const [mensaje, setMensaje] = useState('');

    const usuario = JSON.parse(localStorage.getItem("usuario"));
    const UsuarioId = usuario?.Id;

    // useEffect de carga de eventos removido (ya lo hace la vista principal si es necesario)

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const evento = {
                ...form,
                FechaInicio: form.Fecha,
                FechaFin: form.Fecha,
                Tipo: form.Dimension || 'evento',
                UsuarioId
            };
            const res = await axios.post('http://localhost:3000/api/crearEvento', evento);
            setMensaje(res.data.Mensaje);
            setForm({
                Titulo: '',
                Fecha: '',
                HoraInicio: '',
                HoraFin: '',
                Ubicacion: '',
                Dimension: '',
                DimensionOtro: '',
                AsignarA: '',
                Descripcion: '',
                Materia: '',
                PermisoVisualizacion: '',
                PermisoEdicion: '',
                Recordatorio: true
            });
        } catch (error) {
            setMensaje(error.response?.data?.Error || 'Error desconocido');
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

                    <div className="grupo-form">
                        <label>Fecha *</label>
                        <input 
                            name="Fecha" 
                            type="date" 
                            onChange={handleChange}
                            value={form.Fecha}
                            required 
                        />
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
                        <input 
                            name="Ubicacion" 
                            placeholder="Aula, sala, patio, etc." 
                            onChange={handleChange}
                            value={form.Ubicacion}
                        />
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
                            <option value="Otro">Otro</option>
                        </select>
                    </div>

                    {form.Dimension === 'Otro' && (
                        <div className="grupo-form">
                            <label>Especificar dimensión *</label>
                            <input 
                                name="DimensionOtro" 
                                placeholder="Ingrese la dimensión personalizada" 
                                onChange={handleChange}
                                value={form.DimensionOtro}
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
                        >
                            <option value="">Seleccione un rol</option>
                            <option value="Docente">Docente</option>
                            <option value="Director">Director</option>
                            <option value="Familia">Familia</option>
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

                    <div className="grupo-form">
                        <label>Permisos de visualización</label>
                        <input 
                            name="PermisoVisualizacion" 
                            placeholder="Ej: administrador, docentes" 
                            onChange={handleChange}
                            value={form.PermisoVisualizacion}
                        />
                    </div>

                    <div className="grupo-form">
                        <label>Permisos de edición</label>
                        <select 
                            name="PermisoEdicion" 
                            onChange={handleChange}
                            value={form.PermisoEdicion}
                        >
                            <option value="">Seleccione un rol</option>
                            <option value="Docente">Docente</option>
                            <option value="Director">Director</option>
                            <option value="Familia">Familia</option>
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
