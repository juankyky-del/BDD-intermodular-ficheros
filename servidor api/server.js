import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { 
    obtenerListaEmpleados, 
    obtenerDashboardStats, 
    transaccionDespedirEmpleado,
    obtenerProyectosEnCurso,
    obtenertotalTickets 
} from './consultas_estudiantes.js';

dotenv.config();
const app = express();

// Middlewares obligatorios
app.use(cors()); // Permite que la web HTML conecte con la API
app.use(express.json()); // Permite recibir datos por POST en formato JSON

// ==========================================
// RUTAS (ENDPOINTS) DE LA API
// ==========================================

// Ruta GET: Obtener todos los empleados (Para la cuadrícula de la Intranet)
app.get('/api/empleados', async (req, res) => {
    try {
        const datos = await obtenerListaEmpleados();
        res.json({ exito: true, datos: datos });
    } catch (error) {
        console.error("Error en API /api/empleados:", error);
        res.status(500).json({ exito: false, mensaje: "Error interno del servidor", error: error.message });
    }
});

app.get('/api/proyectos', async (req, res) => {
    try {
        const datos = await obtenerProyectosEnCurso();
        res.json({ exito: true, datos: datos });
    } catch (error) {
        console.error("Error en API /api/proyectos:", error);
        res.status(500).json({ exito: false, mensaje: "Error interno del servidor", error: error.message });
    }
});

app.get('/api/tickets', async (req, res) => {
    try {
        const datos = await obtenertotalTickets();
        res.json({ exito: true, datos: datos });
    } catch (error) {
        console.error("Error en API /api/tickets:", error);
        res.status(500).json({ exito: false, mensaje: "Error interno del servidor", error: error.message });
    }
});


// Ruta GET: Obtener contadores para el Dashboard
app.get('/api/dashboard', async (req, res) => {
    try {
        const stats = await obtenerDashboardStats();
        res.json({ exito: true, datos: stats });
    } catch (error) {
        res.status(500).json({ exito: false, error: error.message });
    }
});

// Ruta POST: Ejecutar Transacción Crítica (Ej: Despido)
app.post('/api/transaccion/despedir', async (req, res) => {
    // La intranet enviará el ID del empleado por POST
    const { id_empleado, id_admin_ejecutor } = req.body;

    if (!id_empleado) {
        return res.status(400).json({ exito: false, mensaje: "Falta el ID del empleado" });
    }

    try {
        await transaccionDespedirEmpleado(id_empleado, id_admin_ejecutor);
        res.json({ exito: true, mensaje: "Transacción de despido ejecutada y guardada correctamente." });
    } catch (error) {
        res.status(500).json({ exito: false, mensaje: "LA TRANSACCIÓN FUE REVERTIDA (ROLLBACK)", error: error.message });
    }
});

// ==========================================
// ARRANQUE DEL SERVIDOR
// ==========================================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor API de la Empresa corriendo en: http://localhost:${PORT}`);
    console.log(`🔌 Conectando a Base de Datos en: ${process.env.DB_HOST}...`);
});

