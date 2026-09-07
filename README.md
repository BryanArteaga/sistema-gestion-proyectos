# Sistema de Gestión de Proyectos 📊

Un prototipo funcional de gestión de proyectos con frontend interactivo y backend API REST.

## ✨ Características

- ✅ Autenticación de usuarios
- ✅ Crear, editar y eliminar proyectos
- ✅ Gestionar tareas dentro de proyectos
- ✅ Asignar responsables
- ✅ Seguimiento de progreso
- ✅ Dashboard con estadísticas
- ✅ Sistema de comentarios en tareas

## 🛠️ Tecnologías

### Frontend
- **HTML5** - Estructura
- **CSS3** - Estilos modernos
- **JavaScript Vanilla** - Interactividad
- **LocalStorage** - Persistencia de datos

### Backend
- **Node.js + Express** - API REST
- **SQLite** - Base de datos
- **JWT** - Autenticación

## 📁 Estructura del Proyecto

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
│   └── database/
│       └── schema.sql
│
└── README.md
```

## 🚀 Instalación y Uso

### Backend
```bash
cd backend
npm install
npm start
```

### Frontend
Abrir `frontend/index.html` en el navegador

## 📝 Notas
- Sistema completamente funcional
- Datos persistentes con localStorage (frontend)
- API REST documentada
- Interfaz intuitiva y responsiva

---

**Versión:** 1.0.0  
**Autor:** Bryan Arteaga  
**Licencia:** MIT
