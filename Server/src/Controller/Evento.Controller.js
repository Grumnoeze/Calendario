const db = require('../DataBase/db');

// Crear evento
exports.crear = (req, res) => {
  const {
    Titulo, FechaInicio, FechaFin, HoraInicio, HoraFin,
    Ubicacion, Dimension, AsignarA, Descripcion, Materia,
    PermisoVisualizacion, PermisoEdicion, Recordatorio, Tipo
  } = req.body;

  if (!Titulo || !FechaInicio || !FechaFin || !HoraInicio || !HoraFin) {
    return res.status(400).json({ Error: "Faltan datos obligatorios" });
  }

  const archivoAdjunto = req.file ? req.file.filename : null;

  const sql = `INSERT INTO Eventos 
    (Titulo, FechaInicio, FechaFin, HoraInicio, HoraFin, Ubicacion, Dimension, AsignarA, 
     Descripcion, Materia, PermisoVisualizacion, PermisoEdicion, Recordatorio, Tipo, UsuarioMail, ArchivoAdjunto)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  db.run(sql, [
    Titulo, FechaInicio, FechaFin, HoraInicio, HoraFin, Ubicacion, Dimension, AsignarA,
    Descripcion, Materia, PermisoVisualizacion, PermisoEdicion,
    Recordatorio, Tipo, req.user?.Mail, archivoAdjunto
  ], function (err) {
    if (err) {
      console.error(err);
      return res.status(500).json({ Error: "Error al crear evento" });
    }
    // `this.lastID` te da el ID autogenerado del nuevo evento
    res.status(201).json({ Mensaje: "Evento creado correctamente", Id: this.lastID });
  });
};



// Listar eventos
exports.listar = (req, res) => {
    db.all(`SELECT * FROM Eventos`, [], (err, rows) => {
        if (err) return res.status(500).json({ Error: "Error al listar eventos" });
        res.status(200).json(rows);
    });
};

// Obtener evento por ID
exports.obtener = (req, res) => {
    const { id } = req.params;
    db.get(`SELECT * FROM Eventos WHERE Id = ?`, [id], (err, evento) => {
        if (err) return res.status(500).json({ Error: "Error al obtener evento" });
        if (!evento) return res.status(404).json({ Error: "Evento no encontrado" });
        res.status(200).json(evento);
    });
};

// Actualizar evento
exports.actualizar = (req, res) => {
  const { id } = req.params;
  const {
    Titulo, FechaInicio, FechaFin, HoraInicio, HoraFin,
    Ubicacion, Dimension, AsignarA,
    Descripcion, Materia, PermisoVisualizacion, PermisoEdicion,
    Recordatorio, Tipo
  } = req.body;

  const archivoAdjunto = req.file ? req.file.filename : null;

  const sql = `UPDATE Eventos SET 
    Titulo = ?, FechaInicio = ?, FechaFin = ?, HoraInicio = ?, HoraFin = ?, 
    Ubicacion = ?, Dimension = ?, AsignarA = ?, Descripcion = ?, Materia = ?, 
    PermisoVisualizacion = ?, PermisoEdicion = ?, Recordatorio = ?, Tipo = ?, ArchivoAdjunto = ?
    WHERE Id = ?`;

  db.run(sql, [
    Titulo, FechaInicio, FechaFin, HoraInicio, HoraFin,
    Ubicacion, Dimension, AsignarA, Descripcion, Materia,
    PermisoVisualizacion, PermisoEdicion, Recordatorio, Tipo,
    archivoAdjunto, id
  ], (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ Error: "Error al actualizar evento" });
    }
    res.status(200).json({ Mensaje: "Evento actualizado correctamente" });
  });
};


// Eliminar evento
exports.eliminar = (req, res) => {
    const { id } = req.params;

    // Primero eliminamos los documentos asociados
    documentoController.eliminarPorEventoInterno(id, (errDocs) => {
        if (errDocs) {
            console.error("⚠️ Error al eliminar documentos del evento:", errDocs.message);
            // seguimos con la eliminación del evento aunque falle la limpieza de documentos
        }

        // Ahora eliminamos el evento
        db.run(`DELETE FROM Eventos WHERE Id = ?`, [id], (err) => {
            if (err) return res.status(500).json({ Error: "Error al eliminar evento" });
            res.status(200).json({ Mensaje: "Evento y documentos asociados eliminados correctamente" });
        });
    });
};