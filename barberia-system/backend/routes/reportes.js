const express = require('express');
const router = express.Router();
const Cita = require('../models/Cita');
const Venta = require('../models/Venta');

// Función helper para rango del día en Bolivia (UTC-4) convertido a UTC
function rangoDiaBoliviaUTC(fechaStr) {
  const inicioBol = new Date(`${fechaStr}T00:00:00-04:00`);
  const finBol = new Date(`${fechaStr}T23:59:59.999-04:00`);

  return {
    inicio: new Date(inicioBol.toISOString()), // Convertir a UTC
    fin: new Date(finBol.toISOString()),       // Convertir a UTC
  };
}

// =======================
// Reporte diario
// =======================
router.get('/diario/:fecha', async (req, res) => {
  try {
    const { inicio, fin } = rangoDiaBoliviaUTC(req.params.fecha);

    // ======================
    // Citas del día
    // ======================
    const citas = await Cita.find({
      fecha: { $gte: inicio, $lte: fin }
    })
      .populate('cliente', 'nombre telefono')
      .populate('barbero', 'nombre')
      .populate('servicios.servicio', 'nombre')
      .sort({ hora: 1 });

    // ======================
    // Ventas del día
    // ======================
    const ventas = await Venta.find({
      fecha: { $gte: inicio, $lte: fin }
    })
      .populate('cliente', 'nombre telefono')
      .populate('productos.producto', 'nombre')
      .sort({ fecha: -1 });

    // ======================
    // Totales y estadísticas
    // ======================
    const totalCitas = citas.length;
    const citasCompletadas = citas.filter(c => c.estado === 'completada').length;
    const citasCanceladas = citas.filter(c => c.estado === 'cancelada').length;
    const citasProgramadas = citas.filter(c => c.estado === 'programada').length;

    const totalVentas = ventas.length;
    const ingresosCitas = citas
      .filter(c => c.estado === 'completada')
      .reduce((sum, c) => sum + c.total, 0);
    const ingresosVentas = ventas.reduce((sum, v) => sum + v.total, 0);
    const ingresosTotal = ingresosCitas + ingresosVentas;

    // Servicios más solicitados
    const serviciosStats = {};
    citas.forEach(c => {
      c.servicios.forEach(s => {
        const nombre = s.servicio.nombre;
        if (!serviciosStats[nombre]) serviciosStats[nombre] = { count: 0, ingresos: 0 };
        serviciosStats[nombre].count++;
        serviciosStats[nombre].ingresos += s.precio;
      });
    });

    // Productos más vendidos
    const productosStats = {};
    ventas.forEach(v => {
      v.productos.forEach(p => {
        const nombre = p.producto.nombre;
        if (!productosStats[nombre]) productosStats[nombre] = { cantidad: 0, ingresos: 0 };
        productosStats[nombre].cantidad += p.cantidad;
        productosStats[nombre].ingresos += p.subtotal;
      });
    });

    // Barberos más activos
    const barberosStats = {};
    citas.forEach(c => {
      const nombre = c.barbero.nombre;
      if (!barberosStats[nombre]) barberosStats[nombre] = { citas: 0, ingresos: 0 };
      barberosStats[nombre].citas++;
      if (c.estado === 'completada') barberosStats[nombre].ingresos += c.total;
    });

    res.json({
      fecha: req.params.fecha,
      resumen: {
        totalCitas,
        citasCompletadas,
        citasCanceladas,
        citasProgramadas,
        totalVentas,
        ingresosCitas,
        ingresosVentas,
        ingresosTotal
      },
      citas,
      ventas,
      estadisticas: {
        serviciosMasSolicitados: Object.entries(serviciosStats)
          .map(([nombre, data]) => ({ nombre, ...data }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5),
        productosMasVendidos: Object.entries(productosStats)
          .map(([nombre, data]) => ({ nombre, ...data }))
          .sort((a, b) => b.cantidad - a.cantidad)
          .slice(0, 5),
        barberosMasActivos: Object.entries(barberosStats)
          .map(([nombre, data]) => ({ nombre, ...data }))
          .sort((a, b) => b.citas - a.citas)
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
