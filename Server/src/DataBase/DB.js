const SQLite3 = require('sqlite3');
const Ruta = require('path');

const SQLite3_Ubicacion = Ruta.resolve(__dirname, './DataBase.db');

const db_crear = new SQLite3.Database(SQLite3_Ubicacion, (error) => {
  if (error) {
    console.error("❌ Error al abrir la base de datos:", error.message);
    return;
  }

  console.log("Se ha abierto la base de datos 🛠️");

  // 🗑️ Eliminar tabla Usuarios si existe
  db_crear.run(`DROP TABLE IF EXISTS Usuarios`, (error) => {
    if (error) {
      console.error("❌ Error al eliminar la tabla Usuarios:", error.message);
    } else {
      console.log("🗑️ Tabla Usuarios eliminada");

      // ✅ Crear tabla Usuarios con columna Mail
      db_crear.run(
        `
        CREATE TABLE IF NOT EXISTS Usuarios(
          Mail TEXT PRIMARY KEY,
          Password TEXT,
          Name TEXT,
          Rol TEXT,
          PermisoVisualizacion TEXT,
          PermisoEdicion TEXT,
          Estado TEXT DEFAULT 'pendiente'
        );

        `,
        (error) => {
          if (error) {
            console.error("❌ Error al crear la tabla Usuarios:", error.message);
          } else {
            console.log("Tabla Usuarios creada correctamente ✅");
          }
        }
      );
    }
  });

  // ✅ Crear tabla Eventos (no se elimina)
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
});

module.exports = db_crear;
