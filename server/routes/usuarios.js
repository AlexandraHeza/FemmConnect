const express = require('express');
const db = require('../models/db');
const { verificarToken } = require('../middleware/auth');

const router = express.Router();

// Obtener perfil de emprendedora (pública)
router.get('/emprendedoras', (req, res) => {
  const emprendedoras = db.obtenerUsuarios().filter(u => u.rol === 'emprendedora');
  res.json(emprendedoras);
});

// Detalle de una emprendedora
router.get('/emprendedoras/:id', (req, res) => {
  const emprendedora = db.obtenerUsuarios().find(u => u.id == req.params.id && u.rol === 'emprendedora');
  emprendedora ? res.json(emprendedora) : res.status(404).json({ error: 'No encontrada' });
});

module.exports = router;