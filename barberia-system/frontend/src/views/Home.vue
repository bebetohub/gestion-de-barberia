<template>
  <div>
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">Dashboard - Barbería Mecha</h1>
      <p class="text-gray-600">Resumen general del negocio</p>
    </div>

    <!-- Tarjetas de resumen -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div class="card">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-blue-100 text-blue-600">
            <!-- icono -->
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Citas Hoy</p>
            <p class="text-2xl font-bold text-gray-900">{{ stats.citasHoy }}</p>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-green-100 text-green-600">
            <!-- icono -->
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Ingresos Hoy</p>
            <p class="text-2xl font-bold text-gray-900">Bs {{ stats.ingresosHoy }}</p>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-yellow-100 text-yellow-600">
            <!-- icono -->
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Productos Vendidos</p>
            <p class="text-2xl font-bold text-gray-900">{{ stats.productosVendidos }}</p>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-red-100 text-red-600">
            <!-- icono -->
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Stock Bajo</p>
            <p class="text-2xl font-bold text-gray-900">{{ stats.stockBajo }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Próximas citas y productos stock bajo -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="card">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Próximas Citas</h2>
        <div v-if="proximasCitas.length === 0" class="text-gray-500">
          No hay citas programadas para hoy
        </div>
        <div v-else class="space-y-3">
          <div 
            v-for="cita in proximasCitas.slice(0, 5)" 
            :key="cita._id"
            class="flex justify-between items-center p-3 bg-gray-50 rounded"
          >
            <div>
              <p class="font-medium">{{ cita.cliente.nombre }}</p>
              <p class="text-sm text-gray-600">{{ cita.barbero.nombre }}</p>
            </div>
            <div class="text-right">
              <p class="font-medium">{{ cita.hora }}</p>
              <p class="text-sm text-gray-600">${{ cita.total }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="card">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Productos con Stock Bajo</h2>
        <div v-if="productosStockBajo.length === 0" class="text-gray-500">
          Todos los productos tienen stock suficiente
        </div>
        <div v-else class="space-y-3">
          <div 
            v-for="producto in productosStockBajo.slice(0, 5)" 
            :key="producto._id"
            class="flex justify-between items-center p-3 bg-red-50 rounded"
          >
            <div>
              <p class="font-medium">{{ producto.nombre }}</p>
              <p class="text-sm text-gray-600">Mínimo: {{ producto.stockMinimo }}</p>
            </div>
            <div class="text-right">
              <p class="font-bold text-red-600">{{ producto.stock }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../services/api'

export default {
  name: 'Home',
  data() {
    return {
      stats: {
        citasHoy: 0,
        ingresosHoy: 0,
        productosVendidos: 0,
        stockBajo: 0
      },
      proximasCitas: [],
      productosStockBajo: []
    }
  },
  async mounted() {
    await this.loadDashboardData()
  },
  methods: {
    async loadDashboardData() {
      try {
        // Obtener la fecha de hoy en Bolivia (UTC-4)
        const hoy = (() => {
          const fecha = new Date();
          const partes = new Intl.DateTimeFormat('en-CA', {
            timeZone: 'America/La_Paz',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
          }).formatToParts(fecha);
          const year = partes.find(p => p.type === 'year').value;
          const month = partes.find(p => p.type === 'month').value;
          const day = partes.find(p => p.type === 'day').value;
          return `${year}-${month}-${day}`;
        })();

        // Cargar citas de hoy
        const citasResponse = await api.get(`/citas/fecha/${hoy}`);
        this.proximasCitas = citasResponse.data.filter(cita => cita.estado === 'programada');
        this.stats.citasHoy = citasResponse.data.length;

        // Cargar reporte diario
        try {
          const reporteResponse = await api.get(`/reportes/diario/${hoy}`);
          this.stats.ingresosHoy = reporteResponse.data.resumen.ingresosTotal;
          this.stats.productosVendidos = reporteResponse.data.resumen.totalVentas;
        } catch (error) {
          console.warn('No se pudo cargar el reporte del día');
        }

        // Cargar productos con stock bajo
        const productosResponse = await api.get('/productos/stock-bajo');
        this.productosStockBajo = productosResponse.data;
        this.stats.stockBajo = productosResponse.data.length;

      } catch (error) {
        console.error('Error cargando datos del dashboard:', error);
      }
    }
  }
}
</script>
