<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold text-gray-900">Gestión de Inventario</h1>
      <button 
        @click="openModal()"
        class="btn-primary"
      >
        Agregar Producto
      </button>
    </div>

    <!-- Filtros y alertas -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <!-- Productos con stock bajo -->
      <div v-if="productosStockBajo.length > 0" class="card bg-red-50 border border-red-200">
        <h3 class="text-lg font-semibold text-red-800 mb-3">⚠️ Productos con Stock Bajo</h3>
        <div class="space-y-2">
          <div 
            v-for="producto in productosStockBajo.slice(0, 3)" 
            :key="producto._id"
            class="flex justify-between items-center text-sm"
          >
            <span class="font-medium">{{ producto.nombre }}</span>
            <span class="text-red-600 font-bold">Stock: {{ producto.stock }}</span>
          </div>
          <button 
            v-if="productosStockBajo.length > 3"
            @click="showStockBajo = !showStockBajo"
            class="text-red-600 text-sm hover:underline"
          >
            {{ showStockBajo ? 'Ver menos' : `Ver ${productosStockBajo.length - 3} más` }}
          </button>
        </div>
      </div>
      
      <!-- Filtros -->
      <div class="card">
        <h3 class="text-lg font-semibold mb-3">Filtros</h3>
        <div class="space-y-3">
          <div>
            <label class="form-label">Categoría</label>
            <select v-model="filtroCategoria" @change="filtrarProductos" class="form-input">
              <option value="">Todas las categorías</option>
              <option v-for="categoria in categorias" :key="categoria" :value="categoria">
                {{ categoria }}
              </option>
            </select>
          </div>
          <div>
            <label class="form-label">Estado</label>
            <select v-model="filtroEstado" @change="filtrarProductos" class="form-input">
              <option value="">Todos</option>
              <option value="activo">Activos</option>
              <option value="inactivo">Inactivos</option>
              <option value="stock-bajo">Stock Bajo</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- Lista de productos -->
    <div class="card">
      <div class="overflow-x-auto">
        <table class="table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Categoría</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Stock Mínimo</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr 
              v-for="producto in productosFiltrados" 
              :key="producto._id"
              :class="{'bg-red-50': producto.stock <= producto.stockMinimo}"
            >
              <td>
                <div>
                  <p class="font-medium">{{ producto.nombre }}</p>
                  <p class="text-sm text-gray-600">{{ producto.descripcion || '-' }}</p>
                </div>
              </td>
              <td>{{ producto.categoria || '-' }}</td>
              <td class="font-bold text-green-600">Bs{{ producto.precio }}</td>
              <td>
                <div class="flex items-center space-x-2">
                  <span 
                    :class="producto.stock <= producto.stockMinimo ? 'text-red-600 font-bold' : ''"
                  >
                    {{ producto.stock }}
                  </span>
                  <button 
                    @click="openStockModal(producto)"
                    class="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    Ajustar
                  </button>
                </div>
              </td>
              <td>{{ producto.stockMinimo }}</td>
              <td>
                <span 
                  :class="producto.activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
                  class="px-2 py-1 text-xs rounded-full"
                >
                  {{ producto.activo ? 'Activo' : 'Inactivo' }}
                </span>
              </td>
              <td class="space-x-2">
                <button 
                  @click="openModal(producto)"
                  class="text-blue-600 hover:text-blue-800"
                >
                  Editar
                </button>
                <button 
                  @click="deleteProducto(producto._id)"
                  class="text-red-600 hover:text-red-800"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal para agregar/editar producto -->
    <div v-show="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white p-6 rounded-lg w-full max-w-md">
        <h2 class="text-xl font-bold mb-4">
          {{ editingProducto ? 'Editar Producto' : 'Agregar Producto' }}
        </h2>
        
        <form @submit.prevent="saveProducto">
          <div class="mb-4">
            <label class="form-label">Nombre del Producto *</label>
            <input 
              v-model="form.nombre"
              type="text" 
              class="form-input"
              required
            >
          </div>
          
          <div class="mb-4">
            <label class="form-label">Descripción</label>
            <textarea 
              v-model="form.descripcion"
              class="form-input"
              rows="2"
            ></textarea>
          </div>
          
          <div class="mb-4">
            <label class="form-label">Categoría</label>
            <input 
              v-model="form.categoria"
              type="text" 
              class="form-input"
              placeholder="Ej: Shampoo, Cera, Herramientas"
            >
          </div>
          
          <div class="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label class="form-label">Precio *</label>
              <input 
                v-model.number="form.precio"
                type="number" 
                step="0.01"
                min="0"
                class="form-input"
                required
              >
            </div>
            
            <div>
              <label class="form-label">Stock Inicial *</label>
              <input 
                v-model.number="form.stock"
                type="number" 
                min="0"
                class="form-input"
                required
              >
            </div>
          </div>
          
          <div class="mb-4">
            <label class="form-label">Stock Mínimo</label>
            <input 
              v-model.number="form.stockMinimo"
              type="number" 
              min="0"
              class="form-input"
            >
          </div>
          
          <div class="mb-4">
            <label class="flex items-center">
              <input 
                v-model="form.activo"
                type="checkbox" 
                class="mr-2"
              >
              <span class="form-label mb-0">Producto activo</span>
            </label>
          </div>
          
          <div class="flex justify-end space-x-2">
            <button 
              type="button" 
              @click="closeModal"
              class="btn-secondary"
            >
              Cancelar
            </button>
            <button 
              type="submit"
              class="btn-primary"
            >
              {{ editingProducto ? 'Actualizar' : 'Guardar' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal para ajustar stock -->
    <div v-show="showStockModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white p-6 rounded-lg w-full max-w-md">
        <h2 class="text-xl font-bold mb-4">Ajustar Stock</h2>
        <p class="text-gray-600 mb-4">
          Producto: <strong>{{ stockProduct?.nombre }}</strong><br>
          Stock actual: <strong>{{ stockProduct?.stock }}</strong>
        </p>
        
        <form @submit.prevent="updateStock">
          <div class="mb-4">
            <label class="form-label">Operación</label>
            <select v-model="stockForm.operacion" class="form-input">
              <option value="suma">Agregar stock (+)</option>
              <option value="resta">Quitar stock (-)</option>
              <option value="set">Establecer stock exacto</option>
            </select>
          </div>
          
          <div class="mb-4">
            <label class="form-label">Cantidad</label>
            <input 
              v-model.number="stockForm.cantidad"
              type="number" 
              min="0"
              class="form-input"
              required
            >
          </div>
          
          <div class="mb-4 p-3 bg-gray-100 rounded">
            <p class="font-medium">
              Nuevo stock: {{ calculateNewStock() }}
            </p>
          </div>
          
          <div class="flex justify-end space-x-2">
            <button 
              type="button" 
              @click="closeStockModal"
              class="btn-secondary"
            >
              Cancelar
            </button>
            <button 
              type="submit"
              class="btn-primary"
            >
              Actualizar Stock
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../services/api'

export default {
  name: 'Productos',
  data() {
    return {
      productos: [],
      productosFiltrados: [],
      productosStockBajo: [],
      categorias: [],
      showModal: false,
      showStockModal: false,
      showStockBajo: false,
      editingProducto: null,
      stockProduct: null,
      filtroCategoria: '',
      filtroEstado: '',
      form: {
        nombre: '',
        descripcion: '',
        categoria: '',
        precio: 0,
        stock: 0,
        stockMinimo: 5,
        activo: true
      },
      stockForm: {
        operacion: 'suma',
        cantidad: 0
      }
    }
  },
  async mounted() {
    await this.loadProductos()
    await this.loadProductosStockBajo()
  },
  methods: {
    async loadProductos() {
      try {
        const response = await api.get('/productos')
        this.productos = response.data
        this.productosFiltrados = [...this.productos]
        
        // Extraer categorías únicas
        this.categorias = [...new Set(
          this.productos
            .map(p => p.categoria)
            .filter(c => c && c.trim() !== '')
        )]
      } catch (error) {
        console.error('Error cargando productos:', error)
        alert('Error cargando productos')
      }
    },
    
    async loadProductosStockBajo() {
      try {
        const response = await api.get('/productos/stock-bajo')
        this.productosStockBajo = response.data
      } catch (error) {
        console.error('Error cargando productos con stock bajo:', error)
      }
    },
    
    filtrarProductos() {
      let filtrados = [...this.productos]
      
      if (this.filtroCategoria) {
        filtrados = filtrados.filter(p => p.categoria === this.filtroCategoria)
      }
      
      if (this.filtroEstado === 'activo') {
        filtrados = filtrados.filter(p => p.activo)
      } else if (this.filtroEstado === 'inactivo') {
        filtrados = filtrados.filter(p => !p.activo)
      } else if (this.filtroEstado === 'stock-bajo') {
        filtrados = filtrados.filter(p => p.stock <= p.stockMinimo)
      }
      
      this.productosFiltrados = filtrados
    },
    
    openModal(producto = null) {
      this.editingProducto = producto
      if (producto) {
        this.form = { ...producto }
      } else {
        this.form = {
          nombre: '',
          descripcion: '',
          categoria: '',
          precio: 0,
          stock: 0,
          stockMinimo: 5,
          activo: true
        }
      }
      this.showModal = true
    },
    
    closeModal() {
      this.showModal = false
      this.editingProducto = null
    },
    
    openStockModal(producto) {
      this.stockProduct = producto
      this.stockForm = {
        operacion: 'suma',
        cantidad: 0
      }
      this.showStockModal = true
    },
    
    closeStockModal() {
      this.showStockModal = false
      this.stockProduct = null
    },
    
    calculateNewStock() {
      if (!this.stockProduct) return 0
      
      const current = this.stockProduct.stock
      const cantidad = this.stockForm.cantidad || 0
      
      switch (this.stockForm.operacion) {
        case 'suma':
          return current + cantidad
        case 'resta':
          return Math.max(0, current - cantidad)
        case 'set':
          return cantidad
        default:
          return current
      }
    },
    
    async saveProducto() {
      try {
        if (this.editingProducto) {
          await api.put(`/productos/${this.editingProducto._id}`, this.form)
        } else {
          await api.post('/productos', this.form)
        }
        
        await this.loadProductos()
        await this.loadProductosStockBajo()
        this.filtrarProductos()
        this.closeModal()
        alert('Producto guardado exitosamente')
      } catch (error) {
        console.error('Error guardando producto:', error)
        alert('Error guardando producto')
      }
    },
    
    async updateStock() {
      try {
        await api.patch(`/productos/${this.stockProduct._id}/stock`, this.stockForm)
        await this.loadProductos()
        await this.loadProductosStockBajo()
        this.filtrarProductos()
        this.closeStockModal()
        alert('Stock actualizado exitosamente')
      } catch (error) {
        console.error('Error actualizando stock:', error)
        alert('Error actualizando stock')
      }
    },
    
    async deleteProducto(id) {
      if (confirm('¿Estás seguro de eliminar este producto?')) {
        try {
          await api.delete(`/productos/${id}`)
          await this.loadProductos()
          await this.loadProductosStockBajo()
          this.filtrarProductos()
          alert('Producto eliminado exitosamente')
        } catch (error) {
          console.error('Error eliminando producto:', error)
          alert('Error eliminando producto')
        }
      }
    }
  }
}
</script>