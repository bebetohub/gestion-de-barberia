const mongoose = require('mongoose');

const barberoSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
      trim: true,
    },
    telefono: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    especialidades: [
      {
        type: String,
      },
    ],
    activo: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Barbero', barberoSchema);
