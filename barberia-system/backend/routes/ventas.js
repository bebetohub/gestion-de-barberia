const express = require('express');
const router = express.Router();
const Venta = require('../models/Venta');
const Producto = require('../models/Producto');
const Cliente = require('../models/Cliente');

// Helper para crear rango de fecha en Bolivia
function getRangoFechaBolivia(fechaStr) {
  // fechaStr: "YYYY-MM-DD"
  const [year, month, day] = fechaStr.split('-').map(Number);
  const offset = -4; // Bolivia GMT-4

  const fechaInicio = new Date(Date.UTC(year, month - 1, day, 4, 0, 0)); // 00:00 Bolivia
  const fechaFin = new Date(Date.UTC(year, month - 1, day, 27, 59, 59, 999)); // 23:59:59 Bolivia

  return { fechaInicio, fechaFin };
}

// ======================
// Rutas
// ======================

// Obtener todas las ventas
router.get('/', async (req, res) => {
  try {
    const ventas = await Venta.find()
      .populate('cliente', 'nombre telefono')
      .populate('productos.producto', 'nombre')
      .sort({ fecha: -1 });
    
    res.json(ventas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener ventas por fecha (Bolivia)
router.get('/fecha/:fecha', async (req, res) => {
  try {
    const { fechaInicio, fechaFin } = getRangoFechaBolivia(req.params.fecha);

    const ventas = await Venta.find({
      fecha: { $gte: fechaInicio, $lte: fechaFin }
    })
      .populate('cliente', 'nombre telefono')
      .populate('productos.producto', 'nombre')
      .sort({ fecha: -1 });

    res.json(ventas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Crear nueva venta
router.post('/', async (req, res) => {
  try {
    const { cliente, productos, fecha } = req.body;

    // Validar cliente
    const clienteExiste = await Cliente.findById(cliente);
    if (!clienteExiste) return res.status(400).json({ error: 'Cliente no encontrado' });

    // Validar stock
    for (const item of productos) {
      const producto = await Producto.findById(item.producto);
      if (!producto) return res.status(400).json({ error: `Producto no encontrado: ${item.producto}` });
      if (producto.stock < item.cantidad) {
        return res.status(400).json({ error: `Stock insuficiente para ${producto.nombre}. Disponible: ${producto.stock}` });
      }
    }

    // Calcular total y actualizar stock
    let total = 0;
    const productosVenta = [];
    for (const item of productos) {
      const producto = await Producto.findById(item.producto);
      const subtotal = item.cantidad * item.precio;
      total += subtotal;

      productosVenta.push({
        producto: item.producto,
        cantidad: item.cantidad,
        precio: item.precio,
        subtotal
      });

      producto.stock -= item.cantidad;
      await producto.save();
    }

    // Fecha en Bolivia o actual si no se pasa
    const fechaVenta = fecha ? new Date(fecha) : new Date();
    
    const venta = new Venta({
      cliente,
      productos: productosVenta,
      total,
      fecha: fechaVenta
    });

    await venta.save();
    await venta.populate([
      { path: 'cliente', select: 'nombre telefono' },
      { path: 'productos.producto', select: 'nombre' }
    ]);

    res.status(201).json(venta);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Obtener venta por ID
router.get('/:id', async (req, res) => {
  try {
    const venta = await Venta.findById(req.params.id)
      .populate('cliente', 'nombre telefono')
      .populate('productos.producto', 'nombre');

    if (!venta) return res.status(404).json({ error: 'Venta no encontrada' });
    res.json(venta);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
