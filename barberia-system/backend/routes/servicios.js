const express = require('express');
const router = express.Router();
const Servicio = require('../models/Servicio');

// Obtener todos los servicios
router.get('/', async (req, res) => {
  try {
    const servicios = await Servicio.find({ activo: true }).sort({ nombre: 1 });
    res.json(servicios);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener servicio por ID
router.get('/:id', async (req, res) => {
  try {
    const servicio = await Servicio.findById(req.params.id);
    if (!servicio) {
      return res.status(404).json({ error: 'Servicio no encontrado' });
    }
    res.json(servicio);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Crear nuevo servicio
router.post('/', async (req, res) => {
  try {
    const servicio = new Servicio(req.body);
    await servicio.save();
    res.status(201).json(servicio);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Actualizar servicio
router.put('/:id', async (req, res) => {
  try {
    const servicio = await Servicio.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!servicio) {
      return res.status(404).json({ error: 'Servicio no encontrado' });
    }
    res.json(servicio);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Eliminar servicio (soft delete)
router.delete('/:id', async (req, res) => {
  try {
    const servicio = await Servicio.findByIdAndUpdate(
      req.params.id,
      { activo: false },
      { new: true }
    );
    if (!servicio) {
      return res.status(404).json({ error: 'Servicio no encontrado' });
    }
    res.json({ message: 'Servicio eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;