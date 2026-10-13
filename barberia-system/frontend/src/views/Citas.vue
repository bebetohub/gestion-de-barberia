<template>
  <div>
    <!-- Encabezado -->
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold text-gray-900">Gestión de Citas</h1>
      <button @click="openModal()" class="btn-primary">Nueva Cita</button>
    </div>

    <!-- Filtros -->
    <div class="card mb-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="form-label">Fecha</label>
          <input
            v-model="selectedDate"
            @change="loadCitas"
            type="date"
            class="form-input"
          />
        </div>
        <div>
          <label class="form-label">Estado</label>
          <select
            v-model="selectedEstado"
            @change="filterCitas"
            class="form-input"
          >
            <option value="">Todos</option>
            <option value="programada">Programada</option>
            <option value="completada">Completada</option>
            <option value="cancelada">Cancelada</option>
          </select>
        </div>
        <div class="flex items-end">
          <button @click="loadCitas" class="btn-secondary">Actualizar</button>
        </div>
      </div>
    </div>

    <!-- Lista de citas -->
    <div class="card">
      <div class="overflow-x-auto">
        <table class="table">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Hora</th>
              <th>Cliente</th>
              <th>Barbero</th>
              <th>Servicios</th>
              <th>Total</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-for="cita in filteredCitas" :key="cita._id">
              <td>{{ formatDate(cita.fecha) }}</td>
              <td class="font-medium">{{ cita.hora }}</td>
              <td>
                <div>
                  <p class="font-medium">{{ cita.cliente.nombre }}</p>
                  <p class="text-sm text-gray-600">{{ cita.cliente.telefono }}</p>
                </div>
              </td>
              <td>{{ cita.barbero.nombre }}</td>
              <td>
                <div class="space-y-1">
                  <span
                    v-for="servicio in cita.servicios"
                    :key="servicio._id"
                    class="block text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded"
                  >
                    {{ servicio.servicio.nombre }} - Bs {{ servicio.precio }}
                  </span>
                </div>
              </td>
              <td class="font-bold text-green-600">Bs {{ cita.total }}</td>
              <td>
                <select
                  :value="cita.estado"
                  @change="updateEstado(cita._id, $event.target.value)"
                  class="text-xs px-2 py-1 rounded border"
                  :class="{
                    'bg-yellow-100 text-yellow-800': cita.estado === 'programada',
                    'bg-green-100 text-green-800': cita.estado === 'completada',
                    'bg-red-100 text-red-800': cita.estado === 'cancelada',
                  }"
                >
                  <option value="programada">Programada</option>
                  <option value="completada">Completada</option>
                  <option value="cancelada">Cancelada</option>
                </select>
              </td>
              <td class="space-x-2">
                <button @click="openModal(cita)" class="text-blue-600 hover:text-blue-800">
                  Editar
                </button>
                <button @click="deleteCita(cita._id)" class="text-red-600 hover:text-red-800">
                  Eliminar
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal para agregar/editar cita -->
    <div
      v-show="showModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white p-6 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 class="text-xl font-bold mb-4">
          {{ editingCita ? 'Editar Cita' : 'Nueva Cita' }}
        </h2>

        <form @submit.prevent="saveCita">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label class="form-label">Cliente *</label>
              <select v-model="form.cliente" class="form-input" required>
                <option value="">Seleccionar cliente</option>
                <option
                  v-for="cliente in clientes"
                  :key="cliente._id"
                  :value="cliente._id"
                >
                  {{ cliente.nombre }} - {{ cliente.telefono }}
                </option>
              </select>
            </div>

            <div>
              <label class="form-label">Barbero *</label>
              <select v-model="form.barbero" class="form-input" required>
                <option value="">Seleccionar barbero</option>
                <option
                  v-for="barbero in barberos"
                  :key="barbero._id"
                  :value="barbero._id"
                >
                  {{ barbero.nombre }}
                </option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label class="form-label">Fecha *</label>
              <input
                v-model="form.fecha"
                type="date"
                class="form-input"
                required
              />
            </div>

            <div>
              <label class="form-label">Hora *</label>
              <input
                v-model="form.hora"
                type="time"
                class="form-input"
                required
              />
            </div>
          </div>

          <!-- Servicios -->
          <div class="mb-4">
            <label class="form-label">Servicios *</label>
            <div class="border rounded p-4 max-h-40 overflow-y-auto">
              <div
                v-for="servicio in servicios"
                :key="servicio._id"
                class="flex items-center mb-2"
              >
                <input
                  :id="`servicio-${servicio._id}`"
                  v-model="selectedServicios"
                  :value="servicio._id"
                  type="checkbox"
                  class="mr-2"
                  @change="updateTotal"
                />
                <label :for="`servicio-${servicio._id}`" class="flex-1 cursor-pointer">
                  {{ servicio.nombre }} - Bs {{ servicio.precio }} ({{ servicio.duracion }}min)
                </label>
              </div>
            </div>
          </div>

          <div class="mb-4">
            <label class="form-label">Notas</label>
            <textarea
              v-model="form.notas"
              class="form-input"
              rows="3"
              placeholder="Notas adicionales sobre la cita..."
            ></textarea>
          </div>

          <div class="mb-4 p-4 bg-gray-100 rounded">
            <p class="text-lg font-bold">Total: Bs {{ calculatedTotal }}</p>
          </div>

          <div class="flex justify-end space-x-2">
            <button type="button" @click="closeModal" class="btn-secondary">Cancelar</button>
            <button type="submit" class="btn-primary">{{ editingCita ? 'Actualizar' : 'Guardar' }}</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../services/api';

export default {
  name: 'Citas',
  data() {
    return {
      citas: [],
      filteredCitas: [],
      showModal: false,
      editingCita: null,
      selectedDate: this.getHoyBolivia(),
      selectedEstado: '',
      clientes: [],
      barberos: [],
      servicios: [],
      selectedServicios: [],
      calculatedTotal: 0,
      form: {
        cliente: '',
        barbero: '',
        fecha: this.getHoyBolivia(),
        hora: '',
        notas: '',
        estado: 'programada',
      },
    };
  },
  methods: {
    getHoyBolivia() {
      const hoy = new Date();
      const partes = new Intl.DateTimeFormat('en-CA', {
        timeZone: 'America/La_Paz',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      }).formatToParts(hoy);
      const ano = partes.find(p => p.type === 'year').value;
      const mes = partes.find(p => p.type === 'month').value;
      const dia = partes.find(p => p.type === 'day').value;
      return `${ano}-${mes}-${dia}`;
    },

    async mounted() {
      await Promise.all([
        this.loadCitas(),
        this.loadClientes(),
        this.loadBarberos(),
        this.loadServicios(),
      ]);
    },

    async loadCitas() {
      try {
        let url = '/citas';
        if (this.selectedDate) url = `/citas/fecha/${this.selectedDate}`;
        const res = await api.get(url);
        this.citas = res.data;
        this.filterCitas();
      } catch (err) {
        console.error(err);
      }
    },

    filterCitas() {
      if (!this.selectedEstado) {
        this.filteredCitas = this.citas;
      } else {
        this.filteredCitas = this.citas.filter(c => c.estado === this.selectedEstado);
      }
    },

    async loadClientes() { const res = await api.get('/clientes'); this.clientes = res.data; },
    async loadBarberos() { const res = await api.get('/barberos'); this.barberos = res.data; },
    async loadServicios() { const res = await api.get('/servicios'); this.servicios = res.data; },

    openModal(cita = null) {
      this.editingCita = cita;
      if (cita) {
        const fechaInput = cita.fecha ? cita.fecha.split('T')[0] : this.getHoyBolivia();
        this.form = {
          cliente: cita.cliente._id,
          barbero: cita.barbero._id,
          fecha: fechaInput,
          hora: cita.hora,
          notas: cita.notas || '',
          estado: cita.estado,
        };
        this.selectedServicios = cita.servicios.map(s => s.servicio._id);
      } else {
        this.form = { cliente: '', barbero: '', fecha: this.getHoyBolivia(), hora: '', notas: '', estado: 'programada' };
        this.selectedServicios = [];
      }
      this.updateTotal();
      this.showModal = true;
    },

    closeModal() {
      this.showModal = false;
      this.editingCita = null;
      this.selectedServicios = [];
      this.calculatedTotal = 0;
    },

    updateTotal() {
      this.calculatedTotal = this.selectedServicios.reduce((total, id) => {
        const s = this.servicios.find(x => x._id === id);
        return total + (s ? s.precio : 0);
      }, 0);
    },

    async saveCita() {
      if (!this.selectedServicios.length) return alert('Seleccione al menos un servicio');
      const serviciosData = this.selectedServicios.map(id => {
        const s = this.servicios.find(x => x._id === id);
        return { servicio: id, precio: s ? s.precio : 0 };
      });

      // Combinar fecha + hora en ISO Bolivia
      const [year, month, day] = this.form.fecha.split('-');
      const [hour, minute] = this.form.hora.split(':');
      const fechaBolivia = new Date(Date.UTC(year, month - 1, day, hour - 4, minute)); // Bolivia -4
      const citaData = { ...this.form, fecha: fechaBolivia.toISOString(), servicios: serviciosData, total: this.calculatedTotal };

      try {
        if (this.editingCita) await api.put(`/citas/${this.editingCita._id}`, citaData);
        else await api.post('/citas', citaData);
        await this.loadCitas();
        this.closeModal();
        alert('Cita guardada exitosamente');
      } catch (err) {
        console.error(err);
        alert('Error guardando cita');
      }
    },

    async updateEstado(id, estado) { await api.patch(`/citas/${id}/estado`, { estado }); await this.loadCitas(); },
    async deleteCita(id) { if (confirm('¿Eliminar esta cita?')) { await api.delete(`/citas/${id}`); await this.loadCitas(); alert('Cita eliminada'); } },
    formatDate(dateStr) { if (!dateStr) return '-'; const [y, m, d] = dateStr.split('T')[0].split('-'); return `${d}/${m}/${y}`; },
  },
  async mounted() {
    await Promise.all([this.loadCitas(), this.loadClientes(), this.loadBarberos(), this.loadServicios()]);
  },
};
</script>
