<template>
  <nav class="bg-blue-800 text-white shadow-lg">
    <div class="container mx-auto px-4">
      <div class="flex justify-between items-center py-4">
        <div class="flex items-center space-x-4">
          <h1 class="text-xl font-bold">💈🔥 Barbería Mecha</h1>
        </div>
        
        <div class="hidden xl:flex flex-wrap justify-end gap-1">
          <router-link 
            v-for="item in menuItems" 
            :key="item.name"
            :to="item.path" 
            class="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition duration-200"
            :class="{
              'bg-blue-900': $route.path === item.path
            }"
          >
            {{ item.name }}
          </router-link>
          <router-link
            to="/cambiar-contrasena"
            class="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition duration-200"
            :class="{ 'bg-blue-900': $route.path === '/cambiar-contrasena' }"
          >
            Cambiar contraseña
          </router-link>
          <button
            @click="logout"
            class="px-3 py-2 rounded-md text-sm font-medium hover:bg-red-700 transition duration-200"
          >
            Cerrar sesión
          </button>
        </div>

        <!-- Menú móvil -->
        <div class="xl:hidden">
          <button 
            @click="mobileMenuOpen = !mobileMenuOpen"
            class="p-2 rounded-md hover:bg-blue-700"
          >
            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                    d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
        </div>
      </div>

      <!-- Menú móvil desplegable -->
      <div v-show="mobileMenuOpen" class="xl:hidden pb-4">
        <div class="flex flex-col space-y-2">
          <router-link 
            v-for="item in menuItems" 
            :key="item.name"
            :to="item.path" 
            class="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition duration-200"
            :class="{
              'bg-blue-900': $route.path === item.path
            }"
            @click="mobileMenuOpen = false"
          >
            {{ item.name }}
          </router-link>
          <router-link
            to="/cambiar-contrasena"
            class="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition duration-200"
            @click="mobileMenuOpen = false"
          >
            Cambiar contraseña
          </router-link>
          <button
            @click="logout"
            class="px-3 py-2 text-left rounded-md text-sm font-medium hover:bg-red-700 transition duration-200"
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import api from '../services/api'

export default {
  name: 'Navbar',
  data() {
    return {
      mobileMenuOpen: false,
      menuItems: [
        { name: 'Inicio', path: '/' },
        { name: 'Barberos', path: '/barberos' },
        { name: 'Clientes', path: '/clientes' },
        { name: 'Servicios', path: '/servicios' },
        { name: 'Citas', path: '/citas' },
        { name: 'Productos', path: '/productos' },
        { name: 'Ventas', path: '/ventas' },
        { name: 'Reportes', path: '/reportes' }
      ]
    }
  },
  methods: {
    async logout() {
      try {
        await api.post('/auth/logout')
        this.mobileMenuOpen = false
        await this.$router.replace({ name: 'Login' })
      } catch (error) {
        console.error('Error cerrando sesión:', error)
        alert('No se pudo cerrar la sesión. Intenta nuevamente.')
      }
    }
  }
}
</script>