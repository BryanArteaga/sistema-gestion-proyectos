// Controlador de autenticación

const db = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const generateId = () => '_' + Math.random().toString(36).substr(2, 9);

const authController = {
    // Registro
    async register(req, res) {
        try {
            const { nombre, email, password } = req.body;
            
            if (!nombre || !email || !password) {
                return res.status(400).json({ error: 'Faltan campos requeridos' });
            }
            
            if (password.length < 6) {
                return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres' });
            }
            
            // Verificar si el email ya existe
            const usuarioExistente = await db.getAsync(
                'SELECT * FROM usuarios WHERE email = ?',
                [email]
            );
            
            if (usuarioExistente) {
                return res.status(400).json({ error: 'El email ya está registrado' });
            }
            
            // Hashear contraseña
            const hashedPassword = await bcrypt.hash(password, 10);
            
            // Crear usuario
            const usuarioId = generateId();
            await db.runAsync(
                `INSERT INTO usuarios (id, nombre, email, password)
                 VALUES (?, ?, ?, ?)`,
                [usuarioId, nombre, email, hashedPassword]
            );
            
            // Generar token
            const token = jwt.sign(
                { id: usuarioId, email },
                process.env.JWT_SECRET,
                { expiresIn: '7d' }
            );
            
            res.status(201).json({
                mensaje: 'Usuario registrado exitosamente',
                usuario: { id: usuarioId, nombre, email },
                token
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    
    // Login
    async login(req, res) {
        try {
            const { email, password } = req.body;
            
            if (!email || !password) {
                return res.status(400).json({ error: 'Email y contraseña requeridos' });
            }
            
            const usuario = await db.getAsync(
                'SELECT * FROM usuarios WHERE email = ?',
                [email]
            );
            
            if (!usuario) {
                return res.status(401).json({ error: 'Credenciales inválidas' });
            }
            
            const passwordValida = await bcrypt.compare(password, usuario.password);
            
            if (!passwordValida) {
                return res.status(401).json({ error: 'Credenciales inválidas' });
            }
            
            const token = jwt.sign(
                { id: usuario.id, email: usuario.email },
                process.env.JWT_SECRET,
                { expiresIn: '7d' }
            );
            
            res.json({
                mensaje: 'Login exitoso',
                usuario: {
                    id: usuario.id,
                    nombre: usuario.nombre,
                    email: usuario.email
                },
                token
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    
    // Obtener perfil
    async getPerfil(req, res) {
        try {
            const usuario = await db.getAsync(
                'SELECT id, nombre, email, fecha_registro FROM usuarios WHERE id = ?',
                [req.user.id]
            );
            
            if (!usuario) {
                return res.status(404).json({ error: 'Usuario no encontrado' });
            }
            
            res.json(usuario);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = authController;
