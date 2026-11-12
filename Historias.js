if (!usuarioLogueado()){
    window.location.href = 'login.html';
}

let datos = {};
try {
    datos = JSON.parse(sessionStorage.getItem('Usuario')) || {};
} catch(e) {
    datos = {};
}

let nombre = datos.firstName || datos.username || 'Administrador';

nombre = nombre.charAt(0).toUpperCase() + nombre.slice(1);

const spanNombre = document.getElementById('NombreUsuario');
if (spanNombre) {
    spanNombre.textContent = nombre;
} 

document.addEventListener('DOMContentLoaded', () => {
    if (typeof usuarioLogueado === 'function' && !usuarioLogueado()) {
        window.location.href = 'login.html';
    }

    
    const formHistoria = document.getElementById('formHistoria');
    const tbody = document.getElementById('tablaHistorias');
    const selectMascota = document.getElementById('mascotas'); 
    const selectVeterinario = document.getElementById('veterinarios'); 
    
    
    const STORAGE_KEY = 'historias_clinicas';
    let historias = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

    
    function cargarSelectores() {
        const mascotas = JSON.parse(localStorage.getItem('mascotas')) || [];
        const veterinarios = JSON.parse(localStorage.getItem('veterinarios')) || [];

        // Llenar select de Mascotas
        if (selectMascota) {
            selectMascota.innerHTML = '<option value="" disabled selected>Seleccione una mascota</option>';
            mascotas.forEach(m => {
                const opt = document.createElement('option');
                opt.value = m.idMascota; 
                opt.textContent = `${m.nombreMascota} (Dueño: ${m.nombreDuenio})`;
                selectMascota.appendChild(opt);
            });
        }

        // Llenar select de Veterinarios
        if (selectVeterinario) {
            selectVeterinario.innerHTML = '<option value="" disabled selected>Seleccione un veterinario</option>';
            veterinarios.forEach(v => {
                const opt = document.createElement('option');
                opt.value = v.idVeterinario;
                opt.textContent = `Dr/a. ${v.nombre} - ${v.especialidad}`;
                selectVeterinario.appendChild(opt);
            });
        }
    }

    function guardar() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(historias));
    }

    
    function mostrar() {
        if (!tbody) return;
        tbody.innerHTML = '';
        
        if (historias.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4" class="text-center text-muted py-3">Todavía no hay historias registradas.</td></tr>';
            return;
        }

        const mascotas = JSON.parse(localStorage.getItem('mascotas')) || [];
        const veterinarios = JSON.parse(localStorage.getItem('veterinarios')) || [];

        historias.forEach((h, index) => {
           
            const masc = mascotas.find(m => m.idMascota === h.idMascota);
            const vet = veterinarios.find(v => v.idVeterinario === h.idVeterinario);

            const nombreMascota = masc ? masc.nombreMascota : 'Mascota eliminada';
            const nombreDuenio = masc ? masc.nombreDuenio : 'Desconocido';
            const nombreVet = vet ? vet.nombre : 'Veterinario no asignado';

            tbody.innerHTML += `
                <tr>
                    <td>${nombreMascota} (${nombreDuenio})</td>
                    <td>${nombreVet}</td>
                    <td>${h.fecha}</td>
                    <td>
                        <button class="btn btn-sm btn-primary me-1" onclick="verHistorial('${h.idMascota}')">Ver</button>
                        <button class="btn btn-sm btn-danger" onclick="eliminarHistoria('${h.idHistoriaClinica || index}')">Eliminar</button>
                    </td>
                </tr>`;
        });
    }

    // 3. Registrar nueva historia clínica conectando los IDs
    if (formHistoria) {
        formHistoria.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const nuevaHistoria = {
                idHistoriaClinica: crypto.randomUUID(),
                idMascota: selectMascota.value,         
                idVeterinario: selectVeterinario.value, 
                fecha: document.getElementById('fecha').value,
                diagnostico: document.getElementById('diagnostico').value.trim()
            };

            historias.push(nuevaHistoria);
            guardar();
            mostrar();
            this.reset();
            cargarSelectores(); // Recargar selects

            const modalElement = document.getElementById('modalGuardadoHistoria');
            if (modalElement) {
                const modalGuardado = new bootstrap.Modal(modalElement);
                modalGuardado.show();
            }
        });
    }

    // Funciones globales para botones dinámicos
    window.verHistorial = function(idMascota) {
        const delAnimal = historias.filter(h => h.idMascota === idMascota);
        const mascotas = JSON.parse(localStorage.getItem('mascotas')) || [];
        const veterinarios = JSON.parse(localStorage.getItem('veterinarios')) || [];
        const masc = mascotas.find(m => m.idMascota === idMascota);

        const contenedorHistorial = document.getElementById('contenidoHistorial');
        const nombreMascotaHistorial = document.getElementById('nombreMascotaHistorial');
        const seccionHistorial = document.getElementById('historialCompleto');

        if (nombreMascotaHistorial) nombreMascotaHistorial.textContent = masc ? masc.nombreMascota : 'Mascota';
        if (seccionHistorial) seccionHistorial.style.display = 'block';

        if (contenedorHistorial) {
            contenedorHistorial.innerHTML = delAnimal.map(h => {
                const vet = veterinarios.find(v => v.idVeterinario === h.idVeterinario);
                return `
                    <p><b>Fecha:</b> ${h.fecha} <br> 
                       <b>Atendido por:</b> ${vet ? vet.nombre : 'No especificado'} <br> 
                       <b>Diagnóstico/Observaciones:</b> ${h.diagnostico}
                    </p><hr>
                `;
            }).join('');
        }
    };

    window.cerrarHistorial = function() {
        const seccionHistorial = document.getElementById('historialCompleto');
        if (seccionHistorial) seccionHistorial.style.display = 'none';
    };

    let historiaAEliminar = null;
    window.eliminarHistoria = function(id) {
        historiaAEliminar = id;
        const modalElement = document.getElementById('modalEliminarHistoria');
        if (modalElement) {
            const modal = new bootstrap.Modal(modalElement);
            modal.show();
        }
    };

    const btnConfirmar = document.getElementById('btnConfirmarEliminarHistoria');
    if (btnConfirmar) {
        btnConfirmar.addEventListener('click', function() {
            if (historiaAEliminar !== null) {
               
                historias = historias.filter(h => (h.idHistoriaClinica || historias.indexOf(h).toString()) !== historiaAEliminar);
                guardar();
                mostrar();
                historiaAEliminar = null;
            }
            const modalElement = document.getElementById('modalEliminarHistoria');
            if (modalElement) {
                const modal = bootstrap.Modal.getInstance(modalElement);
                if (modal) modal.hide();
            }
        });
    }

   
    cargarSelectores();
    mostrar();
});