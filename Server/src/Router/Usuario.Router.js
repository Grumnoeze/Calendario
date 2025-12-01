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
router.delete('/:mail', verificarToken, soloDirector, usuarioController.eliminar);

module.exports = router;
