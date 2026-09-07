// Rutas de autenticación

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

// POST /api/auth/register
router.post('/register', authController.register);

// POST /api/auth/login
router.post('/login', authController.login);

// GET /api/auth/perfil
router.get('/perfil', authMiddleware, authController.getPerfil);

module.exports = router;
