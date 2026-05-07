import pool from './database.js';

/**
 * BLOQUE A: CONSULTAS DE LECTURA (SELECT y JOINS)
 */

export async function obtenerListaEmpleados() {
    // EJEMPLO FUNCIONAL EMPLEADOS ACTIVOS

    const sql = `
            SELECT e.id_empleado, e.nombre, e.apellidos, d.nombre AS departamento, p.titulo AS puesto 
            FROM empleados e
            LEFT JOIN departamentos d ON e.id_departamento = d.id_departamento
            LEFT JOIN puestos p ON e.id_puesto = p.id_puesto
            WHERE e.estado = 'ACTIVO'
            ORDER BY d.nombre ASC;
    `;
    const [filas] = await pool.query(sql);
    return filas;
}


// EJEMPLO FUNCIONAL PROYECTOS EN CURSO
export async function obtenerProyectosEnCurso() {
 const sql = `
      SELECT p.nombre_proyecto AS Proyecto, d.nombre AS Departamento, p.fecha_inicio AS inicio, p.estado
      FROM proyectos p
      join departamentos d on p.id_departamento_responsable = d.id_departamento
      WHERE p.estado ='EN_CURSO';   
    `;
    const [filas] = await pool.query(sql);
    return filas;
}



// EJEMPLO FUNCIONAL PROYECTOS EN TCKETS
export async function obtenertotalTickets() {
 const sql = `
    SELECT i.id_incidencia, e.nombre, eq.tipo_dispositivo,i.descripcion_problema as Problema, i.fecha_reporte as fecha, i.estado
    FROM incidencias_soporte i
    JOIN  empleados e on i.id_empleado_reporta = e.id_empleado
    JOIN equipos_informaticos eq on i.id_equipo_afectado = eq.id_equipo
    WHERE i.estado ='abierta';   
    `;
    const [filas] = await pool.query(sql);
    return filas;
}


export async function obtenerDashboardStats() {
    // TODO: INSERTA AQUÍ TUS CONSULTAS PARA EL DASHBOARD
    // Necesitas devolver el total de empleados activos, proyectos en curso y tickets abiertos.

    // 👇 Modifica esto 👇
    const total_empleados = 0; 
    const proyectos_activos = 0;
    const tickets_abiertos = 0; 

    return {
        total_empleados,
        proyectos_activos,
        tickets_abiertos
    };
}


/**
 * BLOQUE B: TRANSACCIONES (EL NÚCLEO)
 */

export async function transaccionDespedirEmpleado(id_empleado, id_admin) {
    // Para transacciones necesitamos extraer una conexión individual del pool
    const conexion = await pool.getConnection();

    try {
        // 1. INICIAMOS LA TRANSACCIÓN
        await conexion.beginTransaction();

        // -----------------------------------------------------------------
        // TODO: INSERTA AQUÍ TUS SENTENCIAS DML (UPDATE / INSERT / DELETE)
        // Ejemplo: await conexion.query("UPDATE empleados SET ... WHERE id = ?", [id_empleado])
        // -----------------------------------------------------------------

        /* PASO 1: Cambiar estado a 'DESPEDIDO' en tabla empleados */

        /* PASO 2: Bloquear su cuenta en credenciales_acceso (cuenta_bloqueada = 1) */

        /* PASO 3: Poner fecha_fin actual en su historial_salarial activo */

        /* PASO 4: Cerrar sus proyectos en asignaciones_proyectos (fecha_desasignacion = actual) */

        /* PASO 5: Insertar fila en registro_auditoria indicando el despido */


        // 2. SI TODO HA IDO BIEN, GUARDAMOS LOS CAMBIOS DEFINITIVAMENTE
        await conexion.commit();
        console.log(`Transacción completada: Empleado ${id_empleado} despedido.`);

    } catch (error) {
        // 3. SI ALGO FALLA (ej. tabla mal escrita o error de integridad constraint), DESHACEMOS TODO
        await conexion.rollback();
        console.error("Transacción fallida. Haciendo ROLLBACK automático.", error);
        throw error; // Propagamos el error para que la API responda con un 500
    } finally {
        // 4. SIEMPRE LIBERAMOS LA CONEXIÓN AL TERMINAR
        conexion.release();
    }
}

// TODO: AÑADE AQUÍ EL RESTO DE TUS 10 TRANSACCIONES (Cambio de departamento, cerrar proyecto, etc.)
// y expórtalas al final para que el server.js pueda usarlas.