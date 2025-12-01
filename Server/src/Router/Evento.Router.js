const express = require('express');
const router = express.Router();
const eventoController = require('../Controller/Evento.Controller');
const { verificarToken } = require('../Middleware/authMiddleware');
const multer = require("multer");
const path = require("path");
const db = require('../DataBase/db');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads/eventos"));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });


// Crear evento
router.post("/", verificarToken, upload.single("Adjunto"), eventoController.crear);

// Listar todos los eventos
router.get('/', verificarToken, eventoController.listar);

// Obtener evento por ID
router.get('/:id', verificarToken, eventoController.obtener);

// Actualizar solo el estado de un evento (debe ir antes que la genérica)
// Actualizar solo el estado de un evento
router.put("/actualizarEstado/:id", verificarToken, (req, res) => {
  const { id } = req.params;
  const { estado } = req.body;

  const sql = "UPDATE Eventos SET Estado = ? WHERE Id = ?";

  db.run(sql, [estado, id], function (err) {
    if (err) {
      console.error("❌ Error al actualizar estado:", err);
      return res.status(500).json({ error: "Error al actualizar estado" });
    }

    res.status(200).json({ success: true, message: "Estado actualizado" });
  });
});


// Actualizar evento completo
router.put('/:id', verificarToken, upload.single("Adjunto"), eventoController.actualizar);

// Eliminar evento
router.delete('/:id', verificarToken, eventoController.eliminar);

module.exports = router;
