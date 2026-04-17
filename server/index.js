// ═══════════════════════════════════════════════════
// FEMMConecta — Servidor Principal
// Express + rutas + sesiones + archivos estáticos
// ═══════════════════════════════════════════════════

const express = require('express');
const session = require('express-session');
const cors    = require('cors');
const path    = require('path');

// Importar rutas
const authRoutes     = require('./routes/auth');
const productosRoutes = require('./routes/productos');
const mentorasRoutes  = require('./routes/mentoras');
const usuariosRoutes  = require('./routes/usuarios');

const app  = express();
const PORT = process.env.PORT || 3000;

// ── Middlewares globales ──────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Sesión de usuario (almacenada en memoria para el piloto)
app.use(session({
  secret: 'femmconecta-secreto-2024',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 8 } // 8 horas
}));

// Servir archivos estáticos desde /public
app.use(express.static(path.join(__dirname, '../docs')));

// ── Rutas de la API ───────────────────────────────
app.use('/api/auth',      authRoutes);
app.use('/api/productos', productosRoutes);
app.use('/api/mentoras',  mentorasRoutes);
app.use('/api/usuarios',  usuariosRoutes);

// ── Ruta raíz → redirige a login ─────────────────
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../docs/index.html'));
});

// ── Manejo de errores 404 ─────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// ── Iniciar servidor ──────────────────────────────
app.listen(PORT, () => {
  console.log(`✨ FEMMConecta corriendo en http://localhost:${PORT}`);
  console.log(`   Entorno: ${process.env.NODE_ENV || 'desarrollo'}`);
});
