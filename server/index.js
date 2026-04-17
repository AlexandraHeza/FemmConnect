// Servidor Express principal
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const productosRoutes = require('./routes/productos');
const mentorasRoutes = require('./routes/mentoras');
const usuariosRoutes = require('./routes/usuarios');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Rutas API
app.use('/api/auth', authRoutes);
app.use('/api/productos', productosRoutes);
app.use('/api/mentoras', mentorasRoutes);
app.use('/api/usuarios', usuariosRoutes);

// Inicio del servidor
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});