# Sistema de Gestión para Barbería Mecha

Sistema completo de gestión para Barbería Mecha desarrollado con **Vue.js**, **Node.js** y **MongoDB**. Permite gestionar barberos, clientes, servicios, citas, inventario, ventas y generar reportes diarios.

## 🚀 Características

### Acceso y seguridad

- ✅ Inicio de sesión de administrador con usuario y contraseña
- ✅ Creación de una sola cuenta inicial al configurar el sistema
- ✅ Sesiones seguras guardadas en MongoDB
- ✅ Cambio de contraseña y cierre de sesión
- ✅ Rutas del frontend y endpoints de gestión protegidos

### Gestión de Personal

- ✅ Registro y gestión de barberos
- ✅ Asignación de especialidades
- ✅ Control de estado (activo/inactivo)

### Gestión de Clientes

- ✅ Registro completo de clientes
- ✅ Búsqueda por nombre y teléfono
- ✅ Historial de citas y notas

### Sistema de Citas

- ✅ Programación de citas con barberos específicos
- ✅ Selección múltiple de servicios
- ✅ Control de estados (programada, completada, cancelada)
- ✅ Cálculo automático de totales

### Gestión de Servicios

- ✅ Catálogo de servicios con precios
- ✅ Control de duración y descripción
- ✅ Gestión de estado activo/inactivo

### Inventario

- ✅ Gestión completa de productos
- ✅ Control de stock en tiempo real
- ✅ Alertas de stock bajo
- ✅ Categorización de productos
- ✅ Ajustes de inventario

### Ventas

- ✅ Registro de ventas de productos
- ✅ Actualización automática de stock
- ✅ Asociación con clientes
- ✅ Control de inventario disponible

### Reportes

- ✅ Reporte diario completo
- ✅ Estadísticas de ventas y citas
- ✅ Productos más vendidos
- ✅ Servicios más solicitados
- ✅ Barberos más activos
- ✅ Exportación e impresión

## 🛠️ Tecnologías Utilizadas

### Backend

- **Node.js** con Express.js
- **MongoDB** con Mongoose
- **CORS** para comunicación con frontend
- API REST completa

### Frontend

- **Vue.js 3** con Composition API
- **Vue Router** para navegación
- **Tailwind CSS** para estilos
- **Axios** para peticiones HTTP
- Diseño responsivo

### Base de Datos

- **MongoDB** con colecciones relacionadas
- Modelos optimizados con validaciones
- Índices para búsquedas eficientes

## 📦 Instalación

### Requisitos Previos

- Node.js (versión 16 o superior)
- Docker Desktop para MongoDB local, o una instancia de MongoDB Atlas
- npm o yarn

### 1. Clonar el repositorio

```bash
git clone <url-del-repositorio>
cd barberia-system
```

### 2. Configurar el Backend

```bash
cd backend
npm install
```

**Configurar variables de entorno:**
Copia `backend/.env.example` como `backend/.env` (si ya existe, conserva sus claves y agrega las que faltan) y configura las variables:

```env
PORT=5000
MONGODB_URI=mongodb://barberia_admin:TU_PASSWORD_HEX@127.0.0.1:27017/barberia?authSource=admin
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
SESSION_SECRET=una-clave-aleatoria-secreta-de-al-menos-32-caracteres
SETUP_SECRET=otra-clave-aleatoria-distinta-de-al-menos-32-caracteres
MONGO_ROOT_USERNAME=barberia_admin
MONGO_ROOT_PASSWORD=TU_PASSWORD_HEX
INITIAL_ADMIN_USERS=[{"usuario":"admin","password":"CAMBIAR_POR_UNA_CLAVE_SEGURA"},{"usuario":"operador","password":"OTRA_CLAVE_SEGURA"}]
```

Usa claves secretas distintas en cada instalación. Genera claves aleatorias con Node.js; utiliza una para cada secreto y una para la contraseña de MongoDB. No dejes los valores de ejemplo en `SESSION_SECRET` o `SETUP_SECRET`. `SETUP_SECRET` solo es obligatoria si se va a crear la primera cuenta desde la pantalla de configuración; si usas `npm run seed-admins`, puedes omitirla después de crear los administradores.

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Reemplaza `TU_PASSWORD_HEX` por la misma clave aleatoria en `MONGODB_URI` y `MONGO_ROOT_PASSWORD`. Deja una sola definición de `MONGODB_URI`; debe ser la URL autenticada y su contraseña debe coincidir con la que se usó al crear el usuario de MongoDB en Docker. Configura `INITIAL_ADMIN_USERS` como un arreglo JSON de usuarios distintos; no dejes las contraseñas de ejemplo. El seeder crea los que falten, conserva cuentas existentes y nunca imprime sus contraseñas. Si cambias la contraseña en ese arreglo después de crear una cuenta, el seeder no cambiará la contraseña existente: cámbiala desde el sistema.

Si ya mostraste una contraseña real en un chat o captura, considérala expuesta y rótala. Cambiar `MONGO_ROOT_PASSWORD` en `.env` por sí solo no cambia la contraseña del usuario dentro de un volumen de MongoDB ya inicializado; primero hay que actualizar ese usuario en MongoDB y luego cambiar el valor en `.env`.

### 3. Iniciar MongoDB con Docker

Requisito: Docker Desktop instalado y ejecutándose. Desde la carpeta `barberia-system`, inicia MongoDB:

```bash
docker compose --env-file backend/.env up -d mongo
docker compose --env-file backend/.env ps
```

El servicio publica MongoDB solo en `127.0.0.1:27017` y conserva los datos en el volumen `barberia_mongo_data`, incluso si se detiene el contenedor. Para detener MongoDB sin borrar los datos:

```bash
docker compose --env-file backend/.env down
```

**Iniciar el servidor:**

```bash
cd backend
npm install
npm run seed-admins
npm run dev
# o
npm start
```

El seeder es repetible: crea los administradores configurados que todavía no existen y no cambia sus contraseñas si ya fueron creados. El backend estará disponible en `http://localhost:5000`.

### 3. Configurar el Frontend

```bash
cd ../frontend
npm install
```

**Iniciar la aplicación:**

```bash
npm run dev
```

El frontend estará disponible en `http://localhost:3000`

En el primer acceso, inicia sesión con una de las cuentas del seeder. También se conserva la opción de crear una cuenta inicial usando la `SETUP_SECRET` si todavía no hay administradores. Todas las cuentas actuales son administradores con acceso completo; no existe un registro público de usuarios. Desde el menú se puede cambiar la contraseña o cerrar sesión.

## 🗄️ Estructura de la Base de Datos

### Colecciones

#### Barberos

```javascript
{
  nombre: String,
  telefono: String,
  email: String,
  especialidades: [String],
  activo: Boolean
}
```

#### Clientes

```javascript
{
  nombre: String,
  telefono: String,
  email: String,
  fechaNacimiento: Date,
  notas: String
}
```

#### Servicios

```javascript
{
  nombre: String,
  descripcion: String,
  precio: Number,
  duracion: Number, // en minutos
  activo: Boolean
}
```

#### Citas

```javascript
{
  cliente: ObjectId,
  barbero: ObjectId,
  servicios: [{
    servicio: ObjectId,
    precio: Number
  }],
  fecha: Date,
  hora: String,
  estado: String, // programada, completada, cancelada
  notas: String,
  total: Number
}
```

#### Productos

```javascript
{
  nombre: String,
  descripcion: String,
  precio: Number,
  stock: Number,
  stockMinimo: Number,
  categoria: String,
  activo: Boolean
}
```

#### Ventas

```javascript
{
  cliente: ObjectId,
  productos: [{
    producto: ObjectId,
    cantidad: Number,
    precio: Number,
    subtotal: Number
  }],
  total: Number,
  fecha: Date
}
```

## 🔄 API Endpoints

### Autenticación

- `GET /api/auth/setup-status` - Verificar si es necesario crear la cuenta inicial
- `POST /api/auth/setup` - Crear la cuenta inicial (requiere `SETUP_SECRET`)
- `POST /api/auth/login` - Iniciar sesión
- `GET /api/auth/session` - Consultar la sesión actual
- `POST /api/auth/change-password` - Cambiar la contraseña de la cuenta autenticada
- `POST /api/auth/logout` - Cerrar sesión

Para provisionar administradores, configurar `INITIAL_ADMIN_USERS` en `backend/.env` y ejecutar `npm run seed-admins` desde `backend`.

Todas las rutas de gestión que siguen requieren una sesión iniciada.

### Barberos

- `GET /api/barberos` - Listar barberos
- `POST /api/barberos` - Crear barbero
- `PUT /api/barberos/:id` - Actualizar barbero
- `DELETE /api/barberos/:id` - Eliminar barbero

### Clientes

- `GET /api/clientes` - Listar clientes
- `GET /api/clientes/buscar/:term` - Buscar clientes
- `POST /api/clientes` - Crear cliente
- `PUT /api/clientes/:id` - Actualizar cliente
- `DELETE /api/clientes/:id` - Eliminar cliente

### Servicios

- `GET /api/servicios` - Listar servicios
- `POST /api/servicios` - Crear servicio
- `PUT /api/servicios/:id` - Actualizar servicio
- `DELETE /api/servicios/:id` - Eliminar servicio

### Citas

- `GET /api/citas` - Listar todas las citas
- `GET /api/citas/fecha/:fecha` - Citas por fecha
- `POST /api/citas` - Crear cita
- `PUT /api/citas/:id` - Actualizar cita
- `PATCH /api/citas/:id/estado` - Cambiar estado
- `DELETE /api/citas/:id` - Eliminar cita

### Productos

- `GET /api/productos` - Listar productos
- `GET /api/productos/stock-bajo` - Productos con stock bajo
- `POST /api/productos` - Crear producto
- `PUT /api/productos/:id` - Actualizar producto
- `PATCH /api/productos/:id/stock` - Ajustar stock
- `DELETE /api/productos/:id` - Eliminar producto

### Ventas

- `GET /api/ventas` - Listar ventas
- `GET /api/ventas/fecha/:fecha` - Ventas por fecha
- `POST /api/ventas` - Crear venta
- `GET /api/ventas/:id` - Obtener venta

### Reportes

- `GET /api/reportes/diario/:fecha` - Reporte diario completo

## 🎯 Uso del Sistema

### 1. Configuración Inicial

1. Registrar barberos en el sistema
2. Crear catálogo de servicios con precios
3. Agregar productos al inventario
4. Registrar clientes

### 2. Operación Diaria

1. **Citas**: Programar citas seleccionando cliente, barbero, servicios y horario
2. **Ventas**: Registrar ventas de productos con actualización automática de stock
3. **Estados**: Actualizar el estado de las citas según se completen
4. **Inventario**: Monitorear alertas de stock bajo

### 3. Reportes

1. Acceder a la sección de reportes
2. Seleccionar la fecha deseada
3. Revisar el resumen diario completo
4. Exportar o imprimir según necesidad

## 🔧 Características Técnicas

### Validaciones

- Validación de stock antes de ventas
- Verificación de datos requeridos
- Control de estados consistentes
- Sesión obligatoria para las rutas de gestión del backend
- Contraseñas almacenadas como hash, nunca en texto plano

### Actualizaciones en Tiempo Real

- Stock se actualiza automáticamente con las ventas
- Cálculos automáticos de totales
- Estados sincronizados

### Interfaz Responsiva

- Adaptable a dispositivos móviles
- Navegación intuitiva
- Diseño moderno con Tailwind CSS

### Gestión de Errores

- Manejo de errores en frontend y backend
- Mensajes informativos para el usuario
- Validaciones del lado del servidor

## 🤝 Contribución

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crea un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

## 🐛 Reporte de Problemas

Si encuentras algún problema o tienes sugerencias, por favor crea un issue en el repositorio.

## 📞 Soporte

Para soporte adicional o preguntas sobre el sistema, puedes contactar al desarrollador.

---

**Sistema desarrollado por:** MiniMax Agent
**Fecha:** 2025
**Versión:** 1.0.0
