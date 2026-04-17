const express = require('express');
const jwt = require('jsonwebtoken');
const { SECRET } = require('../middleware/auth');
const db = require('../models/db');

const router = express.Router();

// Login
router.post('/login', (req, res) => {
  const { email, password, rol } = req.body;
  const usuario = db.obtenerUsuarios().find(u => u.email === email && u.password === password && u.rol === rol);
  if (!usuario) return res.status(401).json({ error: 'Credenciales inválidas' });

  const token = jwt.sign({ id: usuario.id, rol: usuario.rol }, SECRET);
  res.json({ token, usuario: { id: usuario.id, nombre: usuario.nombre, rol: usuario.rol } });
});

// Registro simplificado (solo emprendedora)
router.post('/registro', (req, res) => {
  const { nombre, email, password, especialidad, telefono, descripcion } = req.body;
  const nuevoId = db.agregarUsuario({ nombre, email, password, rol: 'emprendedora', especialidad, telefono, descripcion });
  res.json({ mensaje: 'Usuario creado', id: nuevoId });
});

module.exports = router;