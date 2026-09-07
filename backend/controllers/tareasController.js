// Controlador de tareas

const db = require('../config/database');

const generateId = () => '_' + Math.random().toString(36).substr(2, 9);

const tareasController = {
    // Crear tarea
    async create(req, res) {
        try {
            const { nombre, descripcion, proyectoId, asignadoA, prioridad, fechaLimite } = req.body;
            
            if (!nombre || !proyectoId) {
                return res.status(400).json({ error: 'Nombre y proyecto requeridos' });
            }
            
            const tareaId = generateId();
            
            await db.runAsync(
                `INSERT INTO tareas 
                 (id, nombre, descripcion, proyecto_id, asignado_a, prioridad, fecha_limite)
                 VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [tareaId, nombre, descripcion || '', proyectoId, asignadoA, prioridad || 'media', fechaLimite]
            );
            
            const tarea = await db.getAsync(
                'SELECT * FROM tareas WHERE id = ?',
                [tareaId]
            );
            
            res.status(201).json({
                mensaje: 'Tarea creada exitosamente',
                tarea
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    
    // Obtener todas las tareas del usuario
    async getAll(req, res) {
        try {
            const tareas = await db.allAsync(
                `SELECT t.*, p.nombre as proyecto_nombre 
                 FROM tareas t 
                 JOIN proyectos p ON t.proyecto_id = p.id 
                 WHERE t.asignado_a = ? 
                 ORDER BY t.fecha_limite ASC`,
                [req.user.id]
            );
            
            res.json(tareas);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    
    // Obtener tareas por proyecto
    async getByProyecto(req, res) {
        try {
            const { proyectoId } = req.params;
            
            const tareas = await db.allAsync(
                `SELECT * FROM tareas WHERE proyecto_id = ? ORDER BY fecha_limite ASC`,
                [proyectoId]
            );
            
            res.json(tareas);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    
    // Obtener una tarea específica
    async getById(req, res) {
        try {
            const { id } = req.params;
            
            const tarea = await db.getAsync(
                `SELECT * FROM tareas WHERE id = ?`,
                [id]
            );
            
            if (!tarea) {
                return res.status(404).json({ error: 'Tarea no encontrada' });
            }
            
            // Obtener comentarios
            const comentarios = await db.allAsync(
                `SELECT c.*, u.nombre as usuario_nombre 
                 FROM comentarios c 
                 JOIN usuarios u ON c.usuario_id = u.id 
                 WHERE c.tarea_id = ? 
                 ORDER BY c.fecha DESC`,
                [id]
            );
            
            res.json({ ...tarea, comentarios });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    
    // Actualizar tarea
    async update(req, res) {
        try {
            const { id } = req.params;
            const { nombre, descripcion, prioridad, fechaLimite, estado, progreso } = req.body;
            
            const tarea = await db.getAsync(
                `SELECT * FROM tareas WHERE id = ?`,
                [id]
            );
            
            if (!tarea) {
                return res.status(404).json({ error: 'Tarea no encontrada' });
            }
            
            await db.runAsync(
                `UPDATE tareas 
                 SET nombre = ?, descripcion = ?, prioridad = ?, fecha_limite = ?, estado = ?, progreso = ?
                 WHERE id = ?`,
                [nombre || tarea.nombre, descripcion || tarea.descripcion,
                 prioridad || tarea.prioridad, fechaLimite || tarea.fecha_limite,
                 estado || tarea.estado, progreso !== undefined ? progreso : tarea.progreso, id]
            );
            
            const tareaActualizada = await db.getAsync(
                'SELECT * FROM tareas WHERE id = ?',
                [id]
            );
            
            res.json({
                mensaje: 'Tarea actualizada exitosamente',
                tarea: tareaActualizada
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    
    // Eliminar tarea
    async delete(req, res) {
        try {
            const { id } = req.params;
            
            const tarea = await db.getAsync(
                `SELECT * FROM tareas WHERE id = ?`,
                [id]
            );
            
            if (!tarea) {
                return res.status(404).json({ error: 'Tarea no encontrada' });
            }
            
            // Eliminar comentarios
            await db.runAsync('DELETE FROM comentarios WHERE tarea_id = ?', [id]);
            
            // Eliminar tarea
            await db.runAsync('DELETE FROM tareas WHERE id = ?', [id]);
            
            res.json({ mensaje: 'Tarea eliminada exitosamente' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    
    // Agregar comentario
    async addComentario(req, res) {
        try {
            const { id } = req.params;
            const { contenido } = req.body;
            
            if (!contenido) {
                return res.status(400).json({ error: 'Contenido requerido' });
            }
            
            const comentarioId = generateId();
            
            await db.runAsync(
                `INSERT INTO comentarios (id, contenido, tarea_id, usuario_id)
                 VALUES (?, ?, ?, ?)`,
                [comentarioId, contenido, id, req.user.id]
            );
            
            const comentario = await db.getAsync(
                `SELECT c.*, u.nombre as usuario_nombre 
                 FROM comentarios c 
                 JOIN usuarios u ON c.usuario_id = u.id 
                 WHERE c.id = ?`,
                [comentarioId]
            );
            
            res.status(201).json({
                mensaje: 'Comentario agregado exitosamente',
                comentario
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = tareasController;
