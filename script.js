/**
 * Script para el Portafolio IT - Gestión de Clientes y Repositorios
 * Versión: 4.0 (Enhanced UI & Hosting Ready)
 */
console.log('Script GO! Tecnología v4.0 (Audit & Logs) cargado');

// --- Datos Técnicos de Servicios ---
const SERVICE_DETAILS = {
    'infra': {
        titulo: 'Infraestructura IT de Alto Rendimiento',
        icon: 'fas fa-network-wired',
        descripcion: 'Diseño y despliegue de arquitecturas escalables basadas en estándares internacionales.',
        tech: ['Proxmox VE / VMware ESXi', 'Cisco & Ubiquiti Networking', 'Storage SAN/NAS (TrueNAS)', 'Sistemas UPS Schneider'],
        detalles: 'Implementamos topologías redundantes con balanceo de carga para asegurar un uptime del 99.9%. Especialistas en virtualización de servidores y optimización de recursos hídricos en datacenter.'
    },
    'seguridad': {
        titulo: 'Seguridad Informática Proactiva',
        icon: 'fas fa-shield-alt',
        descripcion: 'Protección multinivel para activos digitales empresariales.',
        tech: ['Next-Gen Firewalls (Fortinet)', 'SIEM - Elastic Stack', 'Pentesting (Kali Linux)', 'Cumplimiento ISO 27001'],
        detalles: 'Analizamos vulnerabilidades en tiempo real y desplegamos sistemas de detección de intrusos (IDS/IPS). Auditorías periódicas y cifrado de datos AES-256 en reposo y en tránsito.'
    },
    'cloud': {
        titulo: 'Soluciones Cloud & Multi-Cloud',
        icon: 'fas fa-cloud',
        descripcion: 'Arquitecturas nativas de nube para máxima disponibilidad.',
        tech: ['AWS / Azure / Google Cloud', 'Kubernetes & Docker', 'Terraform (IaC)', 'Serverless Computing'],
        detalles: 'Migramos cargas de trabajo con Cero-Tiempo-De-Inactividad. Optimizamos costos mediante arquitecturas orientadas a microservicios y escalado automático dinámico.'
    },
    'dev': {
        titulo: 'Desarrollo de Software a Medida',
        icon: 'fas fa-code',
        descripcion: 'Sistemas robustos desarrollados con metodologías ágiles.',
        tech: ['Node.js / React / Python', 'PostgreSQL / MongoDB', 'CI/CD Pipelines', 'Arquitectura Microservicios'],
        detalles: 'Creamos herramientas con foco en UX/UI y rendimiento. Desarrollo asegurado con control de versiones Git y pruebas automatizadas integradas en el ciclo de vida.'
    },
    'automa': {
        titulo: 'Automatización & DevOps IT',
        icon: 'fas fa-cogs',
        descripcion: 'Reducción de errores humanos mediante automatización inteligente.',
        tech: ['Ansible / Puppet', 'Jenkins & GitHub Actions', 'RPA Tools', 'Monitoreo Prometheus/Grafana'],
        detalles: 'Automatizamos la configuración de infraestructura y despliegues de software. Reducimos el Time-to-Market de nuevas funcionalidades y estabilizamos los entornos de producción.'
    },
    'soporte': {
        titulo: 'Soporte Especializado 24/7',
        icon: 'fas fa-headset',
        descripcion: 'Continuidad operacional garantizada mediantes SLAs estrictos.',
        tech: ['Gestión ITIL v4', 'Sistemas de Tickets (Jira)', 'Escalamiento Progresivo', 'KMS (Knowledge Management)'],
        detalles: 'Mesa de ayuda nivel 1, 2 y 3. Gestión proactiva de incidentes y problemas personalizada según la criticidad del negocio del cliente.'
    },
    'inventario': {
        titulo: 'Control de Inventario & Activos IT',
        icon: 'fas fa-boxes',
        descripcion: 'Trazabilidad total del ciclo de vida de los activos tecnológicos.',
        tech: ['QR/RFID Asset Tagging', 'Lifecycle Tracking', 'Gestión de Licencias', 'Auditoría de Hardware'],
        detalles: 'Administración centralizada de asignaciones, mantenimientos preventivos y depreciación contable. Historial detallado por equipo desde la adquisición hasta la baja.'
    },
    'auditoria': {
        titulo: 'Sistema de Auditoría & Logs Centralizado',
        icon: 'fas fa-history',
        descripcion: 'Supervisión inalterable de cada acción crítica en el sistema.',
        tech: ['Log Aggregation', 'Forensics IT', 'Real-time Alerts', 'Reportes de Cumplimiento'],
        detalles: 'Registro de auditoría basado en eventos que cumple con normativas internacionales. Trazabilidad garantizada de "quién, cuándo y qué" ocurrió en cada momento.'
    },
    'repositorio': {
        titulo: 'Repositorios Documentales Dinámicos',
        icon: 'fas fa-folder-tree',
        descripcion: 'Gestión segura y colaborativa de documentación técnica.',
        tech: ['Cifrado AES-256 Bit', 'Control de Versiones', 'Logs de Descargas', 'Acceso Granular'],
        detalles: 'Espacios de trabajo aislados por cliente con encriptación de nivel bancario. Monitorización de cada interacción con los documentos para máxima seguridad de la información.'
    }
};

// --- Estado Global ---
let APP_DATA = {
    users: [],
    clients: {}
};
let currentUser = JSON.parse(localStorage.getItem('active_session')) || null;

// --- Carga Inicial de Datos (API) ---
const loadData = async () => {
    // Detectar si se está abriendo como archivo local (ERROR COMÚN)
    if (window.location.protocol === 'file:') {
        console.error('ERROR: Estás abriendo el proyecto como archivo local (file://). El sistema de base de datos (PHP) y las subidas requieren un servidor web (Hosting o XAMPP).');
        alert('⚠️ ATENCIÓN: Estás abriendo el sitio directamente desde tu computadora.\n\nPara que los archivos funcionen, las subidas se guarden y la base de datos sea real, debes subir el proyecto a tu HOSTING o usar un servidor local (XAMPP/Live Server).\n\nAhora entrarás en MODO DE PRUEBA (los cambios se perderán al cerrar).');
    }

    try {
        const response = await fetch('api.php?action=get_data');
        if (!response.ok) throw new Error('Servidor no disponible');
        APP_DATA = await response.json();
        console.log('Datos cargados desde el servidor');
        updateUI();
    } catch (error) {
        console.warn('Usando modo local (Offline): El administrador no podrá guardar cambios permanentemente.');
        // Fallback a localStorage si falla la API (para pruebas locales sin PHP)
        APP_DATA.users = JSON.parse(localStorage.getItem('portfolio_users')) || [
            { username: 'admin', password: 'admin123', role: 'admin', access: ['all'] }
        ];
        APP_DATA.clients = JSON.parse(localStorage.getItem('portfolio_clients')) || {
            'GO_Tecnologia': {
                nombre: 'GO ! Tecnología',
                descripcion: 'Casa matriz y solución IT',
                logo: 'fas fa-microchip',
                repositorio: [
                    { nombre: 'Manual de Usuario (Ejemplo)', tipo: 'PDF', icon: 'fas fa-file-pdf', subidoPor: 'Sistema', fechaSubida: '22/01/2026' }
                ]
            },
            'Kaufmann': { nombre: 'Kaufmann', descripcion: 'Soluciones logísticas automotriz.', logo: 'fas fa-truck-moving', repositorio: [] },
            'Sura_Seguros': { nombre: 'Sura Seguros', descripcion: 'Protección y respaldo financiero.', logo: 'fas fa-shield-alt', repositorio: [] },
            'Komatsu': { nombre: 'Komatsu', descripcion: 'Maquinaria pesada y minería.', logo: 'fas fa-industry', repositorio: [] },
            'Kindryl': { nombre: 'Kindryl', descripcion: 'Infraestructura y gestión de datos.', logo: 'fas fa-network-wired', repositorio: [] },
            'Soprole': { nombre: 'Soprole', descripcion: 'Distribución de lácteos.', logo: 'fas fa-glass-water', repositorio: [] },
            'AZA': { nombre: 'AZA', descripcion: 'Industria siderúrgica sustentable.', logo: 'fas fa-fire', repositorio: [] },
            'Winpack': { nombre: 'Winpack', descripcion: 'Embalaje y automatización.', logo: 'fas fa-box-open', repositorio: [] },
            'Autoplanet': { nombre: 'Autoplanet', descripcion: 'Retail de repuestos automotrices.', logo: 'fas fa-car-side', repositorio: [] }
        };
        APP_DATA.logs = JSON.parse(localStorage.getItem('portfolio_logs')) || [];
        updateUI();
    }
};

// --- Funciones Globales para HTML (onclick) ---

window.abrirLoginModal = function () {
    document.getElementById('loginModal').classList.add('show');
    document.getElementById('loginError').style.display = 'none';
};

window.cerrarLoginModal = function () {
    document.getElementById('loginModal').classList.remove('show');
    document.getElementById('loginForm').reset();
};

window.abrirModal = function () {
    document.getElementById('propuestaModal').classList.add('show');
};

window.cerrarModal = function () {
    document.getElementById('propuestaModal').classList.remove('show');
};

window.verServicio = function (serviceKey) {
    const detail = SERVICE_DETAILS[serviceKey];
    if (!detail) return;

    const modal = document.getElementById('serviceDetailModal');
    const content = document.getElementById('serviceDetailContent');

    content.innerHTML = `
        <div class="service-detail-header">
            <div class="service-detail-icon"><i class="${detail.icon}"></i></div>
            <div class="service-detail-title">
                <h2>${detail.titulo}</h2>
                <p>${detail.descripcion}</p>
            </div>
        </div>
        <div class="service-detail-body">
            <div class="detail-section">
                <h3><i class="fas fa-microchip"></i> Stack Tecnológico</h3>
                <div class="tech-tags">
                    ${detail.tech.map(t => `<span class="tech-tag">${t}</span>`).join('')}
                </div>
            </div>
            <div class="detail-section">
                <h3><i class="fas fa-info-circle"></i> Especificaciones Técnicas</h3>
                <p class="detail-text">${detail.detalles}</p>
            </div>
            <div class="detail-section">
                <h3><i class="fas fa-tools"></i> Metodología Aplicada</h3>
                <p class="detail-text">Nuestro enfoque utiliza estándares internacionales y mejores prácticas de la industria (ISO, ITIL, Agile) para garantizar resultados óptimos.</p>
            </div>
        </div>
        <div class="service-detail-footer">
            <button class="btn btn-primary btn-block" onclick="cerrarServicioModal()">Entendido</button>
        </div>
    `;

    modal.classList.add('show');
};

window.cerrarServicioModal = function () {
    document.getElementById('serviceDetailModal').classList.remove('show');
};

window.logout = function () {
    currentUser = null;
    localStorage.removeItem('active_session');
    updateUI();
    alert('Sesión cerrada.');
    window.location.reload(); // Recargar para limpiar estados
};

window.abrirAdminModal = function () {
    if (!currentUser || currentUser.role !== 'admin') return;
    document.getElementById('adminModal').classList.add('show');
    renderUsersTable();
};

window.cerrarAdminModal = function () {
    document.getElementById('adminModal').classList.remove('show');
};

window.switchAdminTab = function (tab, event) {
    const tabs = document.querySelectorAll('.admin-tab');
    const contents = document.querySelectorAll('.tab-content');

    // Ocultar todos los contenidos y quitar clases activas
    contents.forEach(c => c.style.display = 'none');
    tabs.forEach(t => t.classList.remove('active'));

    // Activar pestaña actual si viene de un evento
    if (event && event.currentTarget) {
        event.currentTarget.classList.add('active');
    } else {
        // Por defecto activar la primera pestaña si no hay evento
        tabs[0].classList.add('active');
    }

    const targetContent = document.getElementById(tab + 'Tab');
    if (targetContent) targetContent.style.display = 'block';

    if (tab === 'logs') renderAuditLogs();
    if (tab === 'access') renderAccessSummary();
    if (tab === 'clients') renderClientsAdminTable();
};

const registrarEvento = async (accion) => {
    if (!APP_DATA.logs) APP_DATA.logs = [];
    const log = {
        usuario: currentUser ? currentUser.username : 'Sistema',
        accion: accion,
        fecha: new Date().toLocaleString()
    };
    APP_DATA.logs.unshift(log);
    if (APP_DATA.logs.length > 200) APP_DATA.logs.pop();

    try {
        await fetch('api.php?action=save_logs', {
            method: 'POST',
            body: JSON.stringify(APP_DATA.logs)
        });
    } catch (e) {
        localStorage.setItem('portfolio_logs', JSON.stringify(APP_DATA.logs));
    }
};

window.renderAuditLogs = () => {
    const container = document.getElementById('logsTab');
    if (!container) return;

    const logs = APP_DATA.logs || [];
    container.innerHTML = `
        <div class="audit-header">
            <h3><i class="fas fa-history"></i> Registro de Auditoría Central</h3>
            <p>Monitoreo en tiempo real de cambios y accesos</p>
        </div>
        <div class="table-container">
            <table class="admin-table">
                <thead>
                    <tr>
                        <th width="25%">Fecha y Hora</th>
                        <th width="20%">Usuario</th>
                        <th width="55%">Detalle de la Acción</th>
                    </tr>
                </thead>
                <tbody>
                    ${logs.map(l => `
                        <tr>
                            <td class="log-date">${l.fecha}</td>
                            <td><span class="role-badge role-admin">${l.usuario}</span></td>
                            <td>${l.accion}</td>
                        </tr>
                    `).join('')}
                    ${logs.length === 0 ? '<tr><td colspan="3" class="no-docs">No hay registros de actividad recientes.</td></tr>' : ''}
                </tbody>
            </table>
        </div>
    `;
};

window.renderAccessSummary = () => {
    const container = document.getElementById('accessTab');
    if (!container) return;

    const totalUsers = APP_DATA.users.length;
    const totalClients = Object.keys(APP_DATA.clients).length;
    const adminCount = APP_DATA.users.filter(u => u.role === 'admin').length;

    container.innerHTML = `
        <div class="audit-header">
            <h3><i class="fas fa-key"></i> Resumen de Permisos y Estados</h3>
            <p>Vista global de la infraestructura de acceso</p>
        </div>
        
        <div class="stats-overview">
            <div class="stat-card">
                <i class="fas fa-users"></i>
                <div class="stat-info">
                    <span class="stat-value">${totalUsers}</span>
                    <span class="stat-label">Usuarios Totales</span>
                </div>
            </div>
            <div class="stat-card">
                <i class="fas fa-building"></i>
                <div class="stat-info">
                    <span class="stat-value">${totalClients}</span>
                    <span class="stat-label">Clientes Activos</span>
                </div>
            </div>
            <div class="stat-card">
                <i class="fas fa-user-shield"></i>
                <div class="stat-info">
                    <span class="stat-value">${adminCount}</span>
                    <span class="stat-label">Administradores</span>
                </div>
            </div>
        </div>

        <div class="permission-matrix">
            <div class="matrix-header">
                <h4><i class="fas fa-project-diagram"></i> Matriz de Acceso por Cliente</h4>
                <p>Usuarios autorizados por cada entidad</p>
            </div>
            <div class="matrix-grid">
                ${Object.keys(APP_DATA.clients).map(key => {
        const client = APP_DATA.clients[key];
        const usersWithAccess = APP_DATA.users.filter(u =>
            u.role === 'admin' || u.access.includes('all') || (u.access && u.access.includes(key))
        ).length;

        const percent = totalUsers > 0 ? (usersWithAccess / totalUsers) * 100 : 0;

        return `
                        <div class="matrix-item">
                            <div class="matrix-info">
                                <span class="matrix-client">${client.nombre}</span>
                                <span class="matrix-count">${usersWithAccess} usuarios</span>
                            </div>
                            <div class="matrix-bar-bg">
                                <div class="matrix-bar-fill" style="width: ${percent}%"></div>
                            </div>
                        </div>
                    `;
    }).join('')}
            </div>
        </div>
    `;
};

window.descargarArchivo = function (url, nombre) {
    if (!url || url === '#') {
        console.warn('URL de descarga no válida');
        return;
    }

    console.log('Iniciando descarga de:', url);
    const link = document.createElement('a');
    link.href = url;
    link.download = nombre || 'archivo';
    link.target = '_blank'; // Si el download falla, al menos lo abre
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Si después de 500ms no pasó nada (especialmente en móviles), forzar apertura
    setTimeout(() => {
        if (!document.hasFocus()) return; // Si perdió el foco es que algo se abrió
        // window.location.href = url; // Último recurso
    }, 500);
};

window.abrirClienteModal = function () {
    document.getElementById('clienteModal').classList.add('show');
};

window.cerrarClienteModal = function () {
    document.getElementById('clienteModal').classList.remove('show');
};

// --- Autenticación ---

const login = (username, password) => {
    const user = APP_DATA.users.find(u => u.username === username && u.password === password);
    if (user) {
        currentUser = user;
        localStorage.setItem('active_session', JSON.stringify(currentUser));
        cerrarLoginModal();
        updateUI();
        alert('¡Bienvenido, ' + username + '!');
    } else {
        document.getElementById('loginError').style.display = 'block';
    }
};

// --- Interfaz ---

const updateUI = () => {
    const loginNavItem = document.getElementById('loginNavItem');
    const userNavItem = document.getElementById('userNavItem');
    const userNameDisplay = document.getElementById('userNameDisplay');
    const adminLink = document.getElementById('adminLink');

    if (currentUser) {
        loginNavItem.style.display = 'none';
        userNavItem.style.display = 'block';
        userNameDisplay.textContent = currentUser.username;
        adminLink.style.display = currentUser.role === 'admin' ? 'flex' : 'none';
    } else {
        loginNavItem.style.display = 'block';
        userNavItem.style.display = 'none';
    }
    renderClientsGrid();
};

window.verCliente = (id) => {
    if (!currentUser) {
        alert('Contenido privado. Por favor inicia sesión.');
        abrirLoginModal();
        return;
    }

    const hasAccess = currentUser.role === 'admin' ||
        currentUser.access.includes('all') ||
        currentUser.access.includes(id);

    if (!hasAccess) {
        alert('No tienes acceso a ' + id);
        return;
    }

    const data = APP_DATA.clients[id] || { nombre: id, descripcion: 'Sin datos', repositorio: [] };
    const modalBody = document.getElementById('modalBody');

    // Categorización de archivos
    const categories = {
        folders: { title: 'Directorios y Carpetas', icon: 'fas fa-folder', items: [] },
        pdf: { title: 'Documentación PDF', icon: 'fas fa-file-pdf', items: [] },
        data: { title: 'Planillas y Datos', icon: 'fas fa-file-excel', items: [] },
        media: { title: 'Multimedia e Imágenes', icon: 'fas fa-file-image', items: [] },
        others: { title: 'Archivos Varios', icon: 'fas fa-file-alt', items: [] }
    };

    if (data.repositorio) {
        data.repositorio.forEach((item, idx) => {
            const ext = (item.tipo || '').toUpperCase();
            const originalIndex = idx; // Guardar índice original para eliminación
            const itemWithIndex = { ...item, originalIndex };

            if (item.nombre.includes('/') || item.tipo === 'FOLDER') {
                categories.folders.items.push(itemWithIndex);
            } else if (ext === 'PDF') {
                categories.pdf.items.push(itemWithIndex);
            } else if (['XLS', 'XLSX', 'CSV'].includes(ext)) {
                categories.data.items.push(itemWithIndex);
            } else if (['PNG', 'JPG', 'JPEG', 'SVG', 'GIF'].includes(ext)) {
                categories.media.items.push(itemWithIndex);
            } else {
                categories.others.items.push(itemWithIndex);
            }
        });
    }

    let repoHTML = '';
    let hasAnyFile = false;

    Object.keys(categories).forEach(cat => {
        const group = categories[cat];
        if (group.items.length > 0) {
            hasAnyFile = true;
            repoHTML += `
                <div class="repo-category-group">
                    <div class="category-header">
                        <i class="${group.icon}"></i> ${group.title}
                        <span class="category-count">${group.items.length}</span>
                    </div>
                    <div class="repo-grid">
                        ${group.items.map(item => `
                            <div class="repo-item ${!item.url ? 'demo-item' : ''}" 
                                 onclick="${item.url ? `descargarArchivo('${item.url}', '${item.nombre}')` : 'event.stopPropagation()'}">
                                <div class="repo-item-content">
                                    <i class="${item.icon || 'fas fa-file'}"></i>
                                    <div class="repo-info">
                                        <span class="repo-name">${item.nombre.split('/').pop()}</span>
                                        <div class="repo-meta">
                                            <span class="repo-type">${item.tipo}</span>
                                            ${item.subidoPor ? `<span class="repo-audit"><i class="fas fa-user-edit"></i> ${item.subidoPor}</span>` : ''}
                                        </div>
                                    </div>
                                </div>
                                <div class="repo-actions">
                                    ${item.url ? `<div class="download-icon"><i class="fas fa-download"></i></div>` : ''}
                                    ${(currentUser.role === 'admin' || currentUser.role === 'editor') ? `<i class="fas fa-trash-alt delete-doc" onclick="event.stopPropagation(); eliminarDocumento('${id}', ${item.originalIndex})" title="Eliminar"></i>` : ''}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }
    });

    if (!hasAnyFile) {
        repoHTML = '<p class="no-docs">No hay archivos en este repositorio.</p>';
    }

    // Botón de subir solo para admin y editor
    const adminTools = (currentUser.role === 'admin' || currentUser.role === 'editor') ? `
        <div class="admin-repo-tools">
            <input type="file" id="fileSelector" style="display:none" onchange="handleFileUpload('${id}', 'fileSelector')" multiple>
            <input type="file" id="folderSelector" style="display:none" onchange="handleFileUpload('${id}', 'folderSelector')" webkitdirectory directory>
            
            <button class="btn btn-sm btn-primary" onclick="document.getElementById('fileSelector').click()" title="Seleccionar uno o varios archivos">
                <i class="fas fa-file-upload"></i> Subir Archivos
            </button>
            <button class="btn btn-sm btn-accent" onclick="document.getElementById('folderSelector').click()" title="Seleccionar una carpeta completa">
                <i class="fas fa-folder-plus"></i> Subir Carpeta
            </button>
        </div>
    ` : '';

    modalBody.innerHTML = `
        <div class="client-detail-header">
            <div class="client-logo-large"><i class="${data.logo || 'fas fa-building'}"></i></div>
            <div class="client-info-main">
                <h2>${data.nombre}</h2>
                <p>${data.descripcion}</p>
            </div>
        </div>
        ${adminTools}
        <div class="repository-section">
            <h3><i class="fas fa-folder-open"></i> Archivos y Documentación</h3>
            ${repoHTML}
        </div>
    `;

    abrirClienteModal();
};

// --- Gestión de Documentos (Solo Admin) ---

window.handleFileUpload = async (clientId, inputId = 'fileSelector') => {
    const fileInput = document.getElementById(inputId);
    if (!fileInput.files.length) return;

    const files = Array.from(fileInput.files);
    let successCount = 0;
    const totalFiles = files.length;

    // Mostrar overlay de progreso
    const overlay = document.getElementById('uploadProgressOverlay');
    const bar = document.getElementById('uploadProgressBar');
    const percentText = document.getElementById('uploadPercentage');
    const statusText = document.getElementById('uploadStatusText');

    overlay.classList.add('active');
    bar.style.width = '0%';
    percentText.textContent = '0%';

    for (let i = 0; i < totalFiles; i++) {
        const file = files[i];
        statusText.textContent = `Subiendo: ${file.name} (${i + 1}/${totalFiles})`;

        const formData = new FormData();
        formData.append('file', file);

        try {
            // Nota: Fetch no soporta progreso de subida nativamente. 
            // Para progreso real usamos XMLHttpRequest o un estimado por archivo.
            const response = await fetch('api.php?action=upload_file', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (result.status === 'success') {
                const extension = file.name.split('.').pop().toUpperCase();
                const isFolder = !!file.webkitRelativePath && file.webkitRelativePath.includes('/');

                let icon = 'far fa-file';
                if (isFolder) icon = 'fas fa-folder';
                else if (extension === 'PDF') icon = 'fas fa-file-pdf';
                else if (['XLS', 'XLSX', 'CSV'].includes(extension)) icon = 'fas fa-file-excel';
                else if (['PNG', 'JPG', 'JPEG', 'SVG', 'GIF'].includes(extension)) icon = 'fas fa-file-image';
                else if (['ZIP', 'RAR', '7Z'].includes(extension)) icon = 'fas fa-file-archive';
                else if (['DOC', 'DOCX'].includes(extension)) icon = 'fas fa-file-word';
                else if (['PPT', 'PPTX'].includes(extension)) icon = 'fas fa-file-powerpoint';

                const newDoc = {
                    nombre: file.webkitRelativePath || file.name,
                    tipo: isFolder ? 'FOLDER' : extension,
                    icon: icon,
                    url: result.file_path,
                    subidoPor: currentUser.username,
                    fechaSubida: new Date().toLocaleString()
                };

                if (!APP_DATA.clients[clientId]) {
                    APP_DATA.clients[clientId] = { nombre: clientId, repositorio: [] };
                }
                APP_DATA.clients[clientId].repositorio.push(newDoc);
                successCount++;
            }
        } catch (e) {
            console.error(`Error en ${file.name}:`, e);
        }

        // Actualizar barra de progreso (estimada por cantidad de archivos)
        const progress = Math.round(((i + 1) / totalFiles) * 100);
        bar.style.width = progress + '%';
        percentText.textContent = progress + '%';
    }

    // Pequeña espera para que el usuario vea el 100%
    setTimeout(async () => {
        overlay.classList.remove('active');
        if (successCount > 0) {
            await registrarEvento(`Subida de ${successCount} archivo(s) en ${clientId}`);
            await saveClients();
            verCliente(clientId);
        }
    }, 800);

    fileInput.value = '';
};

window.eliminarDocumento = (clientId, index) => {
    if (confirm('¿Eliminar este documento?')) {
        APP_DATA.clients[clientId].repositorio.splice(index, 1);
        saveClients();
    }
};

// --- Gestión de Clientes (Admin) ---

window.handleCreateClient = async (event) => {
    event.preventDefault();
    const nombre = document.getElementById('newClientName').value.trim();
    const desc = document.getElementById('newClientDesc').value.trim();
    const logo = document.getElementById('newClientLogo').value.trim();

    if (!nombre) return;

    // Crear un ID basado en el nombre (slug)
    const id = nombre.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '');

    if (APP_DATA.clients[id]) {
        alert('Ya existe una empresa con ese nombre.');
        return;
    }

    APP_DATA.clients[id] = {
        nombre: nombre,
        descripcion: desc,
        logo: logo || 'fas fa-building',
        repositorio: []
    };

    await registrarEvento(`Creación de empresa: ${nombre}`);
    await saveClients();
    renderClientsAdminTable();
    event.target.reset();
    alert('Empresa creada correctamente.');
};

window.renderClientsAdminTable = () => {
    const tbody = document.querySelector('#clientsAdminTable tbody');
    if (!tbody) return;
    tbody.innerHTML = '';

    Object.keys(APP_DATA.clients).forEach(key => {
        const c = APP_DATA.clients[key];
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>
                <div style="display:flex; align-items:center; gap:10px">
                    <i class="${c.logo || 'fas fa-building'}" style="color:var(--primary-color)"></i>
                    <strong>${c.nombre}</strong>
                </div>
            </td>
            <td><small>${c.descripcion}</small></td>
            <td>${c.repositorio ? c.repositorio.length : 0} ítems</td>
            <td>
                <button class="action-btn edit-btn" onclick="verCliente('${key}')" title="Ver Repositorio">
                    <i class="fas fa-folder-open"></i>
                </button>
                <button class="action-btn delete-btn" onclick="deleteClient('${key}')" title="Eliminar Empresa">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
};

window.deleteClient = async (key) => {
    if (confirm(`¿Estás seguro de eliminar la empresa "${APP_DATA.clients[key].nombre}"? Esta acción no se puede deshacer y borrará todos sus archivos vinculados.`)) {
        const nombre = APP_DATA.clients[key].nombre;
        delete APP_DATA.clients[key];
        await registrarEvento(`Eliminación de empresa: ${nombre}`);
        await saveClients();
        renderClientsAdminTable();
    }
};

const saveClients = async () => {
    try {
        const response = await fetch('api.php?action=save_clients', {
            method: 'POST',
            body: JSON.stringify(APP_DATA.clients)
        });
        if (!response.ok) throw new Error('Error al guardar');

        // Actualizar la grilla de clientes en el inicio (si existe)
        renderClientsGrid();
    } catch (e) {
        console.error(e);
        localStorage.setItem('portfolio_clients', JSON.stringify(APP_DATA.clients));
    }
};

// Nueva función para refrescar la grilla de clientes en la página principal
const renderClientsGrid = () => {
    const grid = document.querySelector('.clients-grid');
    if (!grid) return;

    grid.innerHTML = Object.keys(APP_DATA.clients).map(key => {
        const c = APP_DATA.clients[key];
        return `
            <div class="client-card" onclick="verCliente('${key}')">
                <i class="${c.logo || 'fas fa-building'}"></i>
                <span>${c.nombre}</span>
            </div>
        `;
    }).join('');
};

// --- Gestión de Usuarios (Admin) ---

window.renderUsersTable = () => {
    const tbody = document.querySelector('#usersTable tbody');
    if (!tbody) return;
    tbody.innerHTML = '';

    APP_DATA.users.forEach((u, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${u.username}</td>
            <td>
                ${u.username === 'admin' ? '<span class="access-badge access-admin">ADMIN</span>' : `
                    <select onchange="updateUserRole(${index}, this.value)" class="access-select">
                        <option value="viewer" ${u.role === 'viewer' ? 'selected' : ''}>Visualizador</option>
                        <option value="editor" ${u.role === 'editor' ? 'selected' : ''}>Editor</option>
                        <option value="admin" ${u.role === 'admin' ? 'selected' : ''}>Administrador</option>
                    </select>
                `}
            </td>
            <td>
                ${u.role === 'admin' ? '<span class="access-badge access-admin">TODO</span>' : `
                    <select onchange="updateUserAccess(${index}, this.value)" class="access-select">
                        <option value="all" ${u.access.includes('all') ? 'selected' : ''}>Todos los Clientes</option>
                        ${Object.keys(APP_DATA.clients).map(key => `
                            <option value="${key}" ${u.access.includes(key) ? 'selected' : ''}>${APP_DATA.clients[key].nombre}</option>
                        `).join('')}
                    </select>
                `}
            </td>
            <td>${u.username === 'admin' ? '-' : `<i class="fas fa-trash remove-btn" onclick="deleteUser(${index})"></i>`}</td>
        `;
        tbody.appendChild(tr);
    });
};

window.updateUserRole = (index, value) => {
    APP_DATA.users[index].role = value;
    saveUsers();
};

window.updateUserAccess = (index, value) => {
    APP_DATA.users[index].access = [value];
    saveUsers();
};

window.deleteUser = (index) => {
    if (confirm('¿Eliminar usuario?')) {
        APP_DATA.users.splice(index, 1);
        saveUsers();
    }
};

const saveUsers = async () => {
    try {
        await fetch('api.php?action=save_users', {
            method: 'POST',
            body: JSON.stringify(APP_DATA.users)
        });
        renderUsersTable();
    } catch (e) {
        localStorage.setItem('portfolio_users', JSON.stringify(APP_DATA.users));
    }
};

// --- Inicialización ---

document.addEventListener('DOMContentLoaded', () => {
    // Hide Preloader
    const preloader = document.getElementById('preloader');
    if (preloader) {
        setTimeout(() => {
            preloader.style.opacity = '0';
            setTimeout(() => preloader.style.display = 'none', 500);
        }, 800);
    }

    loadData();

    // Login Form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            login(document.getElementById('loginUser').value, document.getElementById('loginPass').value);
        });
    }

    // Add User Form
    const addUserForm = document.getElementById('addUserForm');
    if (addUserForm) {
        addUserForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const u = document.getElementById('newUsername').value;
            const p = document.getElementById('newUserPass').value;
            const r = document.getElementById('newUserRole').value;
            if (APP_DATA.users.some(x => x.username === u)) return alert('Ya existe');
            APP_DATA.users.push({ username: u, password: p, role: r, access: ['all'] });
            saveUsers();
            addUserForm.reset();
        });
    }

    // Search
    const search = document.getElementById('clientSearch');
    if (search) {
        search.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase();
            document.querySelectorAll('.client-card').forEach(card => {
                const visible = card.querySelector('span').textContent.toLowerCase().includes(term);
                card.style.display = visible ? 'flex' : 'none';
            });
        });
    }
});

// Close modals on overlay click
window.onclick = function (event) {
    if (event.target.classList.contains('modal')) {
        event.target.classList.remove('show');
    }
};
