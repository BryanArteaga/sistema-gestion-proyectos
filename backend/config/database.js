// Configuración de la base de datos SQLite

const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dbPath = process.env.DB_PATH || './database/proyectos.db';

// Crear directorio si no existe
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
}

// Crear conexión
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error al conectar a la base de datos:', err.message);
    } else {
        console.log('✓ Conectado a SQLite');
        initializeDatabase();
    }
});

// Inicializar tablas
function initializeDatabase() {
    db.serialize(() => {
        // Tabla de usuarios
        db.run(`
            CREATE TABLE IF NOT EXISTS usuarios (
                id TEXT PRIMARY KEY,
                nombre TEXT NOT NULL,
                email TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL,
                fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);
        
        // Tabla de proyectos
        db.run(`
            CREATE TABLE IF NOT EXISTS proyectos (
                id TEXT PRIMARY KEY,
                nombre TEXT NOT NULL,
                descripcion TEXT,
                fecha_inicio DATE,
                fecha_fin DATE,
                presupuesto DECIMAL(10, 2),
                estado TEXT DEFAULT 'activo',
                progreso INTEGER DEFAULT 0,
                manager_id TEXT NOT NULL,
                fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (manager_id) REFERENCES usuarios(id)
            )
        `);
        
        // Tabla de tareas
        db.run(`
            CREATE TABLE IF NOT EXISTS tareas (
                id TEXT PRIMARY KEY,
                nombre TEXT NOT NULL,
                descripcion TEXT,
                proyecto_id TEXT NOT NULL,
                asignado_a TEXT NOT NULL,
                prioridad TEXT DEFAULT 'media',
                fecha_limite DATE,
                estado TEXT DEFAULT 'por hacer',
                progreso INTEGER DEFAULT 0,
                fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (proyecto_id) REFERENCES proyectos(id),
                FOREIGN KEY (asignado_a) REFERENCES usuarios(id)
            )
        `);
        
        // Tabla de comentarios
        db.run(`
            CREATE TABLE IF NOT EXISTS comentarios (
                id TEXT PRIMARY KEY,
                contenido TEXT NOT NULL,
                tarea_id TEXT NOT NULL,
                usuario_id TEXT NOT NULL,
                fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (tarea_id) REFERENCES tareas(id),
                FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
            )
        `);
        
        console.log('✓ Tablas inicializadas');
    });
}

// Wrapper para promesas
db.runAsync = function(sql, params = []) {
    return new Promise((resolve, reject) => {
        this.run(sql, params, function(err) {
            if (err) reject(err);
            else resolve({ lastID: this.lastID, changes: this.changes });
        });
    });
};

db.getAsync = function(sql, params = []) {
    return new Promise((resolve, reject) => {
        this.get(sql, params, (err, row) => {
            if (err) reject(err);
            else resolve(row);
        });
    });
};

db.allAsync = function(sql, params = []) {
    return new Promise((resolve, reject) => {
        this.all(sql, params, (err, rows) => {
            if (err) reject(err);
            else resolve(rows || []);
        });
    });
};

module.exports = db;
