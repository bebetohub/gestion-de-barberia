<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold text-gray-900">Gestión de Barberos</h1>
      <button @click="openModal()" class="btn-primary">Agregar Barbero</button>
    </div>

    <!-- Lista de barberos -->
    <div class="card">
      <div class="overflow-x-auto">
        <table class="table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Teléfono</th>
              <th>Email</th>
              <th>Especialidades</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-for="barbero in barberos" :key="barbero._id">
              <td class="font-medium">{{ barbero.nombre }}</td>
              <td>{{ barbero.telefono }}</td>
              <td>{{ barbero.email }}</td>
              <td>
                <span
                  v-for="especialidad in barbero.especialidades"
                  :key="especialidad"
                  class="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mr-1"
                >
                  {{ especialidad }}
                </span>
              </td>
              <td class="space-x-2">
                <button
                  @click="openModal(barbero)"
                  class="text-blue-600 hover:text-blue-800"
                >
                  Editar
                </button>
                <button
                  @click="deleteBarbero(barbero._id)"
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

    <!-- Modal para agregar/editar barbero -->
    <div
      v-show="showModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white p-6 rounded-lg w-full max-w-md">
        <h2 class="text-xl font-bold mb-4">
          {{ editingBarbero ? 'Editar Barbero' : 'Agregar Barbero' }}
        </h2>

        <form @submit.prevent="saveBarbero">
          <div class="mb-4">
            <label class="form-label">Nombre *</label>
            <input
              v-model="form.nombre"
              type="text"
              class="form-input"
              required
            />
          </div>

          <div class="mb-4">
            <label class="form-label">Teléfono *</label>
            <input
              v-model="form.telefono"
              type="tel"
              class="form-input"
              required
            />
          </div>

          <div class="mb-4">
            <label class="form-label">Email *</label>
            <input
              v-model="form.email"
              type="email"
              class="form-input"
              required
            />
          </div>

          <div class="mb-4">
            <label class="form-label">Especialidades</label>
            <input
              v-model="especialidadesInput"
              type="text"
              class="form-input"
              placeholder="Separar con comas (ej: Corte, Barba, Tinte)"
            />
          </div>

          <div class="flex justify-end space-x-2">
            <button type="button" @click="closeModal" class="btn-secondary">
              Cancelar
            </button>
            <button type="submit" class="btn-primary">
              {{ editingBarbero ? 'Actualizar' : 'Guardar' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../services/api';

export default {
  name: 'Barberos',
  data() {
    return {
      barberos: [],
      showModal: false,
      editingBarbero: null,
      form: {
        nombre: '',
        telefono: '',
        email: '',
        especialidades: [],
      },
      especialidadesInput: '',
    };
  },
  async mounted() {
    await this.loadBarberos();
  },
  methods: {
    async loadBarberos() {
      try {
        const response = await api.get('/barberos');
        this.barberos = response.data;
      } catch (error) {
        console.error('Error cargando barberos:', error);
        alert('Error cargando barberos');
      }
    },

    openModal(barbero = null) {
      this.editingBarbero = barbero;
      if (barbero) {
        this.form = { ...barbero };
        this.especialidadesInput = barbero.especialidades.join(', ');
      } else {
        this.form = {
          nombre: '',
          telefono: '',
          email: '',
          especialidades: [],
        };
        this.especialidadesInput = '';
      }
      this.showModal = true;
    },

    closeModal() {
      this.showModal = false;
      this.editingBarbero = null;
    },

    async saveBarbero() {
      try {
        // Procesar especialidades
        this.form.especialidades = this.especialidadesInput
          .split(',')
          .map((e) => e.trim())
          .filter((e) => e.length > 0);

        if (this.editingBarbero) {
          await api.put(`/barberos/${this.editingBarbero._id}`, this.form);
        } else {
          await api.post('/barberos', this.form);
        }

        await this.loadBarberos();
        this.closeModal();
        alert('Barbero guardado exitosamente');
      } catch (error) {
        console.error('Error guardando barbero:', error);
        alert('Error guardando barbero');
      }
    },

    async deleteBarbero(id) {
      if (confirm('¿Estás seguro de eliminar este barbero?')) {
        try {
          await api.delete(`/barberos/${id}`);
          await this.loadBarberos();
          alert('Barbero eliminado exitosamente');
        } catch (error) {
          console.error('Error eliminando barbero:', error);
          alert('Error eliminando barbero');
        }
      }
    },
  },
};
</script>
