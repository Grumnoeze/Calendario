
const Express = require('express');

const Rutas = Express.Router();

const {RegistrarUsuario, IniciarSesion, ListarUsuarios,EliminarUsuario} = require('../Controller/Login.Controller');


Rutas.post('/registrarUsuario', RegistrarUsuario);
Rutas.post('/iniciarSesion', IniciarSesion);
Rutas.get('/listarUsuarios', ListarUsuarios);
Rutas.delete('/eliminarUsuario/:id', EliminarUsuario);

module.exports = Rutas;
