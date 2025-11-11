const express = require('express');
const Rutas = express.Router();
const { SubirDocumento, GuardarDocumento, ListarDocumentos } = require('../Controller/Repositorio.Controller');

Rutas.post('/subirDocumento', SubirDocumento, GuardarDocumento);
Rutas.get('/documentos', ListarDocumentos);

module.exports = Rutas;
