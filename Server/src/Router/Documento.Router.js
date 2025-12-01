const express = require('express');
const router = express.Router();
const documentoController = require('../Controller/Documento.Controller');
const { verificarToken } = require('../Middleware/authMiddleware');
const multer = require('multer');
const path = require('path');

// Configuración de multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// Subir documento
router.post('/', verificarToken, upload.single('archivo'), documentoController.subir);

// Listar documentos
router.get('/', verificarToken, documentoController.listar);

// Descargar documento por nombre
router.get('/descargar/:nombre', verificarToken, documentoController.descargar);

// Eliminar documento por ID
router.delete('/:id', verificarToken, documentoController.eliminar);

// Eliminar documento por nombre de archivo (Ruta)
router.delete('/nombre/:nombre', verificarToken, documentoController.eliminarPorNombre);

module.exports = router;
