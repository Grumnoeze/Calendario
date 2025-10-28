import { useEffect, useState } from 'react';
import axios from 'axios';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';

function Calendario() {
  const [eventos, setEventos] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3000/api/listarEventos')
      .then(res => {
        const eventosFormateados = res.data.map(ev => ({
          title: ev.Titulo,
          start: ev.FechaInicio,
          end: ev.FechaFin,
          backgroundColor: ev.Tipo === 'clase' ? '#4caf50' :
                          ev.Tipo === 'reunion' ? '#2196f3' : '#f44336'
        }));
        setEventos(eventosFormateados);
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h2>📅 Calendario Institucional</h2>
      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        events={eventos}
        height="auto"
      />
    </div>
  );
}

export default Calendario;
