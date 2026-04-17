# FEMMConecta 💜

Plataforma digital para mujeres emprendedoras de la Alcaldía **Gustavo A. Madero, CDMX**.  
Un proyecto de **Pilares GAM** — Docente de Tecnología A.

---

## 🗂️ Estructura de archivos

```
femmconecta/
├── server/
│   ├── index.js               ← Express + rutas principales
│   ├── routes/
│   │   ├── auth.js            ← Login / registro / logout
│   │   ├── productos.js       ← CRUD de productos
│   │   ├── mentoras.js        ← Perfiles, agenda, contacto
│   │   └── usuarios.js        ← Perfil emprendedoras
│   ├── models/
│   │   └── db.js              ← Lectura/escritura db.json
│   └── middleware/
│       └── auth.js            ← Verificación de sesión
├── public/
│   ├── index.html             ← Login (página raíz)
│   ├── css/
│   │   └── styles.css         ← Estilos globales (paleta FEMM)
│   ├── js/
│   │   └── app.js             ← Lógica compartida (Auth, fetch, navbar)
│   └── pages/
│       ├── dashboard.html     ← Home con estadísticas
│       ├── emprendedoras.html ← Perfiles + modal detalle
│       ├── catalogo.html      ← Catálogo con filtros
│       ├── tienda.html        ← Producto individual + pago
│       ├── mentoras.html      ← Lista de mentoras
│       ├── agenda.html        ← Formulario de mentoría
│       └── contacto.html      ← Formulario de contacto
├── data/
│   └── db.json                ← Base de datos JSON (piloto)
├── package.json
└── README.md
```

---

## 🚀 Instalación y uso

### 1. Clonar / descomprimir el proyecto
```bash
cd femmconecta
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Iniciar el servidor
```bash
# Modo normal
npm start

# Modo desarrollo (recarga automática)
npm run dev
```

### 4. Abrir en el navegador
```
http://localhost:3000
```

---

## 👤 Usuarios de prueba (demo)

| Nombre | Email | Contraseña | Rol |
|---|---|---|---|
| Agustina Hernández | agustina@femm.mx | 1234 | Emprendedora |
| Lourdes Morales | lourdes@femm.mx | 1234 | Emprendedora |
| Mónica Mendoza | monica@femm.mx | 1234 | Emprendedora |
| Rocío Elizabeth | rocio@femm.mx | 1234 | Mentora |
| Ana Villegas | ana@femm.mx | 1234 | Mentora |
| María López | maria@gmail.com | 1234 | Compradora |

---

## 🌐 API — Endpoints disponibles

### Autenticación
| Método | Ruta | Descripción |
|---|---|---|
| POST | `/api/auth/login` | Iniciar sesión |
| POST | `/api/auth/registro` | Crear cuenta |
| POST | `/api/auth/logout` | Cerrar sesión |
| GET  | `/api/auth/me` | Usuario actual |

### Productos
| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/productos` | Listar (con `?categoria=` y `?busqueda=`) |
| GET | `/api/productos/:id` | Detalle del producto |
| POST | `/api/productos` | Crear (solo emprendedoras) |
| PUT | `/api/productos/:id` | Editar |
| DELETE | `/api/productos/:id` | Eliminar |

### Mentoras
| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/mentoras` | Listar mentoras |
| GET | `/api/mentoras/:id` | Perfil de mentora |
| POST | `/api/mentoras/:id/solicitud` | Solicitar mentoría |
| POST | `/api/mentoras/contacto/mensaje` | Enviar mensaje de contacto |

### Usuarios / Emprendedoras
| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/usuarios/emprendedoras` | Listar emprendedoras |
| GET | `/api/usuarios/:id` | Perfil público |
| PUT | `/api/usuarios/mi/perfil` | Actualizar mi perfil |

---

## 🎨 Paleta de colores

| Variable | Color | Uso |
|---|---|---|
| `--morado` | `#5B3F8C` | Color principal |
| `--morado-oscuro` | `#3A2460` | Headers, navbar |
| `--rosa` | `#E84DAF` | Acento, precios, CTAs |
| `--crema` | `#FFF8F4` | Fondo general |
| `--gris-borde` | `#E8E0F0` | Bordes de cards |

---

## 📦 Stack tecnológico

| Capa | Tecnología |
|---|---|
| Servidor | Node.js + Express |
| Sesiones | express-session |
| Base de datos | JSON plano (lowdb-like) |
| Frontend | HTML5 + CSS3 + JS Vanilla |
| Tipografía | Google Fonts (Playfair Display + DM Sans) |
| Imágenes | Unsplash CDN |
| Pagos (piloto) | MercadoPago + SPEI (simulado) |

---

## 🔄 Migración a producción (futuro)

1. Reemplazar `db.json` por **PostgreSQL** o **MongoDB**
2. Encriptar contraseñas con **bcryptjs** (ya instalado)
3. Integrar **MercadoPago SDK** real para cobros
4. Subir a **Railway**, **Render** o **Heroku**
5. Dominio: `femmconecta.mx`

---

## 📋 Notas para GitHub Pages

> ⚠️ GitHub Pages solo sirve archivos estáticos (HTML/CSS/JS).  
> El servidor Node.js **no corre** en GitHub Pages.

**Para demo estática en GitHub Pages:**
- Sube solo la carpeta `/public`
- Los fetches a `/api/...` fallarán — muestra datos mock desde `app.js`
- Para demo completa usa **Railway** o **Render** (gratis)

---

## 💜 Créditos

Desarrollado como proyecto piloto para **FEMMConecta**  
Impulsado por **Pilares — Alcaldía Gustavo A. Madero, CDMX**  
Docente de Tecnología A · 2024
