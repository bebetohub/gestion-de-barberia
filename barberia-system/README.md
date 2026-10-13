# Sistema de Gestión para Barbería Mecha

Sistema completo de gestión para Barbería Mecha desarrollado con **Vue.js**, **Node.js** y **MongoDB**. Permite gestionar barberos, clientes, servicios, citas, inventario, ventas y generar reportes diarios.

## 🚀 Características

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
- MongoDB (local o cloud)
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
Edita el archivo `.env`:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/barberia
NODE_ENV=development
```

**Iniciar el servidor:**

```bash
npm run dev
# o
npm start
```

El backend estará disponible en `http://localhost:5000`

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
