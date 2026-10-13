const express = require('express');
const router = express.Router();
const Barbero = require('../models/Barbero');

// Obtener todos los barberos
router.get('/', async (req, res) => {
  try {
    const barberos = await Barbero.find({ activo: true });
    res.json(barberos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener barbero por ID
router.get('/:id', async (req, res) => {
  try {
    const barbero = await Barbero.findById(req.params.id);
    if (!barbero) {
      return res.status(404).json({ error: 'Barbero no encontrado' });
    }
    res.json(barbero);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Crear nuevo barbero
router.post('/', async (req, res) => {
  try {
    const barbero = new Barbero(req.body);
    await barbero.save();
    res.status(201).json(barbero);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Actualizar barbero
router.put('/:id', async (req, res) => {
  try {
    const barbero = await Barbero.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!barbero) {
      return res.status(404).json({ error: 'Barbero no encontrado' });
    }
    res.json(barbero);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Eliminar barbero (soft delete)
router.delete('/:id', async (req, res) => {
  try {
    const barbero = await Barbero.findByIdAndUpdate(
      req.params.id,
      { activo: false },
      { new: true }
    );
    if (!barbero) {
      return res.status(404).json({ error: 'Barbero no encontrado' });
    }
    res.json({ message: 'Barbero eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
