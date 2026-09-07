// Rutas de tareas

const express = require('express');
const router = express.Router();
const tareasController = require('../controllers/tareasController');
const authMiddleware = require('../middleware/authMiddleware');

// POST /api/tareas
router.post('/', authMiddleware, tareasController.create);

// GET /api/tareas
router.get('/', authMiddleware, tareasController.getAll);

// GET /api/tareas/proyecto/:proyectoId
router.get('/proyecto/:proyectoId', authMiddleware, tareasController.getByProyecto);

// GET /api/tareas/:id
router.get('/:id', authMiddleware, tareasController.getById);

// PUT /api/tareas/:id
router.put('/:id', authMiddleware, tareasController.update);

// DELETE /api/tareas/:id
router.delete('/:id', authMiddleware, tareasController.delete);

// POST /api/tareas/:id/comentarios
router.post('/:id/comentarios', authMiddleware, tareasController.addComentario);

module.exports = router;
