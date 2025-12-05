const nodemailer = require("nodemailer");

// Configuración del transporter (usa variables de entorno)
const transporter = nodemailer.createTransport({
  service: "gmail", // o tu servicio SMTP
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Enviar correo de verificación
 * @param {string} correo - Email del destinatario
 * @param {string} token - Token de verificación único
 */
exports.enviarCorreoVerificacion = async (correo, token) => {
  const url = `http://localhost:${process.env.PORT}/api/usuarios/verificar?token=${token}`;

  const mensaje = {
    from: process.env.EMAIL_USER,
    to: correo,
    subject: "Verificación de cuenta",
    html: `
      <p>Hola,</p>
      <p>Haz clic en el siguiente enlace para verificar tu cuenta:</p>
      <a href="${url}">${url}</a>
    `,
  };

  try {
    await transporter.sendMail(mensaje);
    console.log(`📧 Correo de verificación enviado a ${correo}`);
  } catch (error) {
    console.error("❌ Error al enviar correo:", error);
    throw error;
  }
};
