
const db = require('../DataBase/DB');

const CrearEvento = (req, res) => {
  const {
    Titulo,
    FechaInicio,
    FechaFin,
    Ubicacion,
    Dimension,
    AsignarA,
    Descripcion,
    Materia,
    PermisoVisualizacion,
    PermisoEdicion,
    Recordatorio,
    Tipo,
    UsuarioId
  } = req.body;

  if (!Titulo || !FechaInicio || !FechaFin || !UsuarioId) {
    return res.status(400).json({ Error: "Faltan datos obligatorios" });
  }

  const Insertar = `
    INSERT INTO Eventos (
      Titulo, FechaInicio, FechaFin, Ubicacion, Dimension, AsignarA,
      Descripcion, Materia, PermisoVisualizacion, PermisoEdicion,
      Recordatorio, Tipo, UsuarioId
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const valores = [
    Titulo, FechaInicio, FechaFin, Ubicacion, Dimension, AsignarA,
    Descripcion, Materia, PermisoVisualizacion, PermisoEdicion,
    Recordatorio ? 1 : 0, Tipo, UsuarioId
  ];

  db.run(Insertar, valores, function (error) {
    if (error) {
      console.error("❌ Error al crear evento:", error.message);
      return res.status(500).json({ Error: "Error al crear evento" });
    }
    return res.status(201).json({
      Mensaje: "Evento creado correctamente",
      Id: this.lastID
    });
  });
};

const ListarEventos = (req, res) => {
  const sql = `SELECT * FROM Eventos`;

  db.all(sql, [], (error, filas) => {
    if (error) {
      console.error("❌ Error al listar eventos:", error.message);
      return res.status(500).json({ Error: "Error al obtener eventos" });
    }
    return res.status(200).json(filas);
  });
};

const EliminarEvento = (req, res) => {
  const { id } = req.params;
  db.run(`DELETE FROM Eventos WHERE Id = ?`, [id], function (err) {
    if (err) return res.status(500).json({ Error: "Error al eliminar evento" });
    res.status(200).json({ Mensaje: "Evento eliminado" });
  });
};

module.exports = { CrearEvento, ListarEventos, EliminarEvento };
