// ═══════════════════════════════════════════════════
// Rutas de Productos
// GET  /api/productos          → listar todos
// GET  /api/productos/:id      → detalle de uno
// POST /api/productos          → crear (solo emprendedoras)
// PUT  /api/productos/:id      → editar (solo dueña)
// DELETE /api/productos/:id    → eliminar (solo dueña)
// ═══════════════════════════════════════════════════

const express = require('express');
const router  = express.Router();
const { leerDB, guardarDB, generarId } = require('../models/db');
const { verificarSesion, verificarRol } = require('../middleware/auth');

// ── GET /api/productos ────────────────────────────
router.get('/', (req, res) => {
  const db = leerDB();
  const { categoria, busqueda } = req.query;

  let productos = db.productos;

  // Filtro por categoría
  if (categoria) {
    productos = productos.filter(p =>
      p.categoria.toLowerCase() === categoria.toLowerCase()
    );
  }

  // Filtro por búsqueda en nombre o descripción
  if (busqueda) {
    const q = busqueda.toLowerCase();
    productos = productos.filter(p =>
      p.nombre.toLowerCase().includes(q) ||
      p.descripcion.toLowerCase().includes(q)
    );
  }

  return res.json({ ok: true, total: productos.length, productos });
});

// ── GET /api/productos/:id ────────────────────────
router.get('/:id', (req, res) => {
  const db = leerDB();
  const producto = db.productos.find(p => p.id === req.params.id);

  if (!producto) {
    return res.status(404).json({ error: 'Producto no encontrado.' });
  }

  // Adjuntar datos de la vendedora
  const vendedora = db.usuarios.find(u => u.id === producto.vendedora_id);
  return res.json({
    ok: true,
    producto,
    vendedora: vendedora
      ? { id: vendedora.id, nombre: vendedora.nombre, foto: vendedora.foto, whatsapp: vendedora.whatsapp }
      : null
  });
});

// ── POST /api/productos ───────────────────────────
router.post('/', verificarSesion, verificarRol('emprendedora'), (req, res) => {
  const { nombre, descripcion, precio, categoria, imagen, stock } = req.body;

  if (!nombre || !precio || !categoria) {
    return res.status(400).json({ error: 'Nombre, precio y categoría son obligatorios.' });
  }

  const db = leerDB();
  const nuevo = {
    id:          generarId('p'),
    vendedora_id: req.session.usuario.id,
    nombre,
    descripcion:  descripcion || '',
    precio:       parseFloat(precio),
    categoria,
    imagen:       imagen || 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600&q=80',
    stock:        parseInt(stock) || 0,
    vendedora:    req.session.usuario.nombre
  };

  db.productos.push(nuevo);
  guardarDB(db);

  return res.status(201).json({ ok: true, mensaje: 'Producto agregado.', producto: nuevo });
});

// ── PUT /api/productos/:id ────────────────────────
router.put('/:id', verificarSesion, (req, res) => {
  const db = leerDB();
  const idx = db.productos.findIndex(p => p.id === req.params.id);

  if (idx === -1) return res.status(404).json({ error: 'Producto no encontrado.' });

  // Solo la dueña puede editar
  if (db.productos[idx].vendedora_id !== req.session.usuario.id) {
    return res.status(403).json({ error: 'No puedes editar este producto.' });
  }

  db.productos[idx] = { ...db.productos[idx], ...req.body, id: req.params.id };
  guardarDB(db);

  return res.json({ ok: true, mensaje: 'Producto actualizado.', producto: db.productos[idx] });
});

// ── DELETE /api/productos/:id ─────────────────────
router.delete('/:id', verificarSesion, (req, res) => {
  const db = leerDB();
  const producto = db.productos.find(p => p.id === req.params.id);

  if (!producto) return res.status(404).json({ error: 'Producto no encontrado.' });
  if (producto.vendedora_id !== req.session.usuario.id) {
    return res.status(403).json({ error: 'No puedes eliminar este producto.' });
  }

  db.productos = db.productos.filter(p => p.id !== req.params.id);
  guardarDB(db);

  return res.json({ ok: true, mensaje: 'Producto eliminado.' });
});

module.exports = router;
