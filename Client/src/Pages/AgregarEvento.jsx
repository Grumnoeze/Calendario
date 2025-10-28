import { useState } from 'react';
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
    const [mensaje, setMensaje] = useState('');

    const usuario = JSON.parse(localStorage.getItem("usuario"));
    const UsuarioId = usuario?.Id;

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
                }}>
                    
                </div>
                <h2 style={{ margin: 0 }}>📝 Crear nuevo evento</h2>
            </div>


            <>
                <input name="Titulo" placeholder="Título del evento" onChange={handleChange} required />
                <input name="Fecha" type="date" onChange={handleChange} required />
                <input name="HoraInicio" type="time" onChange={handleChange} required />
                <input name="HoraFin" type="time" onChange={handleChange} required />
                <input name="Ubicacion" placeholder="Aula, sala, patio, etc." onChange={handleChange} />

                <select name="Dimension" onChange={handleChange}>
                    <option value="">Seleccione una dimensión</option>
                    <option value="evento">Evento</option>
                    <option value="clase">Clase</option>
                    <option value="reunion">Reunión</option>
                </select>

                <input name="AsignarA" placeholder="Asignar a..." onChange={handleChange} />
                <textarea name="Descripcion" placeholder="Descripción detallada del evento" onChange={handleChange} />

                <select name="Materia" onChange={handleChange}>
                    <option value="">Materia</option>
                    <option value="Matemática">Matemática</option>
                    <option value="Lengua">Lengua</option>
                    <option value="Ciencias">Ciencias</option>
                </select>

                <input name="PermisoVisualizacion" placeholder="Visualización (ej: administrador)" onChange={handleChange} />
                <input name="PermisoEdicion" placeholder="Permisos de edición" onChange={handleChange} />

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
                <button type="button" onClick={() => setForm({})}>Cancelar</button>
            </>

            <p>{mensaje}</p>
        </form>
    );
}

export default AgregarEvento;
