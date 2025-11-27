
const Express = require('express');

const Cors = require('cors');

const App = Express();

App.use(Cors());

require("dotenv").config();

const PORT = process.env.PORT || 5000; 

App.use(Express.json());

const EventoRouter = require('./src/Router/Evento.Router');
const Router = require('./src/Router/Login.Router');
const RepositorioRouter = require('./src/Router/Repositorio.Router');
const path = require('path');

App.use('/uploads', Express.static(path.join(__dirname, 'src/uploads')));

App.use('/api', RepositorioRouter);
App.use('/api', EventoRouter);
App.use('/api', Router);


App.listen(PORT, () => {
    console.log(`🚀 http://localhost:${PORT}`);
})
