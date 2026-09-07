// Funciones de utilidad generales

// Almacenamiento local
const Storage = {
    set(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    },
    get(key) {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
    },
    remove(key) {
        localStorage.removeItem(key);
    },
    clear() {
        localStorage.clear();
    }
};

// Validaciones
const Validators = {
    email(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    },
    password(password) {
        return password.length >= 6;
    },
    required(value) {
        return value && value.trim() !== '';
    }
};

// Notificaciones
const Notification = {
    show(message, type = 'success') {
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type}`;
        alertDiv.textContent = message;
        alertDiv.style.position = 'fixed';
        alertDiv.style.top = '20px';
        alertDiv.style.right = '20px';
        alertDiv.style.zIndex = '9999';
        alertDiv.style.maxWidth = '400px';
        
        document.body.appendChild(alertDiv);
        
        setTimeout(() => {
            alertDiv.remove();
        }, 3000);
    },
    success(message) {
        this.show(message, 'success');
    },
    error(message) {
        this.show(message, 'error');
    },
    warning(message) {
        this.show(message, 'warning');
    }
};

// Formateo de fechas
const DateUtils = {
    format(date, format = 'DD/MM/YYYY') {
        if (typeof date === 'string') date = new Date(date);
        
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        
        return format
            .replace('DD', day)
            .replace('MM', month)
            .replace('YYYY', year);
    },
    daysUntil(date) {
        if (typeof date === 'string') date = new Date(date);
        const today = new Date();
        const diffTime = date - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    },
    isExpired(date) {
        return this.daysUntil(date) < 0;
    }
};

// Generador de IDs únicos
const IDGenerator = {
    generate() {
        return '_' + Math.random().toString(36).substr(2, 9);
    }
};

// Colores por prioridad
const PriorityColors = {
    alta: '#e74c3c',
    media: '#f39c12',
    baja: '#27ae60'
};

// Funciones DOM
const DOM = {
    querySelector: (selector) => document.querySelector(selector),
    querySelectorAll: (selector) => document.querySelectorAll(selector),
    getElementById: (id) => document.getElementById(id),
    createElement: (tag) => document.createElement(tag),
    addClass: (element, className) => element.classList.add(className),
    removeClass: (element, className) => element.classList.remove(className),
    toggleClass: (element, className) => element.classList.toggle(className)
};
