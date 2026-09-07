// Gestión de proyectos

const Proyectos = {
    lista: [],
    
    init() {
        this.lista = Storage.get('proyectos') || [];
    },
    
    crear(nombre, descripcion, fechaInicio, fechaFin, presupuesto) {
        const proyecto = {
            id: IDGenerator.generate(),
            nombre,
            descripcion,
            fechaInicio,
            fechaFin,
            presupuesto,
            estado: 'activo',
            progreso: 0,
            manager: Auth.getCurrentUser().id,
            fechaCreacion: new Date().toISOString()
        };
        
        this.lista.push(proyecto);
        Storage.set('proyectos', this.lista);
        Notification.success('Proyecto creado exitosamente');
        return proyecto;
    },
    
    obtener(id) {
        return this.lista.find(p => p.id === id);
    },
    
    obtenerPorUsuario(usuarioId) {
        return this.lista.filter(p => p.manager === usuarioId || p.equipo?.includes(usuarioId));
    },
    
    actualizar(id, datos) {
        const index = this.lista.findIndex(p => p.id === id);
        if (index !== -1) {
            this.lista[index] = { ...this.lista[index], ...datos };
            Storage.set('proyectos', this.lista);
            Notification.success('Proyecto actualizado');
            return this.lista[index];
        }
    },
    
    eliminar(id) {
        this.lista = this.lista.filter(p => p.id !== id);
        Storage.set('proyectos', this.lista);
        // Eliminar también las tareas del proyecto
        Tareas.lista = Tareas.lista.filter(t => t.proyectoId !== id);
        Storage.set('tareas', Tareas.lista);
        Notification.success('Proyecto eliminado');
    },
    
    obtenerActivos() {
        return this.lista.filter(p => p.estado === 'activo');
    },
    
    calcularProgreso(proyectoId) {
        const tareas = Tareas.lista.filter(t => t.proyectoId === proyectoId);
        if (tareas.length === 0) return 0;
        
        const completadas = tareas.filter(t => t.estado === 'completada').length;
        return Math.round((completadas / tareas.length) * 100);
    },
    
    obtenerTodos() {
        return this.lista;
    }
};

// Renderizar lista de proyectos
function renderProyectos() {
    const currentUser = Auth.getCurrentUser();
    const proyectos = Proyectos.obtenerPorUsuario(currentUser.id);
    
    const content = document.getElementById('proyectos-section');
    
    let html = `
        <div class="proyectos-header">
            <h1>Mis Proyectos</h1>
            <button class="btn btn-primary" onclick="openProyectoModal()">+ Nuevo Proyecto</button>
        </div>
        
        <div class="proyectos-container">
    `;
    
    if (proyectos.length === 0) {
        html += '<p class="empty-message">No tienes proyectos aún. Crea uno nuevo para comenzar.</p>';
    } else {
        proyectos.forEach(proyecto => {
            const progreso = Proyectos.calcularProgreso(proyecto.id);
            const diasRestantes = DateUtils.daysUntil(proyecto.fechaFin);
            const estado = diasRestantes < 0 ? 'Vencido' : `${diasRestantes} días`;
            
            html += `
                <div class="card proyecto-card">
                    <div class="proyecto-header">
                        <h3>${proyecto.nombre}</h3>
                        <span class="badge badge-primary">${proyecto.estado}</span>
                    </div>
                    <p class="proyecto-descripcion">${proyecto.descripcion}</p>
                    <div class="proyecto-info">
                        <div class="info-item">
                            <span class="label">Fecha Fin:</span>
                            <span>${DateUtils.format(proyecto.fechaFin)}</span>
                        </div>
                        <div class="info-item">
                            <span class="label">Presupuesto:</span>
                            <span>$${proyecto.presupuesto}</span>
                        </div>
                    </div>
                    <div class="progreso-bar">
                        <div class="progreso-fill" style="width: ${progreso}%"></div>
                    </div>
                    <p class="progreso-texto">${progreso}% completado</p>
                    <div class="proyecto-acciones">
                        <button class="btn btn-small btn-secondary" onclick="editarProyecto('${proyecto.id}')">Editar</button>
                        <button class="btn btn-small btn-danger" onclick="eliminarProyecto('${proyecto.id}')">Eliminar</button>
                        <button class="btn btn-small btn-primary" onclick="verTareasProyecto('${proyecto.id}')">Ver Tareas</button>
                    </div>
                </div>
            `;
        });
    }
    
    html += '</div>';
    content.innerHTML = html;
}

// Modal para crear/editar proyecto
function openProyectoModal(proyectoId = null) {
    let proyecto = null;
    let titulo = 'Nuevo Proyecto';
    
    if (proyectoId) {
        proyecto = Proyectos.obtener(proyectoId);
        titulo = 'Editar Proyecto';
    }
    
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>${titulo}</h2>
                <button class="modal-close" onclick="this.closest('.modal').remove()">×</button>
            </div>
            <form onsubmit="guardarProyecto(event, '${proyectoId || 'nuevo'}')">
                <div class="form-group">
                    <label for="nombreProyecto">Nombre del Proyecto</label>
                    <input type="text" id="nombreProyecto" placeholder="Nombre" value="${proyecto?.nombre || ''}" required>
                </div>
                <div class="form-group">
                    <label for="descripcionProyecto">Descripción</label>
                    <textarea id="descripcionProyecto" placeholder="Descripción del proyecto">${proyecto?.descripcion || ''}</textarea>
                </div>
                <div class="form-group">
                    <label for="fechaInicioProyecto">Fecha de Inicio</label>
                    <input type="date" id="fechaInicioProyecto" value="${proyecto?.fechaInicio || ''}" required>
                </div>
                <div class="form-group">
                    <label for="fechaFinProyecto">Fecha de Fin</label>
                    <input type="date" id="fechaFinProyecto" value="${proyecto?.fechaFin || ''}" required>
                </div>
                <div class="form-group">
                    <label for="presupuestoProyecto">Presupuesto</label>
                    <input type="number" id="presupuestoProyecto" placeholder="0.00" value="${proyecto?.presupuesto || ''}" required>
                </div>
                <div class="modal-actions">
                    <button type="button" class="btn btn-secondary" onclick="this.closest('.modal').remove()">Cancelar</button>
                    <button type="submit" class="btn btn-primary">Guardar</button>
                </div>
            </form>
        </div>
    `;
    
    document.body.appendChild(modal);
    modal.onclick = (e) => {
        if (e.target === modal) modal.remove();
    };
}

function guardarProyecto(event, proyectoId) {
    event.preventDefault();
    
    const nombre = document.getElementById('nombreProyecto').value;
    const descripcion = document.getElementById('descripcionProyecto').value;
    const fechaInicio = document.getElementById('fechaInicioProyecto').value;
    const fechaFin = document.getElementById('fechaFinProyecto').value;
    const presupuesto = document.getElementById('presupuestoProyecto').value;
    
    if (proyectoId === 'nuevo') {
        Proyectos.crear(nombre, descripcion, fechaInicio, fechaFin, presupuesto);
    } else {
        Proyectos.actualizar(proyectoId, {
            nombre,
            descripcion,
            fechaInicio,
            fechaFin,
            presupuesto
        });
    }
    
    document.querySelector('.modal').remove();
    renderProyectos();
}

function editarProyecto(proyectoId) {
    openProyectoModal(proyectoId);
}

function eliminarProyecto(proyectoId) {
    if (confirm('¿Estás seguro de que deseas eliminar este proyecto?')) {
        Proyectos.eliminar(proyectoId);
        renderProyectos();
    }
}

function verTareasProyecto(proyectoId) {
    sessionStorage.setItem('proyectoFiltro', proyectoId);
    showPage('tareas');
}
