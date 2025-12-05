const express = require('express');
const router = express.Router();
const usuarioController = require('../Controller/Usuario.Controller');
const { verificarToken, soloDirector } = require('../Middleware/authMiddleware');

// Crear usuario → requiere token y rol Director
router.post('/', verificarToken, soloDirector, usuarioController.crear);

// Verificar cuenta → público
router.get('/verificar', usuarioController.verificar);

// Login → público
router.post('/login', usuarioController.login);

// Listar usuarios → requiere token (cualquier rol)
router.get('/', verificarToken, usuarioController.listar);

// Eliminar usuario → requiere token y rol Director
router.delete('/:mail', verificarToken, (req, res) => {
  const { mail } = req.params;
  const sql = `DELETE FROM Usuarios WHERE Mail = ?`;
  db.run(sql, [mail], function (err) {
    if (err) {
      console.error("❌ Error al eliminar usuario:", err);
      return res.status(500).json({ Error: "Error al eliminar usuario" });
    }
    res.status(200).json({ Mensaje: "Usuario eliminado correctamente" });
  });
});
module.exports = router;
