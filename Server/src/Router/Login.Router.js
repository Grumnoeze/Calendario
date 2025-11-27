
const Express = require('express');

const Rutas = Express.Router();

const {RegistrarUsuario, IniciarSesion, ListarUsuarios,EliminarUsuario, aceptarUsuario, rechazarUsuario} = require('../Controller/Login.Controller');


Rutas.post('/registrarUsuario', RegistrarUsuario);
Rutas.post('/iniciarSesion', IniciarSesion);
Rutas.get('/listarUsuarios', ListarUsuarios);
Rutas.delete('/eliminarUsuario/:mail', EliminarUsuario);
Rutas.put('/aceptarUsuario/:mail', aceptarUsuario);
Rutas.put('/rechazarUsuario/:mail', rechazarUsuario);


module.exports = Rutas;
