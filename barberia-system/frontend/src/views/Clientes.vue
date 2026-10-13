<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold text-gray-900">Gestión de Clientes</h1>
      <button 
        @click="openModal()"
        class="btn-primary"
      >
        Agregar Cliente
      </button>
    </div>

    <!-- Buscador -->
    <div class="card mb-6">
      <div class="flex space-x-4">
        <div class="flex-1">
          <input 
            v-model="searchTerm"
            @input="searchClientes"
            type="text" 
            placeholder="Buscar por nombre o teléfono..."
            class="form-input"
          >
        </div>
        <button 
          @click="loadClientes"
          class="btn-secondary"
        >
          Limpiar
        </button>
      </div>
    </div>

    <!-- Lista de clientes -->
    <div class="card">
      <div class="overflow-x-auto">
        <table class="table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Teléfono</th>
              <th>Email</th>
              <th>Fecha Nacimiento</th>
              <th>Notas</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-for="cliente in clientes" :key="cliente._id">
              <td class="font-medium">{{ cliente.nombre }}</td>
              <td>{{ cliente.telefono }}</td>
              <td>{{ cliente.email || '-' }}</td>
              <td>
                {{ cliente.fechaNacimiento ? formatDate(cliente.fechaNacimiento) : '-' }}
              </td>
              <td class="max-w-xs truncate">{{ cliente.notas || '-' }}</td>
              <td class="space-x-2">
                <button 
                  @click="openModal(cliente)"
                  class="text-blue-600 hover:text-blue-800"
                >
                  Editar
                </button>
                <button 
                  @click="deleteCliente(cliente._id)"
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

    <!-- Modal para agregar/editar cliente -->
    <div v-show="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white p-6 rounded-lg w-full max-w-md">
        <h2 class="text-xl font-bold mb-4">
          {{ editingCliente ? 'Editar Cliente' : 'Agregar Cliente' }}
        </h2>
        
        <form @submit.prevent="saveCliente">
          <div class="mb-4">
            <label class="form-label">Nombre *</label>
            <input 
              v-model="form.nombre"
              type="text" 
              class="form-input"
              required
            >
          </div>
          
          <div class="mb-4">
            <label class="form-label">Teléfono *</label>
            <input 
              v-model="form.telefono"
              type="tel" 
              class="form-input"
              required
            >
          </div>
          
          <div class="mb-4">
            <label class="form-label">Email</label>
            <input 
              v-model="form.email"
              type="email" 
              class="form-input"
            >
          </div>
          
          <div class="mb-4">
            <label class="form-label">Fecha de Nacimiento</label>
            <input 
              v-model="form.fechaNacimiento"
              type="date" 
              class="form-input"
            >
          </div>
          
          <div class="mb-4">
            <label class="form-label">Notas</label>
            <textarea 
              v-model="form.notas"
              class="form-input"
              rows="3"
              placeholder="Información adicional sobre el cliente..."
            ></textarea>
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
              {{ editingCliente ? 'Actualizar' : 'Guardar' }}
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
  name: 'Clientes',
  data() {
    return {
      clientes: [],
      showModal: false,
      editingCliente: null,
      searchTerm: '',
      form: {
        nombre: '',
        telefono: '',
        email: '',
        fechaNacimiento: '',
        notas: ''
      }
    }
  },
  async mounted() {
    await this.loadClientes()
  },
  methods: {
    async loadClientes() {
      try {
        const response = await api.get('/clientes')
        this.clientes = response.data
        this.searchTerm = ''
      } catch (error) {
        console.error('Error cargando clientes:', error)
        alert('Error cargando clientes')
      }
    },
    
    async searchClientes() {
      if (this.searchTerm.trim() === '') {
        await this.loadClientes()
        return
      }
      
      try {
        const response = await api.get(`/clientes/buscar/${this.searchTerm}`)
        this.clientes = response.data
      } catch (error) {
        console.error('Error buscando clientes:', error)
      }
    },
    
    openModal(cliente = null) {
      this.editingCliente = cliente
      if (cliente) {
        this.form = { 
          ...cliente,
          fechaNacimiento: cliente.fechaNacimiento ? 
            new Date(cliente.fechaNacimiento).toISOString().split('T')[0] : ''
        }
      } else {
        this.form = {
          nombre: '',
          telefono: '',
          email: '',
          fechaNacimiento: '',
          notas: ''
        }
      }
      this.showModal = true
    },
    
    closeModal() {
      this.showModal = false
      this.editingCliente = null
    },
    
    async saveCliente() {
      try {
        if (this.editingCliente) {
          await api.put(`/clientes/${this.editingCliente._id}`, this.form)
        } else {
          await api.post('/clientes', this.form)
        }
        
        await this.loadClientes()
        this.closeModal()
        alert('Cliente guardado exitosamente')
      } catch (error) {
        console.error('Error guardando cliente:', error)
        alert('Error guardando cliente')
      }
    },
    
    async deleteCliente(id) {
      if (confirm('¿Estás seguro de eliminar este cliente?')) {
        try {
          await api.delete(`/clientes/${id}`)
          await this.loadClientes()
          alert('Cliente eliminado exitosamente')
        } catch (error) {
          console.error('Error eliminando cliente:', error)
          alert('Error eliminando cliente')
        }
      }
    },
    
    formatDate(dateString) {
      if (!dateString) return '-';
      try {
        // Si ya es un objeto Date, convertir a string primero
        const dateStr = dateString instanceof Date ? dateString.toISOString() : dateString;
        // Crear fecha y ajustar para zona horaria de Bolivia (UTC-4)
        const fecha = new Date(dateStr);
        if (isNaN(fecha.getTime())) return 'Fecha inválida';
        
        return fecha.toLocaleDateString('es-BO', {
          timeZone: 'America/La_Paz',
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        });
      } catch (error) {
        console.error('Error formatting date:', error);
        return 'Error fecha';
      }
    }
  }
}
</script>