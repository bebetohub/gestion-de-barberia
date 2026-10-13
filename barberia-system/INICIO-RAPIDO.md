# 🚀 Inicio Rápido - Sistema de Gestión para Barbería Mecha

## ⚡ Instalación Express (5 minutos)

### 1. Requisitos Previos
- ✅ Node.js instalado (versión 16+)
- ✅ MongoDB instalado y corriendo
- ✅ Terminal/CMD abierto

### 2. Instalación Automática
```bash
# 1. Navegar al directorio del proyecto
cd barberia-system

# 2. Instalar dependencias de ambos proyectos
npm run install-all
```

### 3. Configurar Base de Datos
```bash
# Asegúrate de que MongoDB esté corriendo
# Luego inicializa los datos de ejemplo:
cd backend
npm run init-data
```

### 4. Iniciar el Sistema
```bash
# Desde la carpeta raíz, ejecutar ambos servidores:
npm run dev
```

**¡Listo!** 🎉

- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:5000

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
1. Abrir http://localhost:3000
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

✅ **Sin autenticación** - Acceso directo  
✅ **Gestión completa** - Barberos, clientes, servicios  
✅ **Citas inteligentes** - Con barberos y servicios múltiples  
✅ **Inventario automático** - Control de stock en tiempo real  
✅ **Ventas simples** - Sin facturación compleja  
✅ **Reportes diarios** - Resumen completo del negocio  
✅ **Responsive** - Funciona en móviles y tablets  

---

**¿Problemas?** Revisa el README.md completo o contacta al desarrollador.

**¡A gestionar tu Barbería Mecha! 💇‍♂️✂️**