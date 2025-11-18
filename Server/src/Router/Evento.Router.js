const express = require('express');
const Rutas = express.Router();
const { CrearEvento, ListarEventos, EliminarEvento, FiltrarEventos} = require('../Controller/Evento.Controller');
const db = require('../DataBase/DB');

Rutas.put('/actualizarEstado/:id', async (req, res) => {
    const { id } = req.params;
    const { estado } = req.body;

    try {
        db.run('UPDATE Eventos SET Estado = ? WHERE Id = ?', [estado, id], function (error) {
            if (error) {
                console.error(error);
                return res.status(500).json({ Error: 'Error al actualizar el estado' });
            }
            res.json({ Mensaje: 'Estado actualizado correctamente' });
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ Error: 'Error al actualizar el estado' });
    }
});
Rutas.put('/actualizarEvento/:id', (req, res) => {
  const { id } = req.params;
  const {
    Titulo, FechaInicio, FechaFin, HoraInicio, HoraFin,
    Ubicacion, Dimension, AsignarA, Descripcion, Materia,
    PermisoVisualizacion, PermisoEdicion, Recordatorio, Tipo, Estado
  } = req.body;

  const query = `
    UPDATE Eventos SET
      Titulo = ?, FechaInicio = ?, FechaFin = ?, HoraInicio = ?, HoraFin = ?,
      Ubicacion = ?, Dimension = ?, AsignarA = ?, Descripcion = ?, Materia = ?,
      PermisoVisualizacion = ?, PermisoEdicion = ?, Recordatorio = ?, Tipo = ?, Estado = ?
    WHERE Id = ?
  `;

  const valores = [
    Titulo, FechaInicio, FechaFin, HoraInicio, HoraFin,
    Ubicacion, Dimension, AsignarA, Descripcion, Materia,
    PermisoVisualizacion, PermisoEdicion, Recordatorio ? 1 : 0, Tipo, Estado, id
  ];

  db.run(query, valores, function (error) {
    if (error) {
      console.error("❌ Error al actualizar evento:", error.message);
      return res.status(500).json({ Error: "Error al actualizar evento" });
    }
    res.status(200).json({ Mensaje: "Evento actualizado correctamente" });
  });
});



Rutas.post('/crearEvento', CrearEvento);
Rutas.get('/listarEventos', ListarEventos);
Rutas.get('/filtrarEventos', FiltrarEventos);
Rutas.delete('/eliminarEvento/:id', EliminarEvento);


module.exports = Rutas;
