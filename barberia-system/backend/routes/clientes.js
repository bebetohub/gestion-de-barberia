const express = require('express');
const router = express.Router();
const Cliente = require('../models/Cliente');

// Obtener todos los clientes
router.get('/', async (req, res) => {
  try {
    const clientes = await Cliente.find().sort({ nombre: 1 });
    res.json(clientes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener cliente por ID
router.get('/:id', async (req, res) => {
  try {
    const cliente = await Cliente.findById(req.params.id);
    if (!cliente) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }
    res.json(cliente);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Crear nuevo cliente
router.post('/', async (req, res) => {
  try {
    const cliente = new Cliente(req.body);
    await cliente.save();
    res.status(201).json(cliente);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Actualizar cliente
router.put('/:id', async (req, res) => {
  try {
    const cliente = await Cliente.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!cliente) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }
    res.json(cliente);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Eliminar cliente
router.delete('/:id', async (req, res) => {
  try {
    const cliente = await Cliente.findByIdAndDelete(req.params.id);
    if (!cliente) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }
    res.json({ message: 'Cliente eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Buscar clientes por nombre o teléfono
router.get('/buscar/:term', async (req, res) => {
  try {
    const term = req.params.term;
    const clientes = await Cliente.find({
      $or: [
        { nombre: { $regex: term, $options: 'i' } },
        { telefono: { $regex: term, $options: 'i' } }
      ]
    });
    res.json(clientes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;