// ═══════════════════════════════════════════════════
// Modelo de base de datos (JSON)
// Lectura y escritura del archivo db.json
// Para el piloto usamos JSON plano; en producción
// se migra a PostgreSQL o MongoDB
// ═══════════════════════════════════════════════════

const fs   = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '../../data/db.json');

/**
 * Lee y devuelve toda la base de datos como objeto JS
 */
function leerDB() {
  try {
    const raw = fs.readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error leyendo db.json:', err.message);
    return { usuarios: [], productos: [], solicitudes_mentoria: [], mensajes_contacto: [] };
  }
}

/**
 * Guarda el objeto completo en db.json
 */
function guardarDB(datos) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(datos, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error guardando db.json:', err.message);
    return false;
  }
}

/**
 * Genera un ID único simple basado en timestamp
 */
function generarId(prefijo = 'id') {
  return `${prefijo}_${Date.now()}`;
}

module.exports = { leerDB, guardarDB, generarId };
