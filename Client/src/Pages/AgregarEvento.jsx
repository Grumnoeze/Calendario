import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AgregarEvento.css';

function AgregarEvento() {
    const navigate = useNavigate();

    const usuarioLocal = JSON.parse(localStorage.getItem("usuario"));
    const UsuarioId = usuarioLocal?.Id;

    const formInicial = {
        Titulo: '', Fecha: '', FechaFin: '',
        HoraInicio: '', HoraFin: '',
        Ubicacion: '', UbicacionOtro: '',
        Dimension: '', AsignarA: '',
        Descripcion: '', Materia: '',
        Recordatorio: true
    };

    const [form, setForm] = useState(formInicial);
    const [usuarios, setUsuarios] = useState([]);
    const [mensaje, setMensaje] = useState('');

    useEffect(() => {
        const token = localStorage.getItem("token");
        axios.get("http://localhost:3000/api/usuarios", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(res => setUsuarios(res.data || []))
            .catch(err => console.error("Error cargando usuarios", err));
    }, []);

    const handleChange = ({ target }) => {
        const { name, value, type, checked } = target;

        if (name === "Dimension") {
            return setForm(f => ({
                ...f,
                Dimension: value,
                PermisoVisualizacion: value,
                PermisoEdicion: value
            }));
        }

        setForm(f => ({
            ...f,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validación de fechas
        if (form.FechaFin && form.FechaFin < form.Fecha) {
            setMensaje("❌ La fecha fin no puede ser anterior a la fecha inicio");
            setTimeout(() => setMensaje(""), 4000);
            return;
        }

        // Validación de horas (solo si están en la misma fecha)
        if (form.Fecha === form.FechaFin || !form.FechaFin) {
            if (form.HoraFin <= form.HoraInicio) {
                setMensaje("❌ La hora fin debe ser mayor que la hora inicio");
                setTimeout(() => setMensaje(""), 4000);
                return;
            }
        }

        try {
            const formData = new FormData();
            formData.append("Titulo", form.Titulo);
            formData.append("FechaInicio", form.Fecha);
            formData.append("FechaFin", form.FechaFin || form.Fecha);
            formData.append("HoraInicio", form.HoraInicio);
            formData.append("HoraFin", form.HoraFin);
            formData.append("Ubicacion", form.Ubicacion === "Otro" ? form.UbicacionOtro : form.Ubicacion);
            formData.append("Dimension", form.Dimension);
            formData.append("AsignarA", form.AsignarA);
            formData.append("Descripcion", form.Descripcion);
            formData.append("Materia", form.Materia);
            formData.append("PermisoVisualizacion", form.PermisoVisualizacion);
            formData.append("PermisoEdicion", form.PermisoEdicion);
            formData.append("Recordatorio", form.Recordatorio);
            formData.append("Tipo", form.Dimension || "evento");
            formData.append("UsuarioId", UsuarioId);

            // Archivo adjunto (solo si existe)
            if (form.Adjunto) {
                formData.append("Adjunto", form.Adjunto);
            }

            const res = await axios.post("http://localhost:3000/api/eventos", formData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    "Content-Type": "multipart/form-data"
                }
            });

            setMensaje(res.data?.Mensaje || "Evento creado correctamente");
            setForm(formInicial);
            setTimeout(() => setMensaje(""), 3000);

        } catch (err) {
            setMensaje(err.response?.data?.Error || "Error desconocido");
            setTimeout(() => setMensaje(""), 4000);
        }
    };




    return (
        <form onSubmit={handleSubmit} className="formulario-evento">

            {/* Título */}
            <div className="grupo-form">
                <label>Título del evento *</label>
                <input name="Titulo" required placeholder="Ej: Reunión de padres"
                    value={form.Titulo} onChange={handleChange} />
            </div>

            {/* Fechas */}
            <div className="grupo-form-row">
                <div className="grupo-form">
                    <label>Fecha inicio *</label>
                    <input type="date" name="Fecha" required
                        value={form.Fecha} onChange={handleChange} />
                </div>

                <div className="grupo-form">
                    <label>Fecha fin</label>
                    <input type="date" name="FechaFin"
                        value={form.FechaFin} onChange={handleChange} />
                </div>
            </div>

            {/* Horarios */}
            <div className="grupo-form-row">
                {[
                    { label: "Hora de inicio *", name: "HoraInicio" },
                    { label: "Hora de fin *", name: "HoraFin" }
                ].map(campo => (
                    <div className="grupo-form" key={campo.name}>
                        <label>{campo.label}</label>
                        <input type="time" required name={campo.name}
                            value={form[campo.name]} onChange={handleChange} />
                    </div>
                ))}
            </div>

            {/* Ubicación */}
            <div className="grupo-form">
                <label>Ubicación</label>
                <select name="Ubicacion" value={form.Ubicacion} onChange={handleChange}>
                    <option value="">Seleccione...</option>
                    <option value="SUM">SUM</option>
                    <option value="Campo Deportes">Campo Deportes</option>
                    <option value="Aula 1">Aula 1</option>
                    <option value="Aula 2">Aula 2</option>
                    <option value="Biblioteca">Biblioteca</option>
                    <option value="Otro">Otro</option>
                </select>
            </div>

            {form.Ubicacion === "Otro" && (
                <div className="grupo-form">
                    <label>Especificar ubicación</label>
                    <input name="UbicacionOtro" required placeholder="Ingrese la ubicación"
                        value={form.UbicacionOtro} onChange={handleChange} />
                </div>
            )}

            {/* Dimensión */}
            <div className="grupo-form">
                <label>Dimensión *</label>
                <select name="Dimension" required value={form.Dimension} onChange={handleChange}>
                    <option value="">Seleccione...</option>
                    <option value="Tecnico-Administrativa">Técnico-Administrativa</option>
                    <option value="Socio-Comunitaria">Socio-Comunitaria</option>
                    <option value="Pedadogica-Didactica">Pedagógica-Didáctica</option>
                </select>
            </div>

            {/* Archivo adjunto */}
            <div className="grupo-form">
                <label>Archivo adjunto</label>
                <input
                    type="file"
                    name="Adjunto"
                    onChange={(e) => setForm(f => ({ ...f, Adjunto: e.target.files[0] }))}
                />
            </div>


            {/* Asignar a */}
            <div className="grupo-form">
                <label>Asignar a</label>
                <select name="AsignarA" required value={form.AsignarA} onChange={handleChange}>
                    <option value="">Seleccione...</option>
                    {usuarios.length
                        ? usuarios
                            .filter(u => u.Rol?.toLowerCase() === "docente")
                            .map(u => (
                                <option key={u.Mail} value={u.Mail}>
                                    {u.Name} ({u.Rol})
                                </option>
                            ))
                        : <option disabled>Cargando...</option>
                    }
                </select>

            </div>

            {/* Descripción */}
            <div className="grupo-form">
                <label>Descripción</label>
                <textarea name="Descripcion" rows="4"
                    value={form.Descripcion} onChange={handleChange}
                    placeholder="Descripción detallada" />
            </div>

            {/* Materia */}
            <div className="grupo-form">
                <label>Materia</label>
                <select name="Materia" value={form.Materia} onChange={handleChange}>
                    <option value="">Sin materia</option>
                    {["Matematicas", "Educacion Fisica", "Practicas del Lenguaje",
                        "Musica", "Ciencias Sociales", "Ciencias Naturales", "Ingles"
                    ].map(m => <option key={m}>{m}</option>)}
                </select>
            </div>

            {/* Botones */}
            <div className="grupo-botones">
                <button className="btn-submit">Crear evento</button>
                <button type="button" className="btn-cancelar"
                    onClick={() => navigate("/calendario")}>Cancelar</button>
            </div>

            <div className="info-recordatorio">
                <p>ℹ️ Se enviará un recordatorio 2 días antes del evento</p>
            </div>

            {mensaje && <p className="mensaje">{mensaje}</p>}
        </form>
    );
}

export default AgregarEvento;
