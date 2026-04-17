// ═══════════════════════════════════════════════════
// Rutas de Usuarios / Emprendedoras
// GET  /api/usuarios/emprendedoras → listar
// GET  /api/usuarios/:id           → perfil público
// PUT  /api/usuarios/perfil        → actualizar mi perfil
// ═══════════════════════════════════════════════════

const express = require('express');
const router  = express.Router();
const { leerDB, guardarDB } = require('../models/db');
const { verificarSesion } = require('../middleware/auth');

// ── GET /api/usuarios/emprendedoras ───────────────
router.get('/emprendedoras', (req, res) => {
  const db = leerDB();
  const emprendedoras = db.usuarios
    .filter(u => u.rol === 'emprendedora')
    .map(({ password, ...u }) => u);

  return res.json({ ok: true, total: emprendedoras.length, emprendedoras });
});

// ── GET /api/usuarios/:id ─────────────────────────
router.get('/:id', (req, res) => {
  const db = leerDB();
  const usuario = db.usuarios.find(u => u.id === req.params.id);

  if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado.' });

  const { password, ...usuarioSinPass } = usuario;

  // Si es emprendedora, incluir sus productos
  let productos = [];
  if (usuario.rol === 'emprendedora') {
    productos = db.productos.filter(p => p.vendedora_id === req.params.id);
  }

  return res.json({ ok: true, usuario: usuarioSinPass, productos });
});

// ── PUT /api/usuarios/perfil ──────────────────────
router.put('/mi/perfil', verificarSesion, (req, res) => {
  const db  = leerDB();
  const idx = db.usuarios.findIndex(u => u.id === req.session.usuario.id);

  if (idx === -1) return res.status(404).json({ error: 'Usuario no encontrado.' });

  // Campos que se pueden actualizar
  const camposPermitidos = ['nombre', 'bio', 'especialidad', 'foto', 'whatsapp', 'ubicacion'];
  camposPermitidos.forEach(campo => {
    if (req.body[campo] !== undefined) {
      db.usuarios[idx][campo] = req.body[campo];
    }
  });

  guardarDB(db);

  const { password, ...actualizado } = db.usuarios[idx];
  req.session.usuario = actualizado; // Actualizar sesión

  return res.json({ ok: true, mensaje: 'Perfil actualizado.', usuario: actualizado });
});

module.exports = router;
