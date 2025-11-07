const multer = require('multer');
const path = require('path');
const db = require('../DataBase/DB');

const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (_, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

const SubirDocumento = upload.single('archivo');

const GuardarDocumento = (req, res) => {
  const { nombre, dimension, materia, eventoId } = req.body;
  const ruta = req.file.filename;
  const fecha = new Date().toISOString().slice(0, 10);

  const sql = `INSERT INTO Documentos (Nombre, Ruta, Dimension, Materia, EventoId, FechaSubida) VALUES (?, ?, ?, ?, ?, ?)`;
  db.run(sql, [nombre, ruta, dimension, materia, eventoId, fecha], function (err) {
    if (err) return res.status(500).json({ Error: "Error al guardar documento" });
    res.status(201).json({ Mensaje: "Documento guardado", Id: this.lastID });
  });
};

const ListarDocumentos = (req, res) => {
  const { texto, dimension, materia } = req.query;
  let condiciones = [];
  let valores = [];

  if (texto) {
    condiciones.push("Nombre LIKE ?");
    valores.push(`%${texto}%`);
  }
  if (dimension) {
    condiciones.push("Dimension = ?");
    valores.push(dimension);
  }
  if (materia) {
    condiciones.push("Materia = ?");
    valores.push(materia);
  }

  const where = condiciones.length ? `WHERE ${condiciones.join(" AND ")}` : "";
  db.all(`SELECT * FROM Documentos ${where}`, valores, (err, filas) => {
    if (err) return res.status(500).json({ Error: "Error al listar documentos" });
    res.status(200).json(filas);
  });
};

module.exports = { SubirDocumento, GuardarDocumento, ListarDocumentos };
