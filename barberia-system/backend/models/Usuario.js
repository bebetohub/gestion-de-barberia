const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema(
  {
    usuario: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      minlength: 3,
      maxlength: 30,
    },
    passwordHash: {
      type: String,
      required: true,
      select: false,
    },
    tipoCuenta: {
      type: String,
      enum: ['administrador'],
      default: 'administrador',
    },
    versionSesion: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Usuario', usuarioSchema);
