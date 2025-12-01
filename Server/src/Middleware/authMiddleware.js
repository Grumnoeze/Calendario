const jwt = require('jsonwebtoken');

// Verifica que el token sea válido
exports.verificarToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // formato: "Bearer token"

  if (!token) {
    return res.status(401).json({ Error: "Token no proporcionado" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, usuario) => {
    if (err) {
      return res.status(403).json({ Error: "Token inválido" });
    }
    req.user = usuario; 
    next();
  });
};

// Middleware para validar que sea Director
exports.soloDirector = (req, res, next) => {
  if (req.user?.Rol !== "Director") {
    return res.status(403).json({ Error: "Acceso restringido: solo Director" });
  }
  next();
};
