const Usuario = require('../models/Usuario');

async function requireAuth(req, res, next) {
  try {
    if (!req.session.userId) {
      return res.status(401).json({ error: 'Debes iniciar sesión' });
    }

    const usuario = await Usuario.findById(req.session.userId).select(
      '_id usuario versionSesion'
    );

    if (!usuario || usuario.versionSesion !== req.session.versionSesion) {
      return req.session.destroy((error) => {
        if (error) return next(error);
        res.status(401).json({ error: 'La sesión ya no es válida' });
      });
    }

    req.usuario = usuario;
    next();
  } catch (error) {
    next(error);
  }
}

module.exports = requireAuth;
