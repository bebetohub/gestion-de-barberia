const mongoose = require('mongoose');

const clienteSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  telefono: {
    type: String,
    required: true
  },
  email: {
    type: String
  },
  fechaNacimiento: {
    type: Date
  },
  notas: {
    type: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Cliente', clienteSchema);