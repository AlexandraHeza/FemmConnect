const express = require('express');
const db = require('../models/db');
const { verificarToken } = require('../middleware/auth');

const router = express.Router();

// Obtener todos los productos
router.get('/', (req, res) => {
  res.json(db.obtenerProductos());
});

// Obtener producto por ID
router.get('/:id', (req, res) => {
  const producto = db.obtenerProductos().find(p => p.id == req.params.id);
  producto ? res.json(producto) : res.status(404).json({ error: 'No encontrado' });
});

// Crear producto (solo emprendedora)
router.post('/', verificarToken, (req, res) => {
  if (req.rol !== 'emprendedora') return res.status(403).json({ error: 'No autorizado' });
  const { nombre, precio, imagen, descripcion } = req.body;
  const nuevo = db.agregarProducto({ nombre, precio, imagen, descripcion, vendedoraId: req.usuarioId });
  res.json(nuevo);
});

module.exports = router;