const express = require('express');
const Rutas = express.Router();
const { CrearEvento, ListarEventos, EliminarEvento} = require('../Controller/Evento.Controller');

Rutas.post('/crearEvento', CrearEvento);
Rutas.get('/listarEventos', ListarEventos);
Rutas.delete('/eliminarEvento/:id', EliminarEvento);


module.exports = Rutas;
