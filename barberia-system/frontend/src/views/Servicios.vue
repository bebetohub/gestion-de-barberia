<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold text-gray-900">Gestión de Servicios</h1>
      <button 
        @click="openModal()"
        class="btn-primary"
      >
        Agregar Servicio
      </button>
    </div>

    <!-- Lista de servicios -->
    <div class="card">
      <div class="overflow-x-auto">
        <table class="table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Precio</th>
              <th>Duración (min)</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-for="servicio in servicios" :key="servicio._id">
              <td class="font-medium">{{ servicio.nombre }}</td>
              <td class="max-w-xs truncate">{{ servicio.descripcion || '-' }}</td>
              <td class="font-bold text-green-600">Bs {{ servicio.precio }}</td>
              <td>{{ servicio.duracion }} min</td>
              <td>
                <span 
                  :class="servicio.activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
                  class="px-2 py-1 text-xs rounded-full"
                >
                  {{ servicio.activo ? 'Activo' : 'Inactivo' }}
                </span>
              </td>
              <td class="space-x-2">
                <button 
                  @click="openModal(servicio)"
                  class="text-blue-600 hover:text-blue-800"
                >
                  Editar
                </button>
                <button 
                  @click="deleteServicio(servicio._id)"
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

    <!-- Modal para agregar/editar servicio -->
    <div v-show="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white p-6 rounded-lg w-full max-w-md">
        <h2 class="text-xl font-bold mb-4">
          {{ editingServicio ? 'Editar Servicio' : 'Agregar Servicio' }}
        </h2>
        
        <form @submit.prevent="saveServicio">
          <div class="mb-4">
            <label class="form-label">Nombre del Servicio *</label>
            <input 
              v-model="form.nombre"
              type="text" 
              class="form-input"
              placeholder="Ej: Corte de cabello"
              required
            >
          </div>
          
          <div class="mb-4">
            <label class="form-label">Descripción</label>
            <textarea 
              v-model="form.descripcion"
              class="form-input"
              rows="3"
              placeholder="Descripción del servicio..."
            ></textarea>
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
              <label class="form-label">Duración (minutos) *</label>
              <input 
                v-model.number="form.duracion"
                type="number" 
                min="1"
                class="form-input"
                required
              >
            </div>
          </div>
          
          <div class="mb-4">
            <label class="flex items-center">
              <input 
                v-model="form.activo"
                type="checkbox" 
                class="mr-2"
              >
              <span class="form-label mb-0">Servicio activo</span>
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
              {{ editingServicio ? 'Actualizar' : 'Guardar' }}
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
  name: 'Servicios',
  data() {
    return {
      servicios: [],
      showModal: false,
      editingServicio: null,
      form: {
        nombre: '',
        descripcion: '',
        precio: 0,
        duracion: 30,
        activo: true
      }
    }
  },
  async mounted() {
    await this.loadServicios()
  },
  methods: {
    async loadServicios() {
      try {
        const response = await api.get('/servicios')
        this.servicios = response.data
      } catch (error) {
        console.error('Error cargando servicios:', error)
        alert('Error cargando servicios')
      }
    },
    
    openModal(servicio = null) {
      this.editingServicio = servicio
      if (servicio) {
        this.form = { ...servicio }
      } else {
        this.form = {
          nombre: '',
          descripcion: '',
          precio: 0,
          duracion: 30,
          activo: true
        }
      }
      this.showModal = true
    },
    
    closeModal() {
      this.showModal = false
      this.editingServicio = null
    },
    
    async saveServicio() {
      try {
        if (this.editingServicio) {
          await api.put(`/servicios/${this.editingServicio._id}`, this.form)
        } else {
          await api.post('/servicios', this.form)
        }
        
        await this.loadServicios()
        this.closeModal()
        alert('Servicio guardado exitosamente')
      } catch (error) {
        console.error('Error guardando servicio:', error)
        alert('Error guardando servicio')
      }
    },
    
    async deleteServicio(id) {
      if (confirm('¿Estás seguro de eliminar este servicio?')) {
        try {
          await api.delete(`/servicios/${id}`)
          await this.loadServicios()
          alert('Servicio eliminado exitosamente')
        } catch (error) {
          console.error('Error eliminando servicio:', error)
          alert('Error eliminando servicio')
        }
      }
    }
  }
}
</script>