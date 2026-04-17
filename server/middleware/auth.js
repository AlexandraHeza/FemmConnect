// Middleware para verificar token JWT
const jwt = require('jsonwebtoken');
const SECRET = 'clave_secreta_femmconecta';

function verificarToken(req, res, next) {
  const token = req.headers['authorization'];
  if (!token) return res.status(403).json({ error: 'Token requerido' });

  jwt.verify(token, SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ error: 'Token inválido' });
    req.usuarioId = decoded.id;
    req.rol = decoded.rol;
    next();
  });
}

module.exports = { verificarToken, SECRET };