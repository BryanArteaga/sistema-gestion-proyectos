// Gestión de tareas

const Tareas = {
    lista: [],
    
    init() {
        this.lista = Storage.get('tareas') || [];
    },
    
    crear(nombre, descripcion, proyectoId, asignadoA, prioridad, fechaLimite) {
        const tarea = {
            id: IDGenerator.generate(),
            nombre,
            descripcion,
            proyectoId,
            asignadoA,
            prioridad,
            fechaLimite,
            estado: 'por hacer',
            progreso: 0,
            comentarios: [],
            fechaCreacion: new Date().toISOString()
        };
        
        this.lista.push(tarea);
        Storage.set('tareas', this.lista);
        Notification.success('Tarea creada exitosamente');
        return tarea;
    },
    
    obtener(id) {
        return this.lista.find(t => t.id === id);
    },
    
    obtenerPorProyecto(proyectoId) {
        return this.lista.filter(t => t.proyectoId === proyectoId);
    },
    
    obtenerPorUsuario(usuarioId) {
        return this.lista.filter(t => t.asignadoA === usuarioId);
    },
    
    actualizar(id, datos) {
        const index = this.lista.findIndex(t => t.id === id);
        if (index !== -1) {
            this.lista[index] = { ...this.lista[index], ...datos };
            Storage.set('tareas', this.lista);
            Notification.success('Tarea actualizada');
            return this.lista[index];
        }
    },
    
    eliminar(id) {
        this.lista = this.lista.filter(t => t.id !== id);
        Storage.set('tareas', this.lista);
        Notification.success('Tarea eliminada');
    },
    
    agregarComentario(tareaId, contenido) {
        const tarea = this.obtener(tareaId);
        if (tarea) {
            const comentario = {
                id: IDGenerator.generate(),
                contenido,
                usuario: Auth.getCurrentUser().nombre,
                fecha: new Date().toISOString()
            };
            tarea.comentarios.push(comentario);
            this.actualizar(tareaId, { comentarios: tarea.comentarios });
        }
    },
    
    obtenerPendientes() {
        return this.lista.filter(t => t.estado !== 'completada');
    },
    
    obtenerPorFecha(fecha) {
        return this.lista.filter(t => t.fechaLimite === fecha);
    }
};

// Renderizar lista de tareas
function renderTareas() {
    const currentUser = Auth.getCurrentUser();
    const filtroProyecto = sessionStorage.getItem('proyectoFiltro');
    
    let tareas;
    let titulo = 'Mis Tareas';
    
    if (filtroProyecto) {
        tareas = Tareas.obtenerPorProyecto(filtroProyecto);
        const proyecto = Proyectos.obtener(filtroProyecto);
        titulo = `Tareas de ${proyecto?.nombre || 'Proyecto'}`;
    } else {
        tareas = Tareas.obtenerPorUsuario(currentUser.id);
    }
    
    const content = document.getElementById('tareas-section');
    
    let html = `
        <div class="tareas-header">
            <h1>${titulo}</h1>
            <button class="btn btn-primary" onclick="openTareaModal()">+ Nueva Tarea</button>
        </div>
        
        <div class="tareas-filters">
            <button class="filter-btn active" onclick="filtrarTareas('todas')">Todas</button>
            <button class="filter-btn" onclick="filtrarTareas('por hacer')">Por hacer</button>
            <button class="filter-btn" onclick="filtrarTareas('en progreso')">En progreso</button>
            <button class="filter-btn" onclick="filtrarTareas('completada')">Completadas</button>
        </div>
        
        <div class="tareas-container">
    `;
    
    if (tareas.length === 0) {
        html += '<p class="empty-message">No hay tareas. Crea una nueva para comenzar.</p>';
    } else {
        tareas.forEach(tarea => {
            const colorPrioridad = PriorityColors[tarea.prioridad] || '#95a5a6';
            const diasRestantes = DateUtils.daysUntil(tarea.fechaLimite);
            
            html += `
                <div class="card tarea-card">
                    <div class="tarea-header">
                        <h4>${tarea.nombre}</h4>
                        <span class="badge" style="background-color: ${colorPrioridad}20; color: ${colorPrioridad}">
                            ${tarea.prioridad}
                        </span>
                    </div>
                    <p class="tarea-descripcion">${tarea.descripcion}</p>
                    <div class="tarea-meta">
                        <span class="meta-item">
                            <strong>Estado:</strong> ${tarea.estado}
                        </span>
                        <span class="meta-item">
                            <strong>Vencimiento:</strong> ${DateUtils.format(tarea.fechaLimite)}
                        </span>
                        <span class="meta-item" style="${diasRestantes < 0 ? 'color: #e74c3c;' : ''}">
                            <strong>Días:</strong> ${diasRestantes < 0 ? 'Vencido' : diasRestantes}
                        </span>
                    </div>
                    <div class="progreso-bar">
                        <div class="progreso-fill" style="width: ${tarea.progreso}%; background-color: ${colorPrioridad}"></div>
                    </div>
                    <div class="tarea-acciones">
                        <button class="btn btn-small btn-secondary" onclick="editarTarea('${tarea.id}')">Editar</button>
                        <button class="btn btn-small btn-success" onclick="cambiarEstado('${tarea.id}')">
                            ${tarea.estado === 'completada' ? 'Reabrir' : 'Completar'}
                        </button>
                        <button class="btn btn-small btn-danger" onclick="eliminarTarea('${tarea.id}')">Eliminar</button>
                        <button class="btn btn-small btn-primary" onclick="verDetallesTarea('${tarea.id}')">Detalles</button>
                    </div>
                </div>
            `;
        });
    }
    
    html += '</div>';
    content.innerHTML = html;
}

// Modal para crear/editar tarea
function openTareaModal(tareaId = null) {
    let tarea = null;
    let titulo = 'Nueva Tarea';
    const filtroProyecto = sessionStorage.getItem('proyectoFiltro');
    
    if (tareaId) {
        tarea = Tareas.obtener(tareaId);
        titulo = 'Editar Tarea';
    }
    
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>${titulo}</h2>
                <button class="modal-close" onclick="this.closest('.modal').remove()">×</button>
            </div>
            <form onsubmit="guardarTarea(event, '${tareaId || 'nuevo'}')">
                <div class="form-group">
                    <label for="nombreTarea">Nombre de la Tarea</label>
                    <input type="text" id="nombreTarea" placeholder="Nombre" value="${tarea?.nombre || ''}" required>
                </div>
                <div class="form-group">
                    <label for="descripcionTarea">Descripción</label>
                    <textarea id="descripcionTarea" placeholder="Descripción de la tarea">${tarea?.descripcion || ''}</textarea>
                </div>
                <div class="form-group">
                    <label for="proyectoTarea">Proyecto</label>
                    <select id="proyectoTarea" required>
                        <option value="">Selecciona un proyecto</option>
                        ${Proyectos.obtenerActivos().map(p => `
                            <option value="${p.id}" ${(tarea?.proyectoId === p.id || filtroProyecto === p.id) ? 'selected' : ''}>
                                ${p.nombre}
                            </option>
                        `).join('')}
                    </select>
                </div>
                <div class="form-group">
                    <label for="prioridadTarea">Prioridad</label>
                    <select id="prioridadTarea" required>
                        <option value="baja" ${tarea?.prioridad === 'baja' ? 'selected' : ''}>Baja</option>
                        <option value="media" ${tarea?.prioridad === 'media' ? 'selected' : ''}>Media</option>
                        <option value="alta" ${tarea?.prioridad === 'alta' ? 'selected' : ''}>Alta</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="fechaLimiteTarea">Fecha Límite</label>
                    <input type="date" id="fechaLimiteTarea" value="${tarea?.fechaLimite || ''}" required>
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

function guardarTarea(event, tareaId) {
    event.preventDefault();
    
    const nombre = document.getElementById('nombreTarea').value;
    const descripcion = document.getElementById('descripcionTarea').value;
    const proyectoId = document.getElementById('proyectoTarea').value;
    const prioridad = document.getElementById('prioridadTarea').value;
    const fechaLimite = document.getElementById('fechaLimiteTarea').value;
    const usuarioActual = Auth.getCurrentUser().id;
    
    if (tareaId === 'nuevo') {
        Tareas.crear(nombre, descripcion, proyectoId, usuarioActual, prioridad, fechaLimite);
    } else {
        Tareas.actualizar(tareaId, {
            nombre,
            descripcion,
            proyectoId,
            prioridad,
            fechaLimite
        });
    }
    
    document.querySelector('.modal').remove();
    renderTareas();
}

function editarTarea(tareaId) {
    openTareaModal(tareaId);
}

function eliminarTarea(tareaId) {
    if (confirm('¿Estás seguro de que deseas eliminar esta tarea?')) {
        Tareas.eliminar(tareaId);
        renderTareas();
    }
}

function cambiarEstado(tareaId) {
    const tarea = Tareas.obtener(tareaId);
    const nuevoEstado = tarea.estado === 'completada' ? 'por hacer' : 'completada';
    Tareas.actualizar(tareaId, { estado: nuevoEstado });
    renderTareas();
}

function filtrarTareas(estado) {
    // Implementar filtro
    renderTareas();
}

function verDetallesTarea(tareaId) {
    const tarea = Tareas.obtener(tareaId);
    alert(`Tarea: ${tarea.nombre}\nEstado: ${tarea.estado}\nProgreso: ${tarea.progreso}%`);
}

// Estilos adicionales para tareas
const styles = `
    .tarea-card {
        border-left: 4px solid #667eea;
    }
    
    .tarea-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
    }
    
    .tarea-descripcion {
        margin: 10px 0;
        color: #666;
        font-size: 14px;
    }
    
    .tarea-meta {
        display: flex;
        flex-wrap: wrap;
        gap: 15px;
        margin: 15px 0;
        font-size: 13px;
    }
    
    .meta-item {
        display: flex;
        align-items: center;
        gap: 5px;
    }
    
    .tarea-acciones {
        display: flex;
        gap: 10px;
        margin-top: 15px;
    }
`;

if (!document.querySelector('style[data-tareas]')) {
    const styleTag = document.createElement('style');
    styleTag.setAttribute('data-tareas', 'true');
    styleTag.textContent = styles;
    document.head.appendChild(styleTag);
}
