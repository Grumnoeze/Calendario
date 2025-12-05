const db = require('../DataBase/db');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');

const { enviarCorreoVerificacion } = require("../Utils/Email");


// Crear usuario (solo Director)
exports.crear = (req, res) => {
  const { Mail, Name, Rol, PermisoVisualizacion, PermisoEdicion } = req.body;
  const usuarioLogueado = req.user; // suponiendo que usás middleware de auth

  if (!usuarioLogueado || usuarioLogueado.Rol !== "Director") {
    return res.status(403).json({ Error: "Solo el Director puede crear usuarios" });
  }

  if (!Mail || !Name || !Rol) {
    return res.status(400).json({ Error: "Faltan datos obligatorios" });
  }

  // Generar token de verificación
  const token = crypto.randomBytes(32).toString('hex');

  const sql = `INSERT INTO Usuarios 
    (Mail, Password, Name, Rol, PermisoVisualizacion, PermisoEdicion, Estado, Verificado, TokenVerificacion) 
    VALUES (?, NULL, ?, ?, ?, ?, 'pendiente', 0, ?)`;

  db.run(sql, [Mail, Name, Rol, PermisoVisualizacion, PermisoEdicion, token], (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ Error: "Error al crear usuario" });
    }
    // Enviar correo de verificación
    enviarCorreoVerificacion(Mail, token)
      .then(() => {
        res.status(201).json({ Mensaje: "Usuario creado y correo de verificación enviado" });
      })
      .catch(() => {
        res.status(500).json({ Error: "Usuario creado pero error al enviar correo" });
      });
  });
};

// Verificar usuario
exports.verificar = (req, res) => {
  const { token } = req.query;

  db.get(`SELECT * FROM Usuarios WHERE TokenVerificacion = ?`, [token], (err, usuario) => {
    if (err) return res.status(500).json({ Error: "Error en la base de datos" });
    if (!usuario) return res.status(404).json({ Error: "Token inválido" });

    const sql = `UPDATE Usuarios SET Verificado = 1, Estado = 'aceptado', FechaVerificacion = datetime('now'), TokenVerificacion = NULL WHERE Mail = ?`;
    db.run(sql, [usuario.Mail], (err2) => {
      if (err2) return res.status(500).json({ Error: "Error al verificar usuario" });
      res.status(200).json({ Mensaje: "Cuenta verificada correctamente" });
    });
  });
};

exports.login = (req, res) => {
  const { Mail, Password } = req.body;

  if (!Mail || !Password) {
    return res.status(400).json({ Error: "Faltan datos obligatorios" });
  }

  db.get(`SELECT * FROM Usuarios WHERE Mail = ?`, [Mail], async (err, usuario) => {
    if (err) return res.status(500).json({ Error: "Error en la base de datos" });
    if (!usuario) return res.status(404).json({ Error: "Usuario no encontrado" });

    if (usuario.Verificado !== 1) {
      return res.status(403).json({ Error: "Cuenta no verificada" });
    }

    // Primer login: no tiene contraseña
    if (!usuario.Password) {
      const hash = await bcrypt.hash(Password, 10);
      db.run(`UPDATE Usuarios SET Password = ? WHERE Mail = ?`, [hash, Mail], (err2) => {
        if (err2) return res.status(500).json({ Error: "Error al guardar contraseña" });

        const payload = { Mail: usuario.Mail, Name: usuario.Name, Rol: usuario.Rol };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '30d' });

        return res.status(200).json({
          Mensaje: "Contraseña creada e inicio de sesión exitoso",
          token,
          Mail: usuario.Mail,
          Name: usuario.Name,
          Rol: usuario.Rol
        });
      });
      return;
    }

    // Login normal
    const valido = await bcrypt.compare(Password, usuario.Password);
    if (!valido) return res.status(401).json({ Error: "Contraseña incorrecta" });

    const payload = { Mail: usuario.Mail, Name: usuario.Name, Rol: usuario.Rol };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '90d' });

    return res.status(200).json({
      Mensaje: "Inicio de sesión exitoso",
      token,
      Mail: usuario.Mail,
      Name: usuario.Name,
      Rol: usuario.Rol
    });
  });
};

exports.listar = (req, res) => {
  const sql = `
    SELECT Name, Mail, Rol, PermisoVisualizacion, PermisoEdicion
    FROM Usuarios
  `;
  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error("❌ Error al listar usuarios:", err);
      return res.status(500).json({ Error: "Error al listar usuarios" });
    }
    res.status(200).json(rows);
  });
};

// Eliminar usuario
exports.eliminar = (req, res) => {
  const { mail } = req.params;

  db.run(`DELETE FROM Usuarios WHERE Mail = ?`, [mail], (err) => {
    if (err) return res.status(500).json({ Error: "Error al eliminar usuario" });
    res.status(200).json({ Mensaje: "Usuario eliminado correctamente" });
  });
};
