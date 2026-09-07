// Rutas de proyectos

const express = require('express');
const router = express.Router();
const proyectosController = require('../controllers/proyectosController');
const authMiddleware = require('../middleware/authMiddleware');

// POST /api/proyectos
router.post('/', authMiddleware, proyectosController.create);

// GET /api/proyectos
router.get('/', authMiddleware, proyectosController.getAll);

// GET /api/proyectos/:id
router.get('/:id', authMiddleware, proyectosController.getById);

// PUT /api/proyectos/:id
router.put('/:id', authMiddleware, proyectosController.update);

// DELETE /api/proyectos/:id
router.delete('/:id', authMiddleware, proyectosController.delete);

// GET /api/proyectos/:id/stats
router.get('/:id/stats', authMiddleware, proyectosController.getStats);

module.exports = router;
