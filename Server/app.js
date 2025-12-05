const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const usuarioRouter = require('./src/Router/Usuario.Router');
const eventoRouter = require('./src/Router/Evento.Router');
const documentoRouter = require('./src/Router/Documento.Router');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Carpeta pública para descargas
app.use('/uploads', express.static(path.join(__dirname, 'src/uploads')));

// Rutas
app.use('/api/usuarios', usuarioRouter);
app.use('/api/eventos', eventoRouter);
app.use('/api/documentos', documentoRouter);

app.use("/uploads/eventos", express.static(path.join(__dirname, "uploads/eventos")));

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
