const express = require('express');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const Usuario = require('../models/Usuario');
const requireAuth = require('../middleware/requireAuth');

const router = express.Router();
const usuarioValido = /^[a-zA-Z0-9_.-]{3,30}$/;
const passwordMinimo = 8;
const passwordMaximoBytes = 72;

function validarCredenciales(usuario, password) {
  if (typeof usuario !== 'string' || !usuarioValido.test(usuario.trim())) {
    return 'El usuario debe tener entre 3 y 30 caracteres: letras, números, punto, guion o guion bajo.';
  }
  if (
    typeof password !== 'string' ||
    password.length < passwordMinimo ||
    Buffer.byteLength(password, 'utf8') > passwordMaximoBytes
  ) {
    return 'La contraseña debe tener al menos 8 caracteres y no superar 72 bytes.';
  }
  return null;
}

function usuarioPublico(usuario) {
  return { id: usuario._id, usuario: usuario.usuario };
}

function regenerarSesion(req) {
  return new Promise((resolve, reject) => {
    req.session.regenerate((error) => (error ? reject(error) : resolve()));
  });
}

function guardarSesion(req) {
  return new Promise((resolve, reject) => {
    req.session.save((error) => (error ? reject(error) : resolve()));
  });
}

router.get('/setup-status', async (req, res, next) => {
  try {
    const configurado = await Usuario.exists({ tipoCuenta: 'administrador' });
    res.json({ setupRequired: !configurado });
  } catch (error) {
    next(error);
  }
});

router.post('/setup', async (req, res, next) => {
  try {
    const { usuario, password, setupSecret } = req.body;
    const expectedSecret = process.env.SETUP_SECRET;
    if (
      typeof setupSecret !== 'string' ||
      !expectedSecret ||
      /^(replace-with|cambia-|changeme)/i.test(expectedSecret) ||
      Buffer.byteLength(setupSecret) !== Buffer.byteLength(expectedSecret) ||
      !crypto.timingSafeEqual(Buffer.from(setupSecret), Buffer.from(expectedSecret))
    ) {
      return res.status(403).json({ error: 'La clave de configuración inicial es incorrecta.' });
    }

    const validationError = validarCredenciales(usuario, password);
    if (validationError) return res.status(400).json({ error: validationError });

    const configurado = await Usuario.exists({ tipoCuenta: 'administrador' });
    if (configurado) {
      return res.status(409).json({ error: 'La cuenta inicial ya fue creada.' });
    }

    const account = await Usuario.create({
      usuario: usuario.trim().toLowerCase(),
      passwordHash: await bcrypt.hash(password, 12),
    });

    await iniciarSesion(req, account);
    res.status(201).json({ user: usuarioPublico(account) });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ error: 'La cuenta inicial ya fue creada.' });
    }
    next(error);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const { usuario, password } = req.body;
    if (
      typeof usuario !== 'string' ||
      typeof password !== 'string' ||
      Buffer.byteLength(password, 'utf8') > passwordMaximoBytes
    ) {
      return res.status(400).json({ error: 'Ingresa usuario y contraseña.' });
    }

    const account = await Usuario.findOne({
      usuario: usuario.trim().toLowerCase(),
    }).select('+passwordHash');

    if (!account || !(await bcrypt.compare(password, account.passwordHash))) {
      return res.status(401).json({ error: 'Usuario o contraseña incorrectos.' });
    }

    await iniciarSesion(req, account);
    res.json({ user: usuarioPublico(account) });
  } catch (error) {
    next(error);
  }
});

router.get('/session', requireAuth, (req, res) => {
  res.json({ user: usuarioPublico(req.usuario) });
});

router.post('/change-password', requireAuth, async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (typeof currentPassword !== 'string') {
      return res.status(400).json({ error: 'Ingresa la contraseña actual.' });
    }
    const validationError = validarCredenciales(req.usuario.usuario, newPassword);
    if (validationError) return res.status(400).json({ error: validationError });
    if (currentPassword === newPassword) {
      return res.status(400).json({
        error: 'La nueva contraseña debe ser diferente a la actual.',
      });
    }

    const account = await Usuario.findById(req.usuario._id).select('+passwordHash');
    if (!(await bcrypt.compare(currentPassword, account.passwordHash))) {
      return res.status(400).json({ error: 'La contraseña actual es incorrecta.' });
    }

    account.passwordHash = await bcrypt.hash(newPassword, 12);
    account.versionSesion += 1;
    await account.save();
    await iniciarSesion(req, account);

    res.json({ message: 'Contraseña actualizada correctamente.' });
  } catch (error) {
    next(error);
  }
});

router.post('/logout', (req, res, next) => {
  req.session.destroy((error) => {
    if (error) return next(error);
    res.clearCookie('barberia.sid', {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });
    res.status(204).end();
  });
});

async function iniciarSesion(req, account) {
  await regenerarSesion(req);
  req.session.userId = account._id.toString();
  req.session.versionSesion = account.versionSesion;
  await guardarSesion(req);
}

module.exports = router;
