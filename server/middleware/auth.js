// ═══════════════════════════════════════════════════
// Middleware de autenticación
// Verifica que haya sesión activa antes de permitir
// acceso a rutas protegidas
// ═══════════════════════════════════════════════════

/**
 * Verifica si el usuario ha iniciado sesión.
 * Si no, responde con 401 Unauthorized.
 */
function verificarSesion(req, res, next) {
  if (req.session && req.session.usuario) {
    // Usuario autenticado → continuar
    return next();
  }
  return res.status(401).json({ error: 'Debes iniciar sesión para continuar.' });
}

/**
 * Verifica que el usuario tenga un rol específico.
 * Uso: verificarRol('mentora') o verificarRol(['emprendedora','mentora'])
 */
function verificarRol(roles) {
  return (req, res, next) => {
    if (!req.session || !req.session.usuario) {
      return res.status(401).json({ error: 'No autenticado.' });
    }
    const rolesPermitidos = Array.isArray(roles) ? roles : [roles];
    if (rolesPermitidos.includes(req.session.usuario.rol)) {
      return next();
    }
    return res.status(403).json({ error: 'No tienes permiso para esta acción.' });
  };
}

module.exports = { verificarSesion, verificarRol };
