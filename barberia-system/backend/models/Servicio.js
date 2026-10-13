const mongoose = require('mongoose');

const servicioSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  descripcion: {
    type: String
  },
  precio: {
    type: Number,
    required: true
  },
  duracion: {
    type: Number, // en minutos
    required: true
  },
  activo: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Servicio', servicioSchema);