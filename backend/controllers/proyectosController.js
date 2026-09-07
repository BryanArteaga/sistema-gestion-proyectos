// Controlador de proyectos

const db = require('../config/database');

const generateId = () => '_' + Math.random().toString(36).substr(2, 9);

const proyectosController = {
    // Crear proyecto
    async create(req, res) {
        try {
            const { nombre, descripcion, fechaInicio, fechaFin, presupuesto } = req.body;
            
            if (!nombre || !fechaFin) {
                return res.status(400).json({ error: 'Nombre y fecha fin requeridos' });
            }
            
            const proyectoId = generateId();
            
            await db.runAsync(
                `INSERT INTO proyectos 
                 (id, nombre, descripcion, fecha_inicio, fecha_fin, presupuesto, manager_id)
                 VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [proyectoId, nombre, descripcion || '', fechaInicio, fechaFin, presupuesto || 0, req.user.id]
            );
            
            const proyecto = await db.getAsync(
                'SELECT * FROM proyectos WHERE id = ?',
                [proyectoId]
            );
            
            res.status(201).json({
                mensaje: 'Proyecto creado exitosamente',
                proyecto
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    
    // Obtener todos los proyectos del usuario
    async getAll(req, res) {
        try {
            const proyectos = await db.allAsync(
                `SELECT * FROM proyectos WHERE manager_id = ? ORDER BY fecha_creacion DESC`,
                [req.user.id]
            );
            
            res.json(proyectos);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    
    // Obtener un proyecto específico
    async getById(req, res) {
        try {
            const { id } = req.params;
            
            const proyecto = await db.getAsync(
                `SELECT * FROM proyectos WHERE id = ? AND manager_id = ?`,
                [id, req.user.id]
            );
            
            if (!proyecto) {
                return res.status(404).json({ error: 'Proyecto no encontrado' });
            }
            
            res.json(proyecto);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    
    // Actualizar proyecto
    async update(req, res) {
        try {
            const { id } = req.params;
            const { nombre, descripcion, fechaInicio, fechaFin, presupuesto, estado } = req.body;
            
            const proyecto = await db.getAsync(
                `SELECT * FROM proyectos WHERE id = ? AND manager_id = ?`,
                [id, req.user.id]
            );
            
            if (!proyecto) {
                return res.status(404).json({ error: 'Proyecto no encontrado' });
            }
            
            await db.runAsync(
                `UPDATE proyectos 
                 SET nombre = ?, descripcion = ?, fecha_inicio = ?, fecha_fin = ?, presupuesto = ?, estado = ?
                 WHERE id = ?`,
                [nombre || proyecto.nombre, descripcion || proyecto.descripcion, 
                 fechaInicio || proyecto.fecha_inicio, fechaFin || proyecto.fecha_fin,
                 presupuesto !== undefined ? presupuesto : proyecto.presupuesto,
                 estado || proyecto.estado, id]
            );
            
            const proyectoActualizado = await db.getAsync(
                'SELECT * FROM proyectos WHERE id = ?',
                [id]
            );
            
            res.json({
                mensaje: 'Proyecto actualizado exitosamente',
                proyecto: proyectoActualizado
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    
    // Eliminar proyecto
    async delete(req, res) {
        try {
            const { id } = req.params;
            
            const proyecto = await db.getAsync(
                `SELECT * FROM proyectos WHERE id = ? AND manager_id = ?`,
                [id, req.user.id]
            );
            
            if (!proyecto) {
                return res.status(404).json({ error: 'Proyecto no encontrado' });
            }
            
            // Eliminar tareas asociadas
            await db.runAsync('DELETE FROM tareas WHERE proyecto_id = ?', [id]);
            
            // Eliminar proyecto
            await db.runAsync('DELETE FROM proyectos WHERE id = ?', [id]);
            
            res.json({ mensaje: 'Proyecto eliminado exitosamente' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    
    // Obtener estadísticas del proyecto
    async getStats(req, res) {
        try {
            const { id } = req.params;
            
            const proyecto = await db.getAsync(
                `SELECT * FROM proyectos WHERE id = ? AND manager_id = ?`,
                [id, req.user.id]
            );
            
            if (!proyecto) {
                return res.status(404).json({ error: 'Proyecto no encontrado' });
            }
            
            const tareas = await db.allAsync(
                'SELECT * FROM tareas WHERE proyecto_id = ?',
                [id]
            );
            
            const tareasCompletadas = tareas.filter(t => t.estado === 'completada').length;
            const progreso = tareas.length > 0 ? Math.round((tareasCompletadas / tareas.length) * 100) : 0;
            
            res.json({
                proyecto,
                estadisticas: {
                    totalTareas: tareas.length,
                    tareasCompletadas,
                    tareasPendientes: tareas.length - tareasCompletadas,
                    progreso
                }
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = proyectosController;
