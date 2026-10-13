# 🚀 Inicio Rápido - Sistema de Gestión para Barbería Mecha

## ⚡ Instalación Express (5 minutos)

### 1. Requisitos Previos
- ✅ Node.js instalado (versión 16+)
- ✅ Docker Desktop instalado y corriendo
- ✅ Terminal/CMD abierto

### 2. Instalación Automática
```bash
# 1. Navegar al directorio del proyecto
cd barberia-system

# 2. Instalar dependencias de ambos proyectos
npm run install-all
```

### 3. Configurar variables del backend

Copia `backend/.env.example` como `backend/.env` (si ya existe, conserva sus valores) y configura secretos diferentes, credenciales de MongoDB e iniciales de administrador. Genera claves aleatorias con:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Utiliza una clave hexadecimal para `MONGO_ROOT_PASSWORD` y cópiala también en `MONGODB_URI`. Configura `SESSION_SECRET` con una clave segura. `SETUP_SECRET` solo hace falta si vas a crear la primera cuenta desde la pantalla de configuración; al usar el seeder y crear al menos un usuario, el backend puede arrancar sin ella. Define `INITIAL_ADMIN_USERS` como un arreglo JSON con al menos un usuario, por ejemplo:

```env
INITIAL_ADMIN_USERS=[{"usuario":"admin","password":"CAMBIAR_POR_UNA_CLAVE_SEGURA"},{"usuario":"operador","password":"OTRA_CLAVE_SEGURA"}]
```

No uses esas contraseñas de ejemplo: cámbialas antes de ejecutar el seeder.

En `backend/.env` debe haber una sola línea `MONGODB_URI`, con autenticación y la misma contraseña configurada en `MONGO_ROOT_PASSWORD`. No dejes espacios entre el nombre de la variable y `=`. Cambia los secretos de ejemplo; el servidor rechaza el `SESSION_SECRET` de ejemplo. Si una contraseña real se compartió en un chat o captura, rótala. En una base Docker ya creada, modificar `MONGO_ROOT_PASSWORD` en `.env` no cambia la contraseña guardada dentro de MongoDB.

### 4. Iniciar MongoDB

```bash
docker compose --env-file backend/.env up -d mongo
```

Docker conserva los datos en el volumen `barberia_mongo_data`. Para detener MongoDB sin borrar la base de datos:

```bash
docker compose --env-file backend/.env down
```

### 5. Cargar datos de ejemplo y crear administradores

```bash
cd backend
npm run init-data
npm run seed-admins
```

El seeder puede ejecutarse otra vez: crea solo los usuarios que todavía no existen y no cambia las contraseñas existentes.

Si el backend muestra `Conectado a MongoDB` pero luego falla con `MongoStore.create is not a function`, actualiza las dependencias con `npm install` desde `backend` y reinicia `npm run dev`. No es necesario recrear el contenedor de MongoDB para ese error: es una importación del almacén de sesiones, no una falla de la base de datos.

### 6. Iniciar el Sistema
```bash
# Desde la carpeta raíz, ejecutar ambos servidores:
cd ..
npm run dev
```

**¡Listo!** 🎉

- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:5000

Inicia sesión con una de las cuentas configuradas en `INITIAL_ADMIN_USERS`. Si no se ejecutó el seeder y aún no existe un administrador, puedes crear la cuenta inicial con `SETUP_SECRET`. Luego podrás cambiar la contraseña y cerrar sesión desde el menú.

---

## 🔧 Comandos Útiles

### Para desarrollo
```bash
# Instalar todas las dependencias
npm run install-all

# Ejecutar backend y frontend simultáneamente
npm run dev

# Solo backend
npm run dev-backend

# Solo frontend  
npm run dev-frontend

# Inicializar datos de ejemplo
cd backend && npm run init-data

# Crear los administradores declarados en INITIAL_ADMIN_USERS
npm run seed-admins
```

### Para producción
```bash
# Construir frontend
npm run build-frontend

# Iniciar backend en producción
npm run start-backend
```

---

## 📱 Primeros Pasos en el Sistema

### 1. Configuración Inicial (5 min)
1. Abrir http://localhost:3000 e iniciar sesión con una cuenta del seeder (o configurar la primera cuenta si todavía no se ejecutó)
2. Ir a **"Barberos"** → Agregar barberos del negocio
3. Ir a **"Servicios"** → Revisar/ajustar precios de servicios
4. Ir a **"Productos"** → Revisar/ajustar inventario

### 2. Operación Diaria
1. **"Clientes"** → Registrar clientes nuevos
2. **"Citas"** → Programar citas del día
3. **"Ventas"** → Registrar ventas de productos
4. **"Reportes"** → Ver resumen del día

---

## 🆘 Solución de Problemas

### MongoDB no conecta
```bash
# Verificar que MongoDB esté corriendo
mongod

# O usar MongoDB Compass / Atlas en la nube
# Editar backend/.env con tu URL de conexión
```

### Puerto en uso
```bash
# Si el puerto 3000 o 5000 están ocupados:
# Frontend: editar frontend/vite.config.js
# Backend: editar backend/.env (PORT=5001)
```

### Dependencias
```bash
# Si hay errores de dependencias:
cd backend && npm install
cd ../frontend && npm install
```

---

## 📊 Datos de Ejemplo Incluidos

El sistema viene con datos de ejemplo:

### Servicios
- Corte de Cabello ($25)
- Arreglo de Barba ($15) 
- Corte + Barba ($35)
- Lavado de Cabello ($10)
- Tinte de Cabello ($45)

### Productos
- Shampoo Anticaspa
- Cera para Cabello
- Aceite para Barba
- Gel Fijador
- Loción After Shave

---

## 🎯 Características Principales

✅ **Acceso protegido** - Login de administrador, cambio de contraseña y cierre de sesión
✅ **Gestión completa** - Barberos, clientes, servicios  
✅ **Citas inteligentes** - Con barberos y servicios múltiples  
✅ **Inventario automático** - Control de stock en tiempo real  
✅ **Ventas simples** - Sin facturación compleja  
✅ **Reportes diarios** - Resumen completo del negocio  
✅ **Responsive** - Funciona en móviles y tablets  

---

**¿Problemas?** Revisa el README.md completo o contacta al desarrollador.

**¡A gestionar tu Barbería Mecha! 💇‍♂️✂️**