const express = require('express');
const router = express.Router();
const Producto = require('../models/Producto');

// Obtener todos los productos
router.get('/', async (req, res) => {
  try {
    const productos = await Producto.find({ activo: true }).sort({ nombre: 1 });
    res.json(productos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener productos con stock bajo
router.get('/stock-bajo', async (req, res) => {
  try {
    const productos = await Producto.find({
      activo: true,
      $expr: { $lte: ['$stock', '$stockMinimo'] }
    }).sort({ stock: 1 });
    res.json(productos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener producto por ID
router.get('/:id', async (req, res) => {
  try {
    const producto = await Producto.findById(req.params.id);
    if (!producto) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.json(producto);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Crear nuevo producto
router.post('/', async (req, res) => {
  try {
    const producto = new Producto(req.body);
    await producto.save();
    res.status(201).json(producto);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Actualizar producto
router.put('/:id', async (req, res) => {
  try {
    const producto = await Producto.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!producto) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.json(producto);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Actualizar stock
router.patch('/:id/stock', async (req, res) => {
  try {
    const { cantidad, operacion } = req.body; // operacion: 'suma' o 'resta' o 'set'
    const producto = await Producto.findById(req.params.id);
    
    if (!producto) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    if (operacion === 'suma') {
      producto.stock += cantidad;
    } else if (operacion === 'resta') {
      producto.stock = Math.max(0, producto.stock - cantidad);
    } else if (operacion === 'set') {
      producto.stock = cantidad;
    }

    await producto.save();
    res.json(producto);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Eliminar producto (soft delete)
router.delete('/:id', async (req, res) => {
  try {
    const producto = await Producto.findByIdAndUpdate(
      req.params.id,
      { activo: false },
      { new: true }
    );
    if (!producto) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.json({ message: 'Producto eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;