const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use('/api/barberos', require('./routes/barberos'));
app.use('/api/clientes', require('./routes/clientes'));
app.use('/api/servicios', require('./routes/servicios'));
app.use('/api/citas', require('./routes/citas'));
app.use('/api/productos', require('./routes/productos'));
app.use('/api/ventas', require('./routes/ventas'));
app.use('/api/reportes', require('./routes/reportes'));

// Conexión a MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('Conectado a MongoDB'))
  .catch((err) => console.error('Error conectando a MongoDB:', err));

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ message: 'API de Barbería funcionando correctamente' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
