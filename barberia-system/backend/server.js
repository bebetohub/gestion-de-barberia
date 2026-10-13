const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const { MongoStore } = require('connect-mongo');
const requireAuth = require('./middleware/requireAuth');
const Usuario = require('./models/Usuario');
require('dotenv').config();

const app = express();

const sessionSecret = process.env.SESSION_SECRET;
function esSecretoDeEjemplo(secret) {
  return /^(replace-with|cambia-|changeme)/i.test(secret || '');
}

if (!sessionSecret || sessionSecret.length < 32 || esSecretoDeEjemplo(sessionSecret)) {
  throw new Error(
    'SESSION_SECRET debe configurarse en backend/.env con una clave privada aleatoria de al menos 32 caracteres; no uses el valor de ejemplo.'
  );
}
if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}

app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.json({ message: 'API de Barbería funcionando correctamente' });
});

async function iniciarServidor() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Conectado a MongoDB');

  const hayAdministradores = await Usuario.exists({
    tipoCuenta: 'administrador',
  });
  if (
    !hayAdministradores &&
    (!process.env.SETUP_SECRET ||
      process.env.SETUP_SECRET.length < 32 ||
      esSecretoDeEjemplo(process.env.SETUP_SECRET))
  ) {
    throw new Error(
      'No hay administradores registrados. Ejecuta npm run seed-admins o configura un SETUP_SECRET privado de al menos 32 caracteres para crear la cuenta inicial.'
    );
  }

  app.use(
    session({
      name: 'barberia.sid',
      secret: sessionSecret,
      resave: false,
      saveUninitialized: false,
      store: MongoStore.create({
        client: mongoose.connection.getClient(),
        collectionName: 'sessions',
        ttl: 8 * 60 * 60,
      }),
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 8 * 60 * 60 * 1000,
      },
    })
  );

  app.use('/api/auth', require('./routes/auth'));
  app.use('/api', requireAuth);
  app.use('/api/barberos', require('./routes/barberos'));
  app.use('/api/clientes', require('./routes/clientes'));
  app.use('/api/servicios', require('./routes/servicios'));
  app.use('/api/citas', require('./routes/citas'));
  app.use('/api/productos', require('./routes/productos'));
  app.use('/api/ventas', require('./routes/ventas'));
  app.use('/api/reportes', require('./routes/reportes'));

  const port = process.env.PORT || 5000;
  app.listen(port, () => {
    console.log(`Servidor corriendo en puerto ${port}`);
  });
}

iniciarServidor().catch((error) => {
  console.error('No se pudo iniciar el servidor:', error);
  process.exitCode = 1;
});
