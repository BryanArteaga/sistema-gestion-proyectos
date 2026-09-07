// Aplicación principal

function init() {
    // Inicializar módulos
    Auth.init();
    Proyectos.init();
    Tareas.init();
    
    // Si no hay usuario logueado, mostrar login
    if (!Auth.isLogged()) {
        showLoginPage();
    } else {
        updateDashboardStats();
        showPage('dashboard');
    }
}

function showLoginPage() {
    const app = document.getElementById('app');
    fetch('pages/login.html')
        .then(response => response.text())
        .then(html => {
            app.innerHTML = html;
            document.getElementById('loginForm').onsubmit = handleLogin;
        })
        .catch(() => {
            // Si no puede cargar el archivo, mostrar HTML inline
            app.innerHTML = document.querySelector('[data-login-template]')?.innerHTML || '';
        });
}

function showPage(page) {
    const app = document.getElementById('app');
    
    if (page === 'dashboard') {
        fetch('pages/dashboard.html')
            .then(response => response.text())
            .then(html => {
                app.innerHTML = html;
                updateDashboardStats();
            })
            .catch(() => renderDashboard());
    }
}

function updateDashboardStats() {
    const currentUser = Auth.getCurrentUser();
    const proyectos = Proyectos.obtenerPorUsuario(currentUser.id);
    const tareas = Tareas.obtenerPorUsuario(currentUser.id);
    const tareasCompletadas = tareas.filter(t => t.estado === 'completada').length;
    
    // Actualizar información del usuario
    const userName = document.getElementById('userName');
    const userEmail = document.getElementById('userEmail');
    if (userName && userEmail) {
        userName.textContent = currentUser.nombre;
        userEmail.textContent = currentUser.email;
    }
    
    // Actualizar estadísticas
    const activeProjects = document.getElementById('activeProjects');
    const pendingTasks = document.getElementById('pendingTasks');
    const generalProgress = document.getElementById('generalProgress');
    
    if (activeProjects) activeProjects.textContent = proyectos.length;
    if (pendingTasks) pendingTasks.textContent = tareas.filter(t => t.estado !== 'completada').length;
    
    if (generalProgress) {
        const progreso = tareas.length > 0 ? Math.round((tareasCompletadas / tareas.length) * 100) : 0;
        generalProgress.textContent = progreso + '%';
    }
    
    // Proyectos recientes
    const recentProjects = document.getElementById('recentProjects');
    if (recentProjects) {
        if (proyectos.length === 0) {
            recentProjects.innerHTML = '<p class="empty-message">No hay proyectos</p>';
        } else {
            recentProjects.innerHTML = proyectos.slice(0, 3).map(p => `
                <div class="project-item">
                    <h4>${p.nombre}</h4>
                    <p>${DateUtils.format(p.fechaFin)}</p>
                </div>
            `).join('');
        }
    }
    
    // Tareas próximas
    const upcomingTasks = document.getElementById('upcomingTasks');
    if (upcomingTasks) {
        const proximas = tareas.filter(t => t.estado !== 'completada').sort((a, b) => 
            new Date(a.fechaLimite) - new Date(b.fechaLimite)
        ).slice(0, 5);
        
        if (proximas.length === 0) {
            upcomingTasks.innerHTML = '<p class="empty-message">Sin tareas próximas</p>';
        } else {
            upcomingTasks.innerHTML = proximas.map(t => `
                <div class="task-item">
                    <h4>${t.nombre}</h4>
                    <p>${DateUtils.format(t.fechaLimite)}</p>
                </div>
            `).join('');
        }
    }
}

function showPage(page) {
    // Ocultar todas las secciones
    const sections = document.querySelectorAll('.content-section, .dashboard-section');
    sections.forEach(s => s.style.display = 'none');
    
    // Mostrar la sección correspondiente
    if (page === 'dashboard') {
        const dashboard = document.querySelector('.dashboard-section');
        if (dashboard) dashboard.style.display = 'block';
        updateDashboardStats();
    } else if (page === 'proyectos') {
        sessionStorage.removeItem('proyectoFiltro');
        const section = document.getElementById('proyectos-section');
        if (section) {
            section.style.display = 'block';
            renderProyectos();
        } else {
            // Crear sección si no existe
            const main = document.querySelector('.main-content');
            if (main) {
                const newSection = document.createElement('section');
                newSection.id = 'proyectos-section';
                newSection.className = 'content-section';
                main.appendChild(newSection);
                renderProyectos();
            }
        }
    } else if (page === 'tareas') {
        const section = document.getElementById('tareas-section');
        if (section) {
            section.style.display = 'block';
            renderTareas();
        } else {
            const main = document.querySelector('.main-content');
            if (main) {
                const newSection = document.createElement('section');
                newSection.id = 'tareas-section';
                newSection.className = 'content-section';
                main.appendChild(newSection);
                renderTareas();
            }
        }
    }
}

// Estilos adicionales
const additionalStyles = `
    .proyectos-header, .tareas-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 30px;
    }
    
    .proyectos-container, .tareas-container {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
        gap: 20px;
    }
    
    .proyecto-card, .tarea-card {
        transition: transform 0.3s, box-shadow 0.3s;
    }
    
    .proyecto-card:hover, .tarea-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
    }
    
    .proyecto-header, .tarea-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    
    .proyecto-descripcion, .tarea-descripcion {
        color: #666;
        font-size: 14px;
        margin: 10px 0;
    }
    
    .proyecto-info {
        display: flex;
        flex-direction: column;
        gap: 8px;
        margin: 15px 0;
        font-size: 13px;
    }
    
    .info-item {
        display: flex;
        justify-content: space-between;
    }
    
    .info-item .label {
        font-weight: 600;
        color: #333;
    }
    
    .progreso-bar {
        width: 100%;
        height: 8px;
        background-color: #ecf0f1;
        border-radius: 4px;
        overflow: hidden;
        margin: 10px 0;
    }
    
    .progreso-fill {
        height: 100%;
        background-color: #667eea;
        transition: width 0.3s;
    }
    
    .progreso-texto {
        font-size: 12px;
        color: #999;
        margin: 5px 0;
    }
    
    .proyecto-acciones, .tarea-acciones {
        display: flex;
        gap: 8px;
        margin-top: 15px;
        flex-wrap: wrap;
    }
    
    .modal-actions {
        display: flex;
        gap: 10px;
        justify-content: flex-end;
        margin-top: 20px;
    }
    
    .tareas-filters {
        display: flex;
        gap: 10px;
        margin-bottom: 20px;
    }
    
    .filter-btn {
        padding: 8px 16px;
        border: 1px solid #ddd;
        border-radius: 20px;
        background: white;
        cursor: pointer;
        transition: all 0.3s;
        font-size: 13px;
    }
    
    .filter-btn.active {
        background: #667eea;
        color: white;
        border-color: #667eea;
    }
    
    .filter-btn:hover {
        border-color: #667eea;
    }
    
    .project-item, .task-item {
        padding: 10px 0;
        border-bottom: 1px solid #ecf0f1;
    }
    
    .project-item:last-child, .task-item:last-child {
        border-bottom: none;
    }
    
    .project-item h4, .task-item h4 {
        margin: 0 0 5px 0;
        font-size: 14px;
    }
    
    .project-item p, .task-item p {
        margin: 0;
        font-size: 12px;
        color: #999;
    }
`;

if (!document.querySelector('style[data-app]')) {
    const styleTag = document.createElement('style');
    styleTag.setAttribute('data-app', 'true');
    styleTag.textContent = additionalStyles;
    document.head.appendChild(styleTag);
}

// Inicializar cuando el documento esté listo
document.addEventListener('DOMContentLoaded', init);
