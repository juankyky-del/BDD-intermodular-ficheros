const formularioLogin = document.getElementById('loginForm');

if (formularioLogin) {
    formularioLogin.addEventListener('submit', async function(evento) {
        evento.preventDefault();
        
        const usuario = document.getElementById('username').value;
        const contrasena = document.getElementById('password').value;
        const mensajeError = document.getElementById('loginMessage');

        if (usuario === 'admin' && contrasena === '1234') {
            window.location.href = 'dashboardCore.html';
        } else {
            mensajeError.style.color = '#e74c3c';
            mensajeError.textContent = 'Error: Usuario o contraseña incorrectos.';
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const totalEmpleadosElement = document.getElementById('totalEmpleados');
    if (totalEmpleadosElement) {
        cargarMetricas(totalEmpleadosElement);
    }

    const ProyectosEncurso = document.getElementById('ProyectosEncurso');
    if (ProyectosEncurso) {
    cargarMetricasProyectos(ProyectosEncurso);
    }

    const totalTickets = document.getElementById('totalTickets');
    if (totalTickets) {
    cargarMetricasTickets(totalTickets);
    }

});


async function cargarMetricas(elementoHTML) {
    try {
        const respuesta = await fetch('http://localhost:3000/api/empleados');
              const resultado = await respuesta.json();

        if (resultado.exito) {
            const total = resultado.datos.length;
            elementoHTML.textContent = total;
        } else {
            elementoHTML.textContent = "Error";
        }
    } catch (error) {
        console.error("Fallo al conectar con la API:", error);
        elementoHTML.textContent = "Off";
    }
}

async function cargarMetricasProyectos(elementoHTML) {
    try {
        const respuesta = await fetch('http://localhost:3000/api/proyectos');
        const resultado = await respuesta.json();

        if (resultado.exito) {
            const total = resultado.datos.length;
            elementoHTML.textContent = total;
        } else {
            elementoHTML.textContent = "Error";
        }
    } catch (error) {
        console.error("Fallo al conectar con proyectos:", error);
        elementoHTML.textContent = "Off";
    }
}


async function cargarMetricasTickets(elementoHTML) {
    try {
        const respuesta = await fetch('http://localhost:3000/api/tickets');
        const resultado = await respuesta.json();

        if (resultado.exito) {
            const total = resultado.datos.length;
            elementoHTML.textContent = total;
        } else {
            elementoHTML.textContent = "Error";
        }
    } catch (error) {
        console.error("Fallo al conectar con proyectos:", error);
        elementoHTML.textContent = "Off";
    }
}



// ==========================================
//                DIRECTORIO 
// ==========================================

const tituloConsulta = document.getElementById('tituloConsulta');
const tablaDatos = document.getElementById('tablaDatos');
const cabeceraTabla = document.getElementById('cabeceraTabla');
const cuerpoTabla = document.getElementById('cuerpoTabla');
const inputFiltro = document.getElementById('inputFiltro');

const btnEmpleados = document.getElementById('btnEmpleados');
const btnProyectos = document.getElementById('btnProyectos');
const btnTickets = document.getElementById('btnTickets');

// 1. EL MOLDE GENÉRICO (Se escribe una sola vez para todas las consultas)
async function ejecutarConsulta(urlDeLaAPI, tituloParaMostrar) {
    tituloConsulta.textContent = "Cargando datos...";
    
    try {
        const respuesta = await fetch(urlDeLaAPI);
        const resultado = await respuesta.json();
        
        if (resultado.exito) {
            tituloConsulta.textContent = tituloParaMostrar;
            tablaDatos.style.display = "table";
            inputFiltro.style.display = "block";
            
            console.log(`Datos cargados:`, resultado.datos);
            // En el próximo paso programaremos aquí cómo rellenar las filas
        }
    } catch (error) {
        tituloConsulta.textContent = "Error de conexión al cargar la consulta.";
    }
}

// 2. LOS BOTONES (Solo llaman al molde pasándole su URL y su título)
if (btnEmpleados) {
    btnEmpleados.addEventListener('click', () => ejecutarConsulta('http://localhost:3000/api/empleados', '1. Lista de Empleados'));
}

if (btnProyectos) {
    btnProyectos.addEventListener('click', () => ejecutarConsulta('http://localhost:3000/api/proyectos', '2. Proyectos Activos'));
}

if (btnTickets) {
    btnTickets.addEventListener('click', () => ejecutarConsulta('http://localhost:3000/api/tickets', '3. Tickets Abiertos'));
}

