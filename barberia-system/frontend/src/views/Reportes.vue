<template>
  <div>
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-gray-900">Reportes</h1>
      <p class="text-gray-600">Análisis y resumen del negocio</p>
    </div>

    <!-- Selección de fecha -->
    <div class="card mb-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        <div>
          <label class="form-label">Fecha del Reporte</label>
          <input v-model="selectedDate" type="date" class="form-input" />
        </div>
        <div>
          <button @click="loadReporte" class="btn-primary w-full">Generar Reporte</button>
        </div>
        <div>
          <button @click="exportarReporte" class="btn-secondary w-full" :disabled="!reporte">
            Exportar PDF
          </button>
        </div>
        <div>
          <button @click="imprimirReporte" class="btn-success w-full" :disabled="!reporte">
            Imprimir
          </button>
        </div>
      </div>
    </div>

    <!-- Reporte generado -->
    <div v-if="reporte" class="space-y-6" id="reporte-content">
      <!-- Resumen general -->
      <div class="card">
        <h2 class="text-xl font-bold mb-4"> Resumen General - {{ formatDate(reporte.fecha) }}</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="bg-blue-50 p-4 rounded-lg">
            <h3 class="font-semibold text-blue-800">Citas</h3>
            <p class="text-2xl font-bold text-blue-900">{{ reporte.resumen.totalCitas }}</p>
            <div class="text-sm text-blue-600 space-y-1">
              <p>Completadas: {{ reporte.resumen.citasCompletadas }}</p>
              <p>Programadas: {{ reporte.resumen.citasProgramadas }}</p>
              <p>Canceladas: {{ reporte.resumen.citasCanceladas }}</p>
            </div>
          </div>

          <div class="bg-green-50 p-4 rounded-lg">
            <h3 class="font-semibold text-green-800">Ingresos por Citas</h3>
            <p class="text-2xl font-bold text-green-900">Bs {{ reporte.resumen.ingresosCitas }}</p>
            <p class="text-sm text-green-600">De {{ reporte.resumen.citasCompletadas }} citas completadas</p>
          </div>

          <div class="bg-yellow-50 p-4 rounded-lg">
            <h3 class="font-semibold text-yellow-800">Ventas</h3>
            <p class="text-2xl font-bold text-yellow-900">{{ reporte.resumen.totalVentas }}</p>
            <p class="text-xl font-semibold text-yellow-800">Bs {{ reporte.resumen.ingresosVentas }}</p>
          </div>

          <div class="bg-purple-50 p-4 rounded-lg">
            <h3 class="font-semibold text-purple-800">Ingresos Totales</h3>
            <p class="text-3xl font-bold text-purple-900">Bs {{ reporte.resumen.ingresosTotal }}</p>
            <p class="text-sm text-purple-600">Citas + Ventas</p>
          </div>
        </div>
      </div>

      <!-- Estadísticas -->
      <div class="card">
        <h2 class="text-xl font-bold mb-4">📈 Estadísticas</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="bg-indigo-50 p-4 rounded-lg">
            <h3 class="font-semibold text-indigo-800">Servicios más solicitados</h3>
            <ul class="text-sm text-indigo-600 mt-2 space-y-1">
              <li v-for="(s, index) in reporte.estadisticas.serviciosMasSolicitados" :key="index">
                {{ s.nombre }} - {{ s.count }} veces - Bs {{ s.ingresos }}
              </li>
            </ul>
          </div>
          <div class="bg-pink-50 p-4 rounded-lg">
            <h3 class="font-semibold text-pink-800">Productos más vendidos</h3>
            <ul class="text-sm text-pink-600 mt-2 space-y-1">
              <li v-for="(p, index) in reporte.estadisticas.productosMasVendidos" :key="index">
                {{ p.nombre }} - {{ p.cantidad }} unidades - Bs {{ p.ingresos }}
              </li>
            </ul>
          </div>
          <div class="bg-teal-50 p-4 rounded-lg">
            <h3 class="font-semibold text-teal-800">Barberos más activos</h3>
            <ul class="text-sm text-teal-600 mt-2 space-y-1">
              <li v-for="(b, index) in reporte.estadisticas.barberosMasActivos" :key="index">
                {{ b.nombre }} - {{ b.citas }} citas - Bs {{ b.ingresos }}
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Ventas del día -->
      <div class="card">
        <h2 class="text-xl font-bold mb-4">🛒 Ventas del Día</h2>
        <div v-if="reporte.ventas.length === 0" class="text-gray-500 text-center py-8">
          No hubo ventas en esta fecha
        </div>
        <div v-else class="overflow-x-auto">
          <table class="table">
            <thead>
              <tr>
                <th>Hora</th>
                <th>Cliente</th>
                <th>Productos</th>
                <th>Cantidad</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="venta in reporte.ventas" :key="venta._id">
                <td>{{ formatTime(venta.fecha) }}</td>
                <td>
                  <div>
                    <p class="font-medium">{{ venta.cliente.nombre }}</p>
                    <p class="text-sm text-gray-600">{{ venta.cliente.telefono }}</p>
                  </div>
                </td>
                <td>
                  <div class="space-y-1">
                    <div v-for="producto in venta.productos" :key="producto._id" class="text-sm">
                      {{ producto.producto.nombre }} <span class="text-gray-600">({{ producto.cantidad }}x)</span>
                    </div>
                  </div>
                </td>
                <td class="font-medium">{{ venta.productos.reduce((sum, p) => sum + p.cantidad, 0) }}</td>
                <td class="font-bold text-green-600">Bs {{ venta.total }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Estado de carga -->
    <div v-if="loading" class="text-center py-12">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      <p class="mt-2 text-gray-600">Generando reporte...</p>
    </div>

    <!-- Sin datos -->
    <div v-if="!reporte && !loading" class="text-center py-12">
      <div class="text-gray-400 text-6xl mb-4">📊</div>
      <h3 class="text-lg font-medium text-gray-900 mb-2">Selecciona una fecha</h3>
      <p class="text-gray-600">Elige una fecha para generar el reporte diario</p>
    </div>
  </div>
</template>

<script>
import api from '../services/api';

export default {
  name: 'Reportes',
  data() {
    // Obtener la fecha local correctamente
    const hoy = new Date();
    const offsetMs = hoy.getTimezoneOffset() * 60000; // minutos a ms
    const fechaLocal = new Date(hoy.getTime() - offsetMs).toISOString().split('T')[0];

    return {
      selectedDate: fechaLocal,
      reporte: null,
      loading: false,
    };
  },
  async mounted() {
    await this.loadReporte();
  },
  methods: {
    async loadReporte() {
      if (!this.selectedDate) return;
      this.loading = true;
      try {
        const response = await api.get(`/reportes/diario/${this.selectedDate}`);
        this.reporte = response.data;
      } catch (error) {
        console.error('Error cargando reporte:', error);
        alert('No se pudo cargar el reporte.');
      } finally {
        this.loading = false;
      }
    },

    exportarReporte() {
      const content = document.getElementById('reporte-content');
      if (!content) return;
      const printWindow = window.open('', '_blank');
      printWindow.document.write(`
        <html>
          <head>
            <title>Reporte ${this.formatDate(this.reporte.fecha)}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              .card { margin-bottom: 20px; padding: 15px; border: 1px solid #ddd; }
              table { width: 100%; border-collapse: collapse; margin: 10px 0; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              th { background-color: #f5f5f5; }
            </style>
          </head>
          <body>${content.innerHTML}</body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    },

    imprimirReporte() {
      this.exportarReporte();
    },

    formatDate(dateString) {
      if (!dateString) return '-';
      // Convertir fecha a bolivia y formatear
      return new Date(dateString + 'T00:00:00').toLocaleDateString('es-BO', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: 'America/La_Paz',
      });
    },

    formatTime(dateString) {
      if (!dateString) return '-';
      return new Date(dateString).toLocaleTimeString('es-BO', {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'America/La_Paz',
      });
    },
  },
};
</script>

<style scoped>
@media print {
  .no-print {
    display: none !important;
  }
}
</style>
