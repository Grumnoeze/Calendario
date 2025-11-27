
const db = require('../DataBase/DB');

const { EncriptarPassword } = require('../Utils/PasswordHash');

const RegistrarUsuario = (req, res) => {
    const { Mail, Name, Rol, PermisoVisualizacion, PermisoEdicion } = req.body;

    if (!Mail || !Name || !Rol) {
        return res.status(400).json({ Error: "Faltan datos obligatorios" });
    }

    const Verificar = `SELECT * FROM Usuarios WHERE Mail = ?`;
    db.get(Verificar, [Mail], (error, usuarioExistente) => {
        if (error) return res.status(500).json({ Error: "Error al verificar usuario" });
        if (usuarioExistente) return res.status(409).json({ Error: "El usuario ya existe" });

        const Insertar = `
      INSERT INTO Usuarios (Mail, Password, Name, Rol, PermisoVisualizacion, PermisoEdicion)
      VALUES (?, NULL, ?, ?, ?, ?)
    `;
        db.run(Insertar, [Mail, Name, Rol, PermisoVisualizacion, PermisoEdicion], function (error) {
            if (error) {
                console.error("❌ Error al registrar usuario:", error.message);
                return res.status(500).json({ Error: "Error al registrar usuario" });
            }
            return res.status(201).json({ Mensaje: "Usuario creado correctamente" });
        });
    });
};



const Bcrypt = require('bcrypt');

const IniciarSesion = (req, res) => {
    const { Mail, Password } = req.body;

    if (!Mail || !Password) {
        return res.status(400).json({ Error: "Faltan datos obligatorios" });
    }

    const Consulta = `SELECT * FROM Usuarios WHERE Mail = ?`;
    db.get(Consulta, [Mail], async (error, usuario) => {
        if (error) return res.status(500).json({ Error: "Error en la base de datos" });
        if (!usuario) return res.status(404).json({ Error: "Usuario no encontrado" });

        // Primera vez: no tiene contraseña
        if (!usuario.Password) {
            const Hash = await Bcrypt.hash(Password, 10);
            const Update = `UPDATE Usuarios SET Password = ? WHERE Mail = ?`;
            db.run(Update, [Hash, Mail], function (err) {
                if (err) return res.status(500).json({ Error: "Error al guardar contraseña" });
                return res.status(200).json({
                    Mensaje: "Contraseña establecida. Inicio de sesión exitoso",
                    Mail: usuario.Mail,
                    Name: usuario.Name,
                    Rol: usuario.Rol
                });
            });
            return;
        }

        // Login normal
        const valido = await Bcrypt.compare(Password, usuario.Password);
        if (!valido) return res.status(401).json({ Error: "Contraseña incorrecta" });

        return res.status(200).json({
            Mensaje: "Inicio de sesión exitoso",
            Mail: usuario.Mail,
            Name: usuario.Name,
            Rol: usuario.Rol
        });
    });
};


const ListarUsuarios = (req, res) => {
  const sql = `SELECT Mail, Name, Rol, PermisoVisualizacion, PermisoEdicion, Estado FROM Usuarios`;
  db.all(sql, [], (err, filas) => {
    if (err) return res.status(500).json({ Error: "Error al listar usuarios" });
    res.status(200).json(filas);
  });
};



const EliminarUsuario = (req, res) => {
  const { mail } = req.params;
  db.run(`DELETE FROM Usuarios WHERE Mail = ?`, [mail], function (err) {
    if (err) return res.status(500).json({ Error: "Error al eliminar usuario" });
    res.status(200).json({ Mensaje: "Usuario eliminado" });
  });
};

const aceptarUsuario = (req, res) => {
  const { mail } = req.params;
  const sql = `UPDATE Usuarios SET Estado = 'aceptado' WHERE Mail = ?`;
  db.run(sql, [mail], function (err) {
    if (err) return res.status(500).json({ Error: "Error al aceptar usuario" });
    return res.status(200).json({ Mensaje: "Usuario aceptado" });
  });
};

const rechazarUsuario = (req, res) => {
  const { mail } = req.params;
  const sql = `UPDATE Usuarios SET Estado = 'rechazado' WHERE Mail = ?`;
  db.run(sql, [mail], function (err) {
    if (err) return res.status(500).json({ Error: "Error al rechazar usuario" });
    return res.status(200).json({ Mensaje: "Usuario rechazado" });
  });
};


module.exports = { RegistrarUsuario, IniciarSesion, ListarUsuarios, EliminarUsuario, aceptarUsuario, rechazarUsuario };