const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '../../data/db.json');

function leerDB() {
  return JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
}

function escribirDB(data) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

module.exports = {
  obtenerUsuarios() {
    return leerDB().usuarios;
  },
  agregarUsuario(nuevo) {
    const db = leerDB();
    const id = db.usuarios.length + 1;
    db.usuarios.push({ id, ...nuevo });
    escribirDB(db);
    return id;
  },
  obtenerProductos() {
    return leerDB().productos;
  },
  agregarProducto(nuevo) {
    const db = leerDB();
    const id = db.productos.length + 1;
    db.productos.push({ id, ...nuevo });
    escribirDB(db);
    return { id, ...nuevo };
  },
  agregarSolicitudMentoria(solicitud) {
    const db = leerDB();
    db.solicitudesMentoria.push(solicitud);
    escribirDB(db);
  }
};
