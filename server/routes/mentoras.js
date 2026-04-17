const express = require('express');
const db = require('../models/db');

const router = express.Router();

// Listar mentoras
router.get('/', (req, res) => {
  const mentoras = db.obtenerUsuarios().filter(u => u.rol === 'mentora');
  res.json(mentoras);
});

// Disponibilidad de mentora específica
router.get('/:id/disponibilidad', (req, res) => {
  const mentora = db.obtenerUsuarios().find(u => u.id == req.params.id && u.rol === 'mentora');
  mentora ? res.json({ disponibilidad: mentora.disponibilidad }) : res.status(404).json({ error: 'Mentora no encontrada' });
});

// Solicitar mentoría
router.post('/solicitar', (req, res) => {
  const { mentoraId, fecha, mensaje, solicitanteId } = req.body;
  const solicitud = { id: Date.now(), mentoraId, fecha, mensaje, solicitanteId, estado: 'pendiente' };
  db.agregarSolicitudMentoria(solicitud);
  res.json({ mensaje: 'Solicitud enviada', solicitud });
});

module.exports = router;