# 🚀 GUÍA DE INICIO RÁPIDO

## Sistema de Gestión de Proyectos - Prototipo Funcional

### 📋 Resumen del Proyecto

Este es un sistema completo y funcional de gestión de proyectos que incluye:
- ✅ **Frontend**: Interfaz interactiva con HTML5, CSS3 y JavaScript vanilla
- ✅ **Backend**: API REST con Node.js y Express
- ✅ **Base de Datos**: SQLite3 con tablas relacionadas
- ✅ **Autenticación**: Sistema de login y registro con JWT
- ✅ **Funcionalidades**: Crear/editar/eliminar proyectos y tareas

---

## 🛠️ Requisitos Previos

- **Node.js** v14+ ([descargar](https://nodejs.org/))
- **npm** (viene con Node.js)
- Navegador web moderno (Chrome, Firefox, Safari, Edge)
- Terminal/Consola de comandos

---

## 📦 Instalación y Configuración

### 1️⃣ Clonar el Repositorio

```bash
git clone https://github.com/BryanArteaga/sistema-gestion-proyectos.git
cd sistema-gestion-proyectos
```

### 2️⃣ Configurar Backend

```bash
cd backend

# Instalar dependencias
npm install

# El archivo .env ya está configurado con valores por defecto
# Si necesitas cambiar algo, edita backend/.env
```

### 3️⃣ Iniciar el Servidor Backend

```bash
# Desde la carpeta backend/
npm start

# Deberías ver algo como:
# ✨ Servidor corriendo en http://localhost:3000
# 📡 API disponible en http://localhost:3000/api
# 🔍 Verifica el estado: http://localhost:3000/api/health
```

### 4️⃣ Abrir el Frontend

En otra terminal o ventana del navegador:

```bash
# Opción 1: Abrir directamente
# En Windows: explorer frontend/index.html
# En Mac: open frontend/index.html
# En Linux: xdg-open frontend/index.html

# Opción 2: Usar un servidor local simple (recomendado)
# Desde la carpeta raíz del proyecto
npx http-server frontend -p 8080

# Luego abre: http://localhost:8080
```

---

## 👤 Datos de Prueba

### Crear Cuenta de Prueba

1. En la página de login, haz clic en "Regístrate aquí"
2. Completa el formulario:
   - **Nombre**: Tu nombre
   - **Email**: cualquier@email.com
   - **Contraseña**: mínimo 6 caracteres
3. Haz clic en "Registrarse"

### O usa estas credenciales si ya existen:

```
Email: test@ejemplo.com
Contraseña: 123456
```

---

## 🎯 Funcionalidades Principales

### Dashboard
- Vista general de proyectos activos
- Tareas pendientes
- Progreso general del trabajo
- Acceso rápido a proyectos y tareas recientes

### Gestión de Proyectos
- ➕ Crear nuevos proyectos
- ✏️ Editar información del proyecto
- 🗑️ Eliminar proyectos
- 📊 Ver progreso y estadísticas
- 📅 Establecer fechas de inicio y fin
- 💰 Gestionar presupuestos

### Gestión de Tareas
- ➕ Crear tareas dentro de proyectos
- 🏷️ Asignar prioridades (Alta, Media, Baja)
- ✅ Cambiar estado (Por hacer, En progreso, Completada)
- 📈 Seguimiento de progreso
- 💬 Agregar comentarios
- 📅 Establecer fechas límite

---

## 🔌 API Endpoints

### Autenticación
```
POST   /api/auth/register      → Registrar usuario
POST   /api/auth/login         → Iniciar sesión
GET    /api/auth/perfil        → Obtener perfil (requiere token)
```

### Proyectos
```
POST   /api/proyectos          → Crear proyecto
GET    /api/proyectos          → Obtener todos los proyectos
GET    /api/proyectos/:id      → Obtener proyecto específico
PUT    /api/proyectos/:id      → Actualizar proyecto
DELETE /api/proyectos/:id      → Eliminar proyecto
GET    /api/proyectos/:id/stats → Obtener estadísticas
```

### Tareas
```
POST   /api/tareas             → Crear tarea
GET    /api/tareas             → Obtener todas las tareas
GET    /api/tareas/:id         → Obtener tarea específica
PUT    /api/tareas/:id         → Actualizar tarea
DELETE /api/tareas/:id         → Eliminar tarea
POST   /api/tareas/:id/comentarios → Agregar comentario
```

---

## 🧪 Ejemplos de Uso (cURL)

### Registrar Usuario
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Juan Pérez",
    "email": "juan@ejemplo.com",
    "password": "123456"
  }'
```

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "juan@ejemplo.com",
    "password": "123456"
  }'
```

### Crear Proyecto (con token)
```bash
curl -X POST http://localhost:3000/api/proyectos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN_AQUI" \
  -d '{
    "nombre": "Mi Proyecto",
    "descripcion": "Descripción del proyecto",
    "fechaInicio": "2024-01-01",
    "fechaFin": "2024-12-31",
    "presupuesto": 5000
  }'
```

---

## 📁 Estructura de Carpetas

```
sistema-gestion-proyectos/
├── frontend/
│   ├── index.html
│   ├── css/
│   │   ├── styles.css
│   │   └── responsive.css
│   ├── js/
│   │   ├── app.js
│   │   ├── auth.js
│   │   ├── proyectos.js
│   │   ├── tareas.js
│   │   └── utils.js
│   └── pages/
│       ├── login.html
│       ├── dashboard.html
│       ├── proyectos.html
│       └── tareas.html
│
├── backend/
│   ├── server.js
│   ├── package.json
│   ├── .env
│   ├── config/
│   │   └── database.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── proyectos.js
│   │   └── tareas.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── proyectosController.js
│   │   └── tareasController.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── database/
│   │   └── schema.sql
│   └── README.md
│
└── README.md
```

---

## 🐛 Solución de Problemas

### "Puerto 3000 ya está en uso"
```bash
# Cambiar puerto en backend/.env
PORT=3001
```

### "No puedo conectar al backend desde el frontend"
- Asegúrate de que el backend esté corriendo
- Verifica que el puerto sea correcto
- Comprueba que CORS esté habilitado (ya lo está por defecto)

### "Error de base de datos"
- Elimina la carpeta `backend/database/`
- Reinicia el servidor (se recreará automáticamente)

### "Módulos no encontrados"
```bash
cd backend
rm -rf node_modules package-lock.json
npm install
```

---

## 🎓 Flujo de Trabajo Típico

1. **Registrarse o Iniciar Sesión** → Login page
2. **Ver Dashboard** → Resumen del trabajo
3. **Crear Proyecto** → Clickear "+ Nuevo Proyecto"
4. **Crear Tareas** → Dentro del proyecto
5. **Actualizar Estado** → Marcar como completada
6. **Ver Progreso** → Visualizar en el dashboard

---

## 📱 Dispositivos Soportados

- ✅ Desktop (computadoras)
- ✅ Tablets
- ✅ Móviles (responsive design)

---

## 🔐 Seguridad

- Las contraseñas se hashean con bcryptjs
- Los tokens JWT expiran en 7 días
- La API está protegida con middleware de autenticación
- CORS configurado para desarrollo

---

## 📊 Tecnologías Utilizadas

### Frontend
- HTML5
- CSS3 (Grid, Flexbox, Animations)
- JavaScript ES6+
- LocalStorage (persistencia)

### Backend
- Node.js
- Express.js
- SQLite3
- JWT (JSON Web Tokens)
- bcryptjs (hashing)

---

## 🚀 Próximas Mejoras

- [ ] Integración con base de datos remota (PostgreSQL, MySQL)
- [ ] Autenticación OAuth (Google, GitHub)
- [ ] Notificaciones en tiempo real (WebSockets)
- [ ] Búsqueda avanzada y filtros
- [ ] Exportar reportes (PDF, Excel)
- [ ] Integración con calendarios
- [ ] Colaboración en tiempo real
- [ ] Aplicación móvil nativa

---

## 📞 Soporte

Para reportar errores o sugerencias:
1. Crea un issue en GitHub
2. Describe el problema detalladamente
3. Incluye pasos para reproducir

---

## 📄 Licencia

MIT - Libre para usar y modificar

---

## ✨ ¡Felicidades!

Ya tienes un sistema funcional de gestión de proyectos. ¡Comienza a crear tu primer proyecto!

**¿Preguntas?** Revisa los archivos README.md en las carpetas frontend/ y backend/
