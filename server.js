const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json()); // Permite recibir datos en formato JSON

// ---- BASE DE DATOS EN MEMORIA (SIMULADA) ----
let visitantes = [
    { id: 1, documento: "10203040", nombre: "Carlos Mendoza", telefono: "3001234567" }
];

let ingresos = [
    { id: 1, visitanteId: 1, areaDestino: "Urgencias", fechaEntrada: new Date(), fechaSalida: null, estado: "Dentro" }
];

// ---- ENDPOINTS: VISITANTES ----

// 1. Registrar un visitante nuevo
app.post('/api/v1/visitantes', (req, res) => {
    const { documento, nombre, telefono } = req.body;
    if (!documento || !nombre) {
        return res.status(400).json({ ok: false, mensaje: "Documento y nombre requeridos." });
    }
    const existe = visitantes.find(v => v.documento === documento);
    if (existe) {
        return res.status(400).json({ ok: false, mensaje: "El visitante ya está registrado." });
    }
    const nuevoVisitante = { id: visitantes.length + 1, documento, nombre, telefono };
    visitantes.push(nuevoVisitante);
    res.status(201).json({ ok: true, mensaje: "Visitante registrado", data: nuevoVisitante });
});

// 2. Buscar visitante por documento
app.get('/api/v1/visitantes/:documento', (req, res) => {
    const visitante = visitantes.find(v => v.documento === req.params.documento);
    if (!visitor) return res.status(404).json({ ok: false, mensaje: "Visitante no encontrado." });
    res.status(200).json({ ok: true, data: visitante });
});

// ---- ENDPOINTS: CONTROL DE INGRESOS Y SALIDAS ----

// 3. Registrar entrada (Check-in)
app.post('/api/v1/ingresos', (req, res) => {
    const { visitanteId, areaDestino } = req.body;
    if (!visitanteId || !areaDestino) return res.status(400).json({ ok: false, mensaje: "Datos incompletos." });
    
    const yaAdentro = ingresos.find(i => i.visitanteId === visitanteId && i.estado === "Dentro");
    if (yaAdentro) return res.status(400).json({ ok: false, mensaje: "El visitante ya está adentro." });

    const nuevoIngreso = {
        id: ingresos.length + 1,
        visitanteId,
        areaDestino,
        fechaEntrada: new Date(),
        fechaSalida: null,
        estado: "Dentro"
    };
    ingresos.push(nuevoIngreso);
    res.status(201).json({ ok: true, mensaje: "Ingreso autorizado", data: nuevoIngreso });
});

// 4. Listar personas actualmente adentro
app.get('/api/v1/ingresos/activos', (req, res) => {
    const activos = ingresos.filter(i => i.estado === "Dentro");
    res.status(200).json({ ok: true, total: activos.length, data: activos });
});

// 5. Registrar salida (Check-out)
app.put('/api/v1/ingresos/:id/salida', (req, res) => {
    const ingreso = ingresos.find(i => i.id === parseInt(req.params.id));
    if (!ingreso || ingreso.estado === "Afuera") {
        return res.status(404).json({ ok: false, mensaje: "Ingreso no válido o ya finalizado." });
    }
    ingreso.fechaSalida = new Date();
    ingreso.estado = "Afuera";
    res.status(200).json({ ok: true, mensaje: "Salida registrada con éxito.", data: ingreso });
});

// Ejecución
const PORT = 3000;
app.listen(PORT, () => console.log(`API Centro de Salud en http://localhost:${PORT}`));
