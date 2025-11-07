
const SQLite3 = require('sqlite3')

const Ruta = require('path');

const SQLite3_Ubicacion = Ruta.resolve(__dirname, './DataBase.db');

const db_crear = new SQLite3.Database(SQLite3_Ubicacion, (error) => {
    if (error) {
        console.error("❌ Error al crear la base de datos:", error.message);
    } else {
        console.log("Se ha creado la base de datos 🛠️");
        db_crear.run(
            `
            CREATE TABLE IF NOT EXISTS Usuarios(
                Id INTEGER PRIMARY KEY AUTOINCREMENT,
                Mail TEXT UNIQUE,
                Password TEXT,
                Name TEXT,
                Rol TEXT
            )`,(error) => {
                if (error) {
                    console.error("❌ Error al crear la tabla Usuarios:", error.message);
                } else {
                    console.log("Tabla Usuarios creada correctamente ✅");
                }
            }
        );
    }
})

db_crear.run(
  `
  CREATE TABLE IF NOT EXISTS Eventos(
    Id INTEGER PRIMARY KEY AUTOINCREMENT,
    Titulo TEXT NOT NULL,
    FechaInicio TEXT NOT NULL,
    FechaFin TEXT NOT NULL,
    Ubicacion TEXT,
    Dimension TEXT,
    AsignarA TEXT,
    Descripcion TEXT,
    Materia TEXT,
    PermisoVisualizacion TEXT,
    PermisoEdicion TEXT,
    Recordatorio INTEGER,
    Tipo TEXT,
    UsuarioId INTEGER
  )
  `,
  (error) => {
    if (error) {
      console.error("❌ Error al crear la tabla Eventos:", error.message);
    } else {
      console.log("Tabla Eventos creada correctamente ✅");
    }
  }
);


module.exports = db_crear;
