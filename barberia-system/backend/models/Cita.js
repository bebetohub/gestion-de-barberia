const mongoose = require('mongoose');

// Función que obtiene la fecha actual en Bolivia (UTC−4)
function fechaBolivia() {
  const ahora = new Date();
  const offsetMs = 4 * 60 * 60 * 1000; // 4 horas de diferencia
  return new Date(ahora.getTime() - offsetMs);
}

const citaSchema = new mongoose.Schema(
  {
    cliente: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Cliente',
      required: true,
    },
    barbero: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Barbero',
      required: true,
    },
    servicios: [
      {
        servicio: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Servicio',
          required: true,
        },
        precio: {
          type: Number,
          required: true,
        },
      },
    ],
    fecha: {
      type: Date,
      default: fechaBolivia, // Guarda la fecha con hora de Bolivia
      required: true,
    },
    hora: {
      type: String,
      required: true,
    },
    estado: {
      type: String,
      enum: ['programada', 'completada', 'cancelada'],
      default: 'programada',
    },
    notas: {
      type: String,
    },
    total: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Cita', citaSchema);
