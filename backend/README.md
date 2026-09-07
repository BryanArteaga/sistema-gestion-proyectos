# Sistema de Gestión de Proyectos - API Backend

API REST completa para gestión de proyectos y tareas.

## 🚀 Instalación

```bash
cd backend
npm install
npm start
```

## 📝 Endpoints

### Autenticación
- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/login` - Iniciar sesión
- `GET /api/auth/perfil` - Obtener perfil (requiere token)

### Proyectos
- `POST /api/proyectos` - Crear proyecto
- `GET /api/proyectos` - Obtener mis proyectos
- `GET /api/proyectos/:id` - Obtener proyecto específico
- `PUT /api/proyectos/:id` - Actualizar proyecto
- `DELETE /api/proyectos/:id` - Eliminar proyecto
- `GET /api/proyectos/:id/stats` - Obtener estadísticas del proyecto

### Tareas
- `POST /api/tareas` - Crear tarea
- `GET /api/tareas` - Obtener mis tareas
- `GET /api/tareas/proyecto/:proyectoId` - Obtener tareas de un proyecto
- `GET /api/tareas/:id` - Obtener tarea específica
- `PUT /api/tareas/:id` - Actualizar tarea
- `DELETE /api/tareas/:id` - Eliminar tarea
- `POST /api/tareas/:id/comentarios` - Agregar comentario

## 🔐 Autenticación

Todos los endpoints excepto `/auth/register` y `/auth/login` requieren un token JWT en el header:

```
Authorization: Bearer <token>
```

## 📊 Variables de Entorno

Copia `.env` y configura:

```
PORT=3000
DB_PATH=./database/proyectos.db
JWT_SECRET=tu_clave_secreta_aqui
NODE_ENV=development
```

## 💾 Base de Datos

Utiliza SQLite3. La base de datos se crea automáticamente al iniciar la aplicación.
