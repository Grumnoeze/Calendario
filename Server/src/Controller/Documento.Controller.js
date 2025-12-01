const db = require('../DataBase/db');
const path = require('path');
const fs = require('fs');

// Subir documento
exports.subir = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ Error: "No se subió ningún archivo" });
  }

  const { Nombre, Dimension, Materia, EventoId } = req.body;
  const Ruta = req.file.filename;
  const SubidoPor = req.user?.Mail;

  const sql = `INSERT INTO Documentos (Nombre, Dimension, Materia, EventoId, Ruta, SubidoPor)
               VALUES (?, ?, ?, ?, ?, ?)`;

  db.run(sql, [Nombre, Dimension, Materia, EventoId, Ruta, SubidoPor], (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ Error: "Error al guardar documento" });
    }
    res.status(201).json({ Mensaje: "Documento subido correctamente" });
  });
};

// Listar documentos
exports.listar = (req, res) => {
  db.all(`SELECT * FROM Documentos`, [], (err, rows) => {
    if (err) return res.status(500).json({ Error: "Error al listar documentos" });
    res.status(200).json(rows);
  });
};

// Descargar documento
exports.descargar = (req, res) => {
  const { nombre } = req.params;
  const filePath = path.join(__dirname, '../uploads', nombre);
  res.download(filePath, nombre, (err) => {
    if (err) {
      console.error(err);
      res.status(404).json({ Error: "Archivo no encontrado" });
    }
  });
};

// Eliminar documento (registro + archivo físico)
exports.eliminar = (req, res) => {
  const { id } = req.params;

  // Primero buscamos el documento en la base
  db.get(`SELECT Ruta FROM Documentos WHERE Id = ?`, [id], (err, doc) => {
    if (err) return res.status(500).json({ Error: "Error al buscar documento" });
    if (!doc) return res.status(404).json({ Error: "Documento no encontrado" });

    const filePath = path.join(__dirname, '../uploads', doc.Ruta);

    // Eliminamos el archivo físico
    fs.unlink(filePath, (errUnlink) => {
      if (errUnlink) {
        console.error("⚠️ Error al borrar archivo físico:", errUnlink.message);
        // seguimos con la eliminación en la base aunque falle el archivo
      }

      // Eliminamos el registro en la base
      db.run(`DELETE FROM Documentos WHERE Id = ?`, [id], (errDelete) => {
        if (errDelete) return res.status(500).json({ Error: "Error al eliminar documento de la base" });
        res.status(200).json({ Mensaje: "Documento eliminado correctamente" });
      });
    });
  });
};

exports.eliminarPorNombre = (req, res) => {
  const { nombre } = req.params;

  // Buscar documento en la base por Ruta
  db.get(`SELECT Id, Ruta FROM Documentos WHERE Ruta = ?`, [nombre], (err, doc) => {
    if (err) return res.status(500).json({ Error: "Error al buscar documento" });
    if (!doc) return res.status(404).json({ Error: "Documento no encontrado" });

    const filePath = path.join(__dirname, '../uploads', doc.Ruta);

    // Eliminar archivo físico
    fs.unlink(filePath, (errUnlink) => {
      if (errUnlink) {
        console.error("⚠️ Error al borrar archivo físico:", errUnlink.message);
        // seguimos con la eliminación en la base aunque falle el archivo
      }

      // Eliminar registro en la base
      db.run(`DELETE FROM Documentos WHERE Id = ?`, [doc.Id], (errDelete) => {
        if (errDelete) return res.status(500).json({ Error: "Error al eliminar documento de la base" });
        res.status(200).json({ Mensaje: "Documento eliminado correctamente" });
      });
    });
  });
};

exports.eliminarPorEventoInterno = (eventoId, callback) => {
  db.all(`SELECT Id, Ruta FROM Documentos WHERE EventoId = ?`, [eventoId], (err, docs) => {
    if (err) return callback(err);
    if (!docs || docs.length === 0) return callback(null); // no hay documentos

    docs.forEach(doc => {
      const filePath = path.join(__dirname, '../uploads', doc.Ruta);

      // Borrar archivo físico
      fs.unlink(filePath, (errUnlink) => {
        if (errUnlink) {
          console.error(`⚠️ Error al borrar archivo ${doc.Ruta}:`, errUnlink.message);
        }
      });

      // Borrar registro en la base
      db.run(`DELETE FROM Documentos WHERE Id = ?`, [doc.Id], (errDelete) => {
        if (errDelete) {
          console.error(`⚠️ Error al eliminar documento ${doc.Id} de la base:`, errDelete.message);
        }
      });
    });

    callback(null); // terminamos sin error crítico
  });
};

// Endpoint público para eliminar documentos por evento
exports.eliminarPorEvento = (req, res) => {
  const { eventoId } = req.params;
  exports.eliminarPorEventoInterno(eventoId, (err) => {
    if (err) return res.status(500).json({ Error: "Error al eliminar documentos del evento" });
    res.status(200).json({ Mensaje: "Documentos del evento eliminados correctamente" });
  });
};