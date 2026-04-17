// Funciones globales reutilizables
function obtenerToken() {
  return localStorage.getItem('token');
}

function usuarioLogueado() {
  return !!obtenerToken();
}

function cerrarSesion() {
  localStorage.clear();
  window.location.href = 'login.html';
}