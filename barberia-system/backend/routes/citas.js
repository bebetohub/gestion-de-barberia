const express = require('express');
const router = express.Router();
const Cita = require('../models/Cita');

// =======================
// Helper: rango del día en Bolivia
// =======================
function rangoDiaBolivia(fechaStr) {
  // fechaStr = 'YYYY-MM-DD'
  const inicio = new Date(`${fechaStr}T00:00:00-04:00`);
  const fin = new Date(`${fechaStr}T23:59:59.999-04:00`);
  return { inicio, fin };
}

// =======================
// Obtener todas las citas
// =======================
router.get('/', async (req, res) => {
  try {
    const citas = await Cita.find()
      .populate('cliente', 'nombre telefono')
      .populate('barbero', 'nombre')
      .populate('servicios.servicio', 'nombre')
      .sort({ fecha: -1, hora: 1 });
    res.json(citas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// =======================
// Obtener citas por fecha
// =======================
router.get('/fecha/:fecha', async (req, res) => {
  try {
    const { inicio, fin } = rangoDiaBolivia(req.params.fecha);

    const citas = await Cita.find({
      fecha: { $gte: inicio, $lte: fin }
    })
      .populate('cliente', 'nombre telefono')
      .populate('barbero', 'nombre')
      .populate('servicios.servicio', 'nombre')
      .sort({ hora: 1 });

    res.json(citas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// =======================
// Crear nueva cita
// =======================
router.post('/', async (req, res) => {
  try {
    const cita = new Cita(req.body);
    await cita.save();
    await cita.populate([
      { path: 'cliente', select: 'nombre telefono' },
      { path: 'barbero', select: 'nombre' },
      { path: 'servicios.servicio', select: 'nombre' }
    ]);
    res.status(201).json(cita);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// =======================
// Actualizar cita
// =======================
router.put('/:id', async (req, res) => {
  try {
    const cita = await Cita.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
      .populate('cliente', 'nombre telefono')
      .populate('barbero', 'nombre')
      .populate('servicios.servicio', 'nombre');

    if (!cita) return res.status(404).json({ error: 'Cita no encontrada' });
    res.json(cita);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// =======================
// Cambiar estado de cita
// =======================
router.patch('/:id/estado', async (req, res) => {
  try {
    const { estado } = req.body;
    const cita = await Cita.findByIdAndUpdate(
      req.params.id,
      { estado },
      { new: true }
    )
      .populate('cliente', 'nombre telefono')
      .populate('barbero', 'nombre')
      .populate('servicios.servicio', 'nombre');

    if (!cita) return res.status(404).json({ error: 'Cita no encontrada' });
    res.json(cita);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// =======================
// Eliminar cita
// =======================
router.delete('/:id', async (req, res) => {
  try {
    const cita = await Cita.findByIdAndDelete(req.params.id);
    if (!cita) return res.status(404).json({ error: 'Cita no encontrada' });
    res.json({ message: 'Cita eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
