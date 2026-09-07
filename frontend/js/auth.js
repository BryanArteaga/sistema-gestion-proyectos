// Gestión de autenticación

const Auth = {
    currentUser: null,
    
    init() {
        this.currentUser = Storage.get('currentUser');
        if (this.currentUser) {
            this.redirectToDashboard();
        }
    },
    
    login(email, password) {
        if (!Validators.email(email)) {
            Notification.error('Por favor ingresa un email válido');
            return false;
        }
        if (!Validators.password(password)) {
            Notification.error('La contraseña debe tener al menos 6 caracteres');
            return false;
        }
        
        // Simulación de login - en producción sería una llamada API
        const users = Storage.get('users') || [];
        const user = users.find(u => u.email === email && u.password === password);
        
        if (user) {
            this.currentUser = user;
            Storage.set('currentUser', user);
            Notification.success('¡Bienvenido ' + user.nombre + '!');
            return true;
        } else {
            Notification.error('Email o contraseña incorrectos');
            return false;
        }
    },
    
    register(nombre, email, password, confirmPassword) {
        if (!Validators.required(nombre)) {
            Notification.error('Por favor ingresa tu nombre');
            return false;
        }
        if (!Validators.email(email)) {
            Notification.error('Por favor ingresa un email válido');
            return false;
        }
        if (!Validators.password(password)) {
            Notification.error('La contraseña debe tener al menos 6 caracteres');
            return false;
        }
        if (password !== confirmPassword) {
            Notification.error('Las contraseñas no coinciden');
            return false;
        }
        
        const users = Storage.get('users') || [];
        if (users.find(u => u.email === email)) {
            Notification.error('Este email ya está registrado');
            return false;
        }
        
        const newUser = {
            id: IDGenerator.generate(),
            nombre,
            email,
            password,
            fechaRegistro: new Date().toISOString()
        };
        
        users.push(newUser);
        Storage.set('users', users);
        
        this.currentUser = newUser;
        Storage.set('currentUser', newUser);
        Notification.success('¡Registro exitoso!');
        return true;
    },
    
    logout() {
        this.currentUser = null;
        Storage.remove('currentUser');
        Notification.success('Sesión cerrada');
        setTimeout(() => {
            location.reload();
        }, 500);
    },
    
    getCurrentUser() {
        return this.currentUser;
    },
    
    isLogged() {
        return this.currentUser !== null;
    },
    
    redirectToDashboard() {
        setTimeout(() => {
            showPage('dashboard');
        }, 100);
    }
};

// Manejador de formulario de login
function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    if (Auth.login(email, password)) {
        Auth.redirectToDashboard();
    }
}

// Función para cambiar entre login y registro
function toggleAuthMode() {
    const loginCard = document.querySelector('.login-card');
    const isLogin = loginCard.querySelector('#loginForm');
    
    if (isLogin) {
        // Cambiar a registro
        loginCard.querySelector('.subtitle').textContent = 'Crea tu cuenta';
        loginCard.querySelector('.toggle-text').innerHTML = '¿Ya tienes cuenta? <a href="#" onclick="toggleAuthMode()">Inicia sesión aquí</a>';
        
        const form = document.getElementById('loginForm');
        form.innerHTML = `
            <div class="form-group">
                <label for="nombre">Nombre</label>
                <input type="text" id="nombre" placeholder="Tu nombre" required>
            </div>
            <div class="form-group">
                <label for="registerEmail">Email</label>
                <input type="email" id="registerEmail" placeholder="correo@ejemplo.com" required>
            </div>
            <div class="form-group">
                <label for="registerPassword">Contraseña</label>
                <input type="password" id="registerPassword" placeholder="Mínimo 6 caracteres" required>
            </div>
            <div class="form-group">
                <label for="confirmPassword">Confirmar Contraseña</label>
                <input type="password" id="confirmPassword" placeholder="Repite tu contraseña" required>
            </div>
            <button type="submit" class="btn-primary">Registrarse</button>
        `;
        form.onsubmit = handleRegister;
    } else {
        // Cambiar a login
        loginCard.querySelector('.subtitle').textContent = 'Bienvenido al sistema';
        loginCard.querySelector('.toggle-text').innerHTML = '¿No tienes cuenta? <a href="#" onclick="toggleAuthMode()">Regístrate aquí</a>';
        
        const form = loginCard.querySelector('form');
        form.innerHTML = `
            <div class="form-group">
                <label for="email">Email</label>
                <input type="email" id="email" placeholder="correo@ejemplo.com" required>
            </div>
            <div class="form-group">
                <label for="password">Contraseña</label>
                <input type="password" id="password" placeholder="Tu contraseña" required>
            </div>
            <button type="submit" class="btn-primary">Iniciar Sesión</button>
        `;
        form.onsubmit = handleLogin;
    }
}

function handleRegister(e) {
    e.preventDefault();
    
    const nombre = document.getElementById('nombre').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    if (Auth.register(nombre, email, password, confirmPassword)) {
        Auth.redirectToDashboard();
    }
}

function logout() {
    if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
        Auth.logout();
    }
}
