const mongoose = require('mongoose');
const Servicio = require('./models/Servicio');
const Producto = require('./models/Producto');
require('dotenv').config();

// Datos de ejemplo
const serviciosEjemplo = [
  {
    nombre: 'Corte de Cabello',
    descripcion: 'Corte de cabello con tijera y máquina',
    precio: 25,
    duracion: 30,
    activo: true,
  },
  {
    nombre: 'Arreglo de Barba',
    descripcion: 'Recorte y perfilado de barba',
    precio: 15,
    duracion: 20,
    activo: true,
  },
  {
    nombre: 'Corte + Barba',
    descripcion: 'Servicio completo de corte y barba',
    precio: 35,
    duracion: 45,
    activo: true,
  },
  {
    nombre: 'Lavado de Cabello',
    descripcion: 'Lavado con shampoo premium',
    precio: 10,
    duracion: 15,
    activo: true,
  },
  {
    nombre: 'Tinte de Cabello',
    descripcion: 'Aplicación de tinte',
    precio: 45,
    duracion: 60,
    activo: true,
  },
];

const productosEjemplo = [
  {
    nombre: 'Shampoo Anticaspa',
    descripcion: 'Shampoo especial para caspa 500ml',
    precio: 15,
    stock: 20,
    stockMinimo: 5,
    categoria: 'Cuidado Capilar',
    activo: true,
  },
  {
    nombre: 'Cera para Cabello',
    descripcion: 'Cera modeladora extra fuerte 100g',
    precio: 12,
    stock: 15,
    stockMinimo: 3,
    categoria: 'Estilizado',
    activo: true,
  },
  {
    nombre: 'Aceite para Barba',
    descripcion: 'Aceite nutritivo para barba 50ml',
    precio: 18,
    stock: 10,
    stockMinimo: 2,
    categoria: 'Cuidado de Barba',
    activo: true,
  },
  {
    nombre: 'Gel Fijador',
    descripcion: 'Gel fijador extra fuerte 250ml',
    precio: 8,
    stock: 25,
    stockMinimo: 5,
    categoria: 'Estilizado',
    activo: true,
  },
  {
    nombre: 'Loción After Shave',
    descripcion: 'Loción refrescante post afeitado',
    precio: 14,
    stock: 12,
    stockMinimo: 3,
    categoria: 'Cuidado de Barba',
    activo: true,
  },
];

async function inicializarDatos() {
  try {
    // Conectar a la base de datos
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Conectado a MongoDB');

    // Verificar si ya existen datos
    const serviciosExistentes = await Servicio.countDocuments();
    const productosExistentes = await Producto.countDocuments();

    if (serviciosExistentes === 0) {
      console.log('Insertando servicios de ejemplo...');
      await Servicio.insertMany(serviciosEjemplo);
      console.log(`✅ Se insertaron ${serviciosEjemplo.length} servicios`);
    } else {
      console.log(
        `ℹ️  Ya existen ${serviciosExistentes} servicios en la base de datos`
      );
    }

    if (productosExistentes === 0) {
      console.log('Insertando productos de ejemplo...');
      await Producto.insertMany(productosEjemplo);
      console.log(`✅ Se insertaron ${productosEjemplo.length} productos`);
    } else {
      console.log(
        `ℹ️  Ya existen ${productosExistentes} productos en la base de datos`
      );
    }

    console.log('\n🎉 Inicialización completada!');
    console.log('\nPuedes comenzar a usar el sistema:');
    console.log('1. Agrega barberos en la sección correspondiente');
    console.log('2. Registra clientes');
    console.log('3. Programa citas');
    console.log('4. Realiza ventas');
    console.log('5. Consulta reportes');
  } catch (error) {
    console.error('Error inicializando datos:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\nConexión cerrada.');
  }
}

inicializarDatos();
