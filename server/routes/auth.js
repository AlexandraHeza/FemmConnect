// ═══════════════════════════════════════════════════
// Rutas de autenticación
// POST /api/auth/login
// POST /api/auth/registro
// POST /api/auth/logout
// GET  /api/auth/me
// ═══════════════════════════════════════════════════

const express = require('express');
const router  = express.Router();
const { leerDB, guardarDB, generarId } = require('../models/db');

// ── POST /api/auth/login ──────────────────────────
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email y contraseña son requeridos.' });
  }

  const db = leerDB();
  // Buscar usuario por email (sin encriptar para piloto)
  const usuario = db.usuarios.find(
    u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
  );

  if (!usuario) {
    return res.status(401).json({ error: 'Credenciales incorrectas.' });
  }

  // Guardar en sesión (sin la contraseña)
  const { password: _, ...usuarioSinPass } = usuario;
  req.session.usuario = usuarioSinPass;

  return res.json({
    ok: true,
    mensaje: `Bienvenida, ${usuario.nombre}`,
    usuario: usuarioSinPass
  });
});

// ── POST /api/auth/registro ───────────────────────
router.post('/registro', (req, res) => {
  const { nombre, email, password, rol, especialidad } = req.body;

  if (!nombre || !email || !password || !rol) {
    return res.status(400).json({ error: 'Faltan datos obligatorios.' });
  }

  const rolesValidos = ['emprendedora', 'mentora', 'compradora'];
  if (!rolesValidos.includes(rol)) {
    return res.status(400).json({ error: 'Rol no válido.' });
  }

  const db = leerDB();

  // Verificar que el email no exista ya
  const existe = db.usuarios.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (existe) {
    return res.status(409).json({ error: 'Este correo ya está registrado.' });
  }

  // Crear nuevo usuario
  const nuevoUsuario = {
    id:          generarId('u'),
    nombre:      nombre.trim(),
    email:       email.toLowerCase().trim(),
    password,    // En producción usar bcrypt
    rol,
    especialidad: especialidad || '',
    bio:         '',
    foto:        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80',
    whatsapp:    '',
    ubicacion:   'Gustavo A. Madero, CDMX'
  };

  db.usuarios.push(nuevoUsuario);
  guardarDB(db);

  // Iniciar sesión automáticamente
  const { password: _, ...usuarioSinPass } = nuevoUsuario;
  req.session.usuario = usuarioSinPass;

  return res.status(201).json({
    ok: true,
    mensaje: `Cuenta creada. ¡Bienvenida, ${nombre}!`,
    usuario: usuarioSinPass
  });
});

// ── POST /api/auth/logout ─────────────────────────
router.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.json({ ok: true, mensaje: 'Sesión cerrada.' });
  });
});

// ── GET /api/auth/me ──────────────────────────────
router.get('/me', (req, res) => {
  if (req.session && req.session.usuario) {
    return res.json({ ok: true, usuario: req.session.usuario });
  }
  return res.status(401).json({ ok: false, error: 'No autenticado.' });
});

module.exports = router;
