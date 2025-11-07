
const db = require('../DataBase/DB');

const { EncriptarPassword } = require('../Utils/PasswordHash');

const RegistrarUsuario = async (req, res) => {
    try {
        const { Mail, Password, Name, Rol } = req.body;
        if (!Mail || !Password || !Name || !Rol) {
            return res.status(404).json({ Error: "Faltan datos obligatorios" });

        }

        const Verificar_Usuario = `SELECT * FROM Usuarios WHERE Mail = ?`;

        db.get(Verificar_Usuario, [Mail], async (error, Tabla) => {
            if (error) {
                console.error("❌ Error al verificar el usuario:", error.message);
                return res.status(404).json({ Error: "Error al verificar el usuario" });
            }
            if (Tabla) {
                return res.status(409).json({ Error: "El usuario ya existe" });
            }

            const Hash = await EncriptarPassword(Password);
            const Insertar_Usuario = `INSERT INTO Usuarios (Mail, Password, Name, Rol) VALUES (?, ?, ?, ?)`;

            db.run(Insertar_Usuario, [Mail, Hash, Name, Rol], function (error) {
                if (error) {
                    console.error("❌ Error al registrar el usuario:", error.message);
                    return res.status(404).json({ Error: "Error al registrar el usuario" });
                } else {
                    return res.status(201).json({
                        Mensaje: "Usuario registrado correctamente",
                        Id: this.lastID,
                        Mail,
                        Name,
                        Rol
                    });
                }
            });
        });



        const Hash = await EncriptarPassword(Password);
        const Insertar_Usuario = `INSERT INTO Usuarios (Mail, Password, Name, Rol) VALUES (?, ?, ?, ?)`;

        db.run(Insertar_Usuario, [Mail, Hash, Name, Rol], function (error) {
            if (error) {
                console.error("❌ Error al registrar el usuario:", error.message);
                return res.status(404).json({ Error: "Error al registrar el usuario" });
            }
            else {
                return res.status(201).json({
                    Mensaje: "Usuario registrado correctamente",
                    Id: this.lastID,
                    Mail,
                    Name,
                    Rol
                });
            }
        })
    }
    catch (error) {
        return res.status(500).json({ Error: "Error del servidor" });
    }
}

const Bcrypt = require('bcrypt');

const IniciarSesion = (req, res) => {
    const { Mail, Password } = req.body;

    if (!Mail || !Password) {
        return res.status(400).json({ Error: "Faltan datos obligatorios" });
    }

    const Consulta = `SELECT * FROM Usuarios WHERE Mail = ?`;

    db.get(Consulta, [Mail], async (error, usuario) => {
        if (error) {
            console.error("❌ Error al buscar usuario:", error.message);
            return res.status(500).json({ Error: "Error en la base de datos" });
        }

        if (!usuario) {
            return res.status(404).json({ Error: "Usuario no encontrado" });
        }

        const valido = await Bcrypt.compare(Password, usuario.Password);
        if (!valido) {
            return res.status(401).json({ Error: "Contraseña incorrecta" });
        }

        return res.status(200).json({
            Mensaje: "Inicio de sesión exitoso",
            Id: usuario.Id,
            Mail: usuario.Mail,
            Name: usuario.Name,
            Rol: usuario.Rol
        });
    });
};

const ListarUsuarios = (req, res) => {
    db.all(`SELECT * FROM Usuarios`, [], (err, filas) => {
        if (err) return res.status(500).json({ Error: "Error al listar usuarios" });
        res.status(200).json(filas);
    });
};

const EliminarUsuario = (req, res) => {
    const { id } = req.params;
    db.run(`DELETE FROM Usuarios WHERE Id = ?`, [id], function (err) {
        if (err) return res.status(500).json({ Error: "Error al eliminar usuario" });
        res.status(200).json({ Mensaje: "Usuario eliminado" });
    });
};

module.exports = { RegistrarUsuario, IniciarSesion, ListarUsuarios, EliminarUsuario };