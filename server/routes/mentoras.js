// ═══════════════════════════════════════════════════
// Rutas de Mentoras
// GET  /api/mentoras           → listar mentoras
// GET  /api/mentoras/:id       → perfil detalle
// POST /api/mentoras/:id/solicitud → solicitar mentoría
// GET  /api/mentoras/solicitudes   → ver solicitudes (mentora)
// ═══════════════════════════════════════════════════

const express = require('express');
const router  = express.Router();
const { leerDB, guardarDB, generarId } = require('../models/db');
const { verificarSesion } = require('../middleware/auth');

// ── GET /api/mentoras ─────────────────────────────
router.get('/', (req, res) => {
  const db = leerDB();
  const mentoras = db.usuarios
    .filter(u => u.rol === 'mentora')
    .map(({ password, ...m }) => m); // Quitar contraseña

  return res.json({ ok: true, total: mentoras.length, mentoras });
});

// ── GET /api/mentoras/:id ─────────────────────────
router.get('/:id', (req, res) => {
  const db = leerDB();
  const mentora = db.usuarios.find(u => u.id === req.params.id && u.rol === 'mentora');

  if (!mentora) return res.status(404).json({ error: 'Mentora no encontrada.' });

  const { password, ...mentoraSinPass } = mentora;
  return res.json({ ok: true, mentora: mentoraSinPass });
});

// ── POST /api/mentoras/:id/solicitud ─────────────
router.post('/:id/solicitud', (req, res) => {
  const { nombre, email, telefono, horario, tema } = req.body;

  if (!nombre || !email || !horario || !tema) {
    return res.status(400).json({ error: 'Faltan datos en el formulario.' });
  }

  const db = leerDB();
  const mentora = db.usuarios.find(u => u.id === req.params.id && u.rol === 'mentora');

  if (!mentora) return res.status(404).json({ error: 'Mentora no encontrada.' });

  const solicitud = {
    id:          generarId('sol'),
    mentora_id:  req.params.id,
    mentora_nombre: mentora.nombre,
    nombre,
    email,
    telefono:    telefono || '',
    horario,
    tema,
    estado:      'pendiente',
    fecha:       new Date().toISOString()
  };

  if (!db.solicitudes_mentoria) db.solicitudes_mentoria = [];
  db.solicitudes_mentoria.push(solicitud);
  guardarDB(db);

  return res.status(201).json({
    ok: true,
    mensaje: `¡Solicitud enviada a ${mentora.nombre}! Te contactará pronto.`,
    solicitud
  });
});

// ── GET /api/mentoras/mis-solicitudes ─────────────
router.get('/mis/solicitudes', verificarSesion, (req, res) => {
  const db = leerDB();
  const solicitudes = (db.solicitudes_mentoria || []).filter(
    s => s.mentora_id === req.session.usuario.id
  );
  return res.json({ ok: true, solicitudes });
});

// ── POST /api/contacto ────────────────────────────
router.post('/contacto/mensaje', (req, res) => {
  const { nombre, email, asunto, mensaje } = req.body;

  if (!nombre || !email || !mensaje) {
    return res.status(400).json({ error: 'Nombre, email y mensaje son obligatorios.' });
  }

  const db = leerDB();
  const nuevo = {
    id:     generarId('msg'),
    nombre,
    email,
    asunto: asunto || 'Sin asunto',
    mensaje,
    fecha:  new Date().toISOString()
  };

  if (!db.mensajes_contacto) db.mensajes_contacto = [];
  db.mensajes_contacto.push(nuevo);
  guardarDB(db);

  return res.status(201).json({ ok: true, mensaje: 'Mensaje enviado. Te responderemos pronto.' });
});

module.exports = router;
