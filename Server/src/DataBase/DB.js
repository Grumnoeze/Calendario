const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'DataBase.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error("❌ Error al abrir la base:", err.message);
    } else {
        console.log("✅ Base de datos abierta correctamente");
    }
});

// Crear tablas
db.serialize(() => {
    db.run(`
    CREATE TABLE IF NOT EXISTS Usuarios (
        Mail TEXT PRIMARY KEY,
        Password TEXT,
        Name TEXT NOT NULL,
        Rol TEXT NOT NULL,
        PermisoVisualizacion TEXT,
        PermisoEdicion TEXT,
        Estado TEXT DEFAULT 'pendiente',
        Verificado INTEGER DEFAULT 0,
        TokenVerificacion TEXT,
        FechaVerificacion TEXT
    );  

  `);

    db.run(`
    CREATE TABLE IF NOT EXISTS Eventos (
        Id INTEGER PRIMARY KEY AUTOINCREMENT,
        Titulo TEXT NOT NULL,
        FechaInicio TEXT NOT NULL,
        FechaFin TEXT NOT NULL,
        HoraInicio TEXT NOT NULL,
        HoraFin TEXT NOT NULL,
        Ubicacion TEXT,
        Dimension TEXT,
        AsignarA TEXT,
        Descripcion TEXT,
        Materia TEXT,
        PermisoVisualizacion TEXT,
        PermisoEdicion TEXT,
        Recordatorio INTEGER,
        Tipo TEXT,
        UsuarioMail TEXT
        )
  `);

    db.run(`
    CREATE TABLE IF NOT EXISTS Documentos (
      Id INTEGER PRIMARY KEY AUTOINCREMENT,
      Nombre TEXT NOT NULL,
      Dimension TEXT,
      Materia TEXT,
      EventoId INTEGER,
      Ruta TEXT,
      SubidoPor TEXT,
      FOREIGN KEY (EventoId) REFERENCES Eventos(Id),
      FOREIGN KEY (SubidoPor) REFERENCES Usuarios(Mail)
    )
  `);
});

module.exports = db;
