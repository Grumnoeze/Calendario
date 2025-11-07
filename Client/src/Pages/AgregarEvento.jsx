import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function AgregarEvento() {

    const [form, setForm] = useState({
        Titulo: '',
        Fecha: '',
        HoraInicio: '',
        HoraFin: '',
        Ubicacion: '',
        Dimension: '',
        AsignarA: '',
        Descripcion: '',
        Materia: '',
        PermisoVisualizacion: '',
        PermisoEdicion: '',
        Recordatorio: false
    });
    const [crearActivo, setCrearActivo] = useState(true);
    const [usuarios, setUsuarios] = useState([]);
    const navigate = useNavigate();

    const [mensaje, setMensaje] = useState('');

    const usuario = JSON.parse(localStorage.getItem("usuario"));
    const UsuarioId = usuario?.Id;

    useEffect(() => {
        axios.get('http://localhost:3000/api/listarUsuarios')
            .then(res => setUsuarios(res.data))
            .catch(err => console.error("Error al cargar usuarios:", err));
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const evento = {
                ...form,
                FechaInicio: `${form.Fecha}T${form.HoraInicio}`,
                FechaFin: `${form.Fecha}T${form.HoraFin}`,
                Tipo: form.Dimension || 'evento',
                UsuarioId
            };
            const res = await axios.post('http://localhost:3000/api/crearEvento', evento);
            setMensaje(res.data.Mensaje);
        } catch (error) {
            setMensaje(error.response?.data?.Error || 'Error desconocido');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{
                    width: '50px',
                    height: '50px',
                    backgroundColor: '#eee',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '24px',
                    color: '#999'
                }}></div>
                <h2 style={{ margin: 0 }}>📝 Crear nuevo evento</h2>
            </div>

            <label>Título del evento:</label>
            <input name="Titulo" onChange={handleChange} required />

            <label>Fecha:</label>
            <input name="Fecha" type="date" onChange={handleChange} required />

            <label>Hora de inicio:</label>
            <input name="HoraInicio" type="time" onChange={handleChange} required />

            <label>Hora de fin:</label>
            <input name="HoraFin" type="time" onChange={handleChange} required />

            <label>Ubicación:</label>
            <input name="Ubicacion" onChange={handleChange} />

            <label>Dimensión:</label>
            <select name="Dimension" onChange={handleChange} required>
                <option value="">Seleccione una dimensión</option>
                <option value="Tecnico-Administrativa">Técnico-Administrativa</option>
                <option value="Socio-Comunitaria">Socio-Comunitaria</option>
                <option value="Pedadogica-Didactica">Pedagógica-Didáctica</option>
            </select>

            <label>Asignar a:</label>
            <select name="AsignarA" onChange={handleChange} required>
                <option value="">Asignar a...</option>
                {usuarios.map(u => (
                    <option key={u.Id} value={u.Id}>
                        {u.Name} ({u.Rol})
                    </option>
                ))}
            </select>

            <label>Descripción:</label>
            <textarea name="Descripcion" onChange={handleChange} />

            <label>Materia:</label>
            <select name="Materia" onChange={handleChange}>
                <option value="">Sin materia</option>
                <option value="Matematicas">Matemáticas</option>
                <option value="Educacion Fisica">Educación Física</option>
                <option value="Practicas del Lenguaje">Prácticas del Lenguaje</option>
                <option value="Musica">Música</option>
                <option value="Ciencias Sociales">Ciencias Sociales</option>
                <option value="Ciencias Naturales">Ciencias Naturales</option>
                <option value="Ingles">Inglés</option>
            </select>

            <label>Archivos adjuntos:</label>
            <input type="file" name="Adjunto" onChange={(e) => setForm({ ...form, Adjunto: e.target.files[0] })} />

            <label>Permisos de visualización:</label>
            <input name="PermisoVisualizacion" onChange={handleChange} />

            <label>Permisos de edición:</label>
            <input name="PermisoEdicion" onChange={handleChange} />

            <label>
                <input
                    type="checkbox"
                    name="Recordatorio"
                    checked={form.Recordatorio}
                    onChange={handleChange}
                />
                Enviar recordatorio (2 días antes)
            </label>

            <button type="submit">Crear evento</button>
            <button type="button" onClick={() => navigate(-1)}>Cancelar</button>


            <p>{mensaje}</p>
        </form>

    );
}


export default AgregarEvento;
