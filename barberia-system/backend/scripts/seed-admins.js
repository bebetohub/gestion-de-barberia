const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
require('dotenv').config();

const Usuario = require('../models/Usuario');
const usuarioValido = /^[a-zA-Z0-9_.-]{3,30}$/;
const passwordMaximoBytes = 72;

function leerAdministradores() {
  if (!process.env.INITIAL_ADMIN_USERS) {
    throw new Error('Configura al menos un usuario en INITIAL_ADMIN_USERS.');
  }

  let usuarios;
  try {
    usuarios = JSON.parse(process.env.INITIAL_ADMIN_USERS);
  } catch (error) {
    throw new Error('INITIAL_ADMIN_USERS debe contener un arreglo JSON válido.');
  }

  if (!Array.isArray(usuarios) || usuarios.length === 0) {
    throw new Error('Configura al menos un usuario en INITIAL_ADMIN_USERS.');
  }

  const nombres = new Set();
  for (const usuario of usuarios) {
    if (
      !usuario ||
      typeof usuario.usuario !== 'string' ||
      !usuarioValido.test(usuario.usuario.trim()) ||
      typeof usuario.password !== 'string' ||
      usuario.password.length < 8 ||
      Buffer.byteLength(usuario.password, 'utf8') > passwordMaximoBytes
    ) {
      throw new Error(
        'Cada administrador requiere usuario válido y contraseña de 8 caracteres o más (máximo 72 bytes).'
      );
    }

    usuario.usuario = usuario.usuario.trim().toLowerCase();
    if (nombres.has(usuario.usuario)) {
      throw new Error(`El usuario "${usuario.usuario}" aparece más de una vez.`);
    }
    nombres.add(usuario.usuario);
  }

  return usuarios;
}

async function quitarIndiceUnicoAntiguo() {
  await Usuario.init();
  const indices = await Usuario.collection.indexes();
  const indiceAnterior = indices.find(
    (indice) => indice.unique && indice.key.tipoCuenta === 1
  );
  if (indiceAnterior) {
    await Usuario.collection.dropIndex(indiceAnterior.name);
    console.log('Se actualizó el índice antiguo de tipoCuenta.');
  }
}

async function seedAdmins() {
  const usuarios = leerAdministradores();
  if (!process.env.MONGODB_URI) {
    throw new Error('Configura MONGODB_URI en backend/.env.');
  }

  await mongoose.connect(process.env.MONGODB_URI);
  await quitarIndiceUnicoAntiguo();

  let creados = 0;
  for (const datos of usuarios) {
    const existente = await Usuario.exists({ usuario: datos.usuario });
    if (existente) {
      console.log(`Se conserva el usuario existente "${datos.usuario}".`);
      continue;
    }

    await Usuario.create({
      usuario: datos.usuario,
      passwordHash: await bcrypt.hash(datos.password, 12),
    });
    creados += 1;
    console.log(`Administrador "${datos.usuario}" creado.`);
  }

  console.log(`Seeder completado. Administradores nuevos: ${creados}.`);
}

seedAdmins()
  .catch((error) => {
    console.error('No se pudieron crear los administradores:', error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
  });
