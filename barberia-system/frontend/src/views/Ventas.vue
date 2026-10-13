<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold text-gray-900">Gestión de Ventas</h1>
      <button @click="openModal()" class="btn-primary">Nueva Venta</button>
    </div>

    <!-- Filtros -->
    <div class="card mb-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="form-label">Fecha</label>
          <input 
            v-model="selectedDate"
            @change="loadVentas"
            type="date" 
            class="form-input"
          >
        </div>
        <div>
          <label class="form-label">Cliente</label>
          <input 
            v-model="filtroCliente"
            @input="filtrarVentas"
            type="text" 
            placeholder="Buscar por nombre de cliente..."
            class="form-input"
          >
        </div>
        <div class="flex items-end">
          <button @click="loadVentas" class="btn-secondary">Actualizar</button>
        </div>
      </div>
    </div>

    <!-- Resumen del día -->
    <div v-if="selectedDate" class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <div class="card bg-green-50 border border-green-200">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-green-100 text-green-600">
            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-green-600">Total Ventas</p>
            <p class="text-2xl font-bold text-green-900">Bs {{ resumenDia.totalIngresos }}</p>
          </div>
        </div>
      </div>
      <div class="card bg-blue-50 border border-blue-200">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-blue-100 text-blue-600">
            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                    d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"></path>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-blue-600">Número de Ventas</p>
            <p class="text-2xl font-bold text-blue-900">{{ resumenDia.numeroVentas }}</p>
          </div>
        </div>
      </div>
      <div class="card bg-yellow-50 border border-yellow-200">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-yellow-100 text-yellow-600">
            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-yellow-600">Productos Vendidos</p>
            <p class="text-2xl font-bold text-yellow-900">{{ resumenDia.productosVendidos }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Lista de ventas -->
    <div class="card">
      <div class="overflow-x-auto">
        <table class="table">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Cliente</th>
              <th>Productos</th>
              <th>Cantidad Total</th>
              <th>Total</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-for="venta in ventasFiltradas" :key="venta._id">
              <td>{{ formatDateTime(venta.createdAt || venta.fecha) }}</td>
              <td>
                <div>
                  <p class="font-medium">{{ venta.cliente.nombre }}</p>
                  <p class="text-sm text-gray-600">{{ venta.cliente.telefono }}</p>
                </div>
              </td>
              <td>
                <div class="space-y-1">
                  <div v-for="producto in venta.productos" :key="producto._id" class="text-sm">
                    <span class="font-medium">{{ producto.producto.nombre }}</span>
                    <span class="text-gray-600">({{ producto.cantidad }}x ${{ producto.precio }})</span>
                  </div>
                </div>
              </td>
              <td class="font-medium">
                {{ venta.productos.reduce((sum, p) => sum + p.cantidad, 0) }}
              </td>
              <td class="font-bold text-green-600">Bs {{ venta.total }}</td>
              <td>
                <button @click="verDetalleVenta(venta)" class="text-blue-600 hover:text-blue-800">
                  Ver Detalle
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal para nueva venta -->
    <div v-show="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white p-6 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <h2 class="text-xl font-bold mb-4">Nueva Venta</h2>
        <form @submit.prevent="saveVenta">
          <!-- Cliente -->
          <div class="mb-4">
            <label class="form-label">Cliente *</label>
            <select v-model="form.cliente" class="form-input" required>
              <option value="">Seleccionar cliente</option>
              <option v-for="cliente in clientes" :key="cliente._id" :value="cliente._id">
                {{ cliente.nombre }} - {{ cliente.telefono }}
              </option>
            </select>
          </div>

          <!-- Productos -->
          <div class="mb-4">
            <label class="form-label">Productos *</label>
            <div class="border rounded p-4">
              <div class="mb-4">
                <input 
                  v-model="searchProducto"
                  type="text" 
                  placeholder="Buscar producto..."
                  class="form-input"
                >
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-60 overflow-y-auto">
                <div 
                  v-for="producto in productosFiltrados" 
                  :key="producto._id"
                  class="border rounded p-3 hover:bg-gray-50 cursor-pointer"
                  @click="agregarProducto(producto)"
                >
                  <div class="flex justify-between items-center">
                    <div>
                      <p class="font-medium">{{ producto.nombre }}</p>
                      <p class="text-sm text-gray-600">Bs {{ producto.precio }}</p>
                      <p class="text-xs text-gray-500">Stock: {{ producto.stock }}</p>
                    </div>
                    <button type="button" class="btn-primary text-sm" :disabled="producto.stock === 0">
                      Agregar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Productos seleccionados -->
          <div v-if="productosSeleccionados.length > 0" class="mb-4">
            <label class="form-label">Productos Seleccionados</label>
            <div class="border rounded p-4">
              <div v-for="(item, index) in productosSeleccionados" :key="index" class="flex justify-between items-center mb-3 p-3 bg-gray-50 rounded">
                <div class="flex-1">
                  <p class="font-medium">{{ item.producto.nombre }}</p>
                  <p class="text-sm text-gray-600">Bs {{ item.precio }} c/u</p>
                </div>
                <div class="flex items-center space-x-2">
                  <button type="button" @click="item.cantidad = Math.max(1, item.cantidad - 1)" class="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300">-</button>
                  <span class="w-8 text-center">{{ item.cantidad }}</span>
                  <button type="button" @click="item.cantidad = Math.min(item.producto.stock, item.cantidad + 1)" class="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300">+</button>
                  <span class="ml-2 font-medium">Bs {{ item.cantidad * item.precio }}</span>
                  <button type="button" @click="quitarProducto(index)" class="ml-2 text-red-600 hover:text-red-800">Quitar</button>
                </div>
              </div>

              <div class="border-t pt-3 mt-3">
                <div class="flex justify-between items-center text-lg font-bold">
                  <span>Total:</span>
                  <span>Bs {{ calcularTotal() }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="flex justify-end space-x-2">
            <button type="button" @click="closeModal" class="btn-secondary">Cancelar</button>
            <button type="submit" class="btn-primary" :disabled="productosSeleccionados.length === 0">Guardar Venta</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../services/api'

export default {
  name: 'Ventas',
  data() {
    return {
      ventas: [],
      ventasFiltradas: [],
      clientes: [],
      productos: [],
      showModal: false,
      selectedDate: new Date().toLocaleDateString('en-CA', { timeZone: 'America/La_Paz' }),
      filtroCliente: '',
      searchProducto: '',
      ventaDetalle: null,
      form: { cliente: '' },
      productosSeleccionados: [],
      resumenDia: { totalIngresos: 0, numeroVentas: 0, productosVendidos: 0 }
    }
  },
  computed: {
    productosFiltrados() {
      if (!this.searchProducto) return this.productos.filter(p => p.activo && p.stock > 0)
      return this.productos.filter(p => p.activo && p.stock > 0 && p.nombre.toLowerCase().includes(this.searchProducto.toLowerCase()))
    }
  },
  async mounted() {
    await Promise.all([this.loadVentas(), this.loadClientes(), this.loadProductos()])
  },
  methods: {
    async loadVentas() {
      try {
        let url = '/ventas'
        if (this.selectedDate) url = `/ventas/fecha/${this.selectedDate}`
        const response = await api.get(url)
        this.ventas = response.data
        this.ventasFiltradas = [...this.ventas]
        this.calcularResumenDia()
        this.filtrarVentas()
      } catch (error) {
        console.error('Error cargando ventas:', error)
      }
    },
    async loadClientes() {
      try { const response = await api.get('/clientes'); this.clientes = response.data } 
      catch (error) { console.error('Error cargando clientes:', error) }
    },
    async loadProductos() {
      try { const response = await api.get('/productos'); this.productos = response.data } 
      catch (error) { console.error('Error cargando productos:', error) }
    },
    filtrarVentas() {
      if (!this.filtroCliente) { this.ventasFiltradas = [...this.ventas]; return }
      this.ventasFiltradas = this.ventas.filter(venta =>
        venta.cliente.nombre.toLowerCase().includes(this.filtroCliente.toLowerCase())
      )
    },
    calcularResumenDia() {
      this.resumenDia = {
        totalIngresos: this.ventas.reduce((sum, venta) => sum + venta.total, 0),
        numeroVentas: this.ventas.length,
        productosVendidos: this.ventas.reduce((sum, venta) => sum + venta.productos.reduce((pSum, producto) => pSum + producto.cantidad, 0), 0)
      }
    },
    openModal() { this.form = { cliente: '' }; this.productosSeleccionados = []; this.searchProducto = ''; this.showModal = true },
    closeModal() { this.showModal = false },
    agregarProducto(producto) {
      const existente = this.productosSeleccionados.find(item => item.producto._id === producto._id)
      if (existente) { if (existente.cantidad < producto.stock) existente.cantidad++ } 
      else { this.productosSeleccionados.push({ producto, cantidad: 1, precio: producto.precio }) }
    },
    quitarProducto(index) { this.productosSeleccionados.splice(index, 1) },
    calcularTotal() { return this.productosSeleccionados.reduce((total, item) => total + item.cantidad * item.precio, 0) },

    // fecha del input a Bolivia
    fechaBoliviaDesdeInput(fechaInput) {
      const [year, month, day] = fechaInput.split('-').map(Number)
      return new Date(Date.UTC(year, month - 1, day, 4, 0, 0))
    },

    async saveVenta() {
      try {
        if (this.productosSeleccionados.length === 0) { alert('Debe seleccionar al menos un producto'); return }
        if (!this.form.cliente) { alert('Debe seleccionar un cliente'); return }

        const ventaData = {
          cliente: this.form.cliente,
          productos: this.productosSeleccionados.map(item => ({
            producto: item.producto._id,
            cantidad: item.cantidad,
            precio: item.precio
          })),
          fecha: this.fechaBoliviaDesdeInput(this.selectedDate) // <--- ajuste de hora Bolivia
        }
        await api.post('/ventas', ventaData)
        alert('Venta registrada correctamente')
        this.showModal = false
        await this.loadVentas()
      } catch (error) {
        console.error('Error guardando venta:', error)
        alert('Error al guardar la venta: ' + (error.response?.data?.error || error.message))
      }
    },
    formatDateTime(dateString) {
      const date = new Date(dateString)
      return date.toLocaleString('es-BO', { timeZone: 'America/La_Paz', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })
    },
    verDetalleVenta(venta) { this.ventaDetalle = venta; this.showDetalleModal = true },
    closeDetalleModal() { this.showDetalleModal = false; this.ventaDetalle = null }
  }
}
</script>
