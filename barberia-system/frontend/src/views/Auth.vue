<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-10">
    <section class="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">
      <div class="mb-6 text-center">
        <div class="mb-3 text-4xl">💈</div>
        <h1 class="text-2xl font-bold text-gray-900">Barbería Mecha</h1>
        <p class="mt-2 text-sm text-gray-600">
          {{ setupRequired ? 'Crea la cuenta inicial de administrador' : 'Inicia sesión para continuar' }}
        </p>
      </div>

      <p v-if="error" class="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700" role="alert">
        {{ error }}
      </p>
      <p v-if="setupRequired === null" class="text-center text-gray-600">
        Verificando configuración...
      </p>

      <form v-else @submit.prevent="submit" class="space-y-5">
        <div>
          <label for="usuario" class="form-label">Usuario</label>
          <input
            id="usuario"
            v-model.trim="form.usuario"
            class="form-input"
            type="text"
            autocomplete="username"
            minlength="3"
            maxlength="30"
            required
          >
        </div>
        <div>
          <label for="password" class="form-label">Contraseña</label>
          <input
            id="password"
            v-model="form.password"
            class="form-input"
            type="password"
            :autocomplete="setupRequired ? 'new-password' : 'current-password'"
            minlength="8"
            maxlength="72"
            required
          >
          <p v-if="setupRequired" class="mt-1 text-xs text-gray-500">
            Usa al menos 8 caracteres. Esta cuenta inicial solo se puede crear una vez.
          </p>
        </div>
        <div v-if="setupRequired">
          <label for="setupSecret" class="form-label">Clave de configuración inicial</label>
          <input
            id="setupSecret"
            v-model="form.setupSecret"
            class="form-input"
            type="password"
            autocomplete="off"
            required
          >
          <p class="mt-1 text-xs text-gray-500">
            La proporciona quien instaló el sistema; se configura en el archivo backend/.env.
          </p>
        </div>
        <button type="submit" class="btn-primary w-full" :disabled="loading">
          {{ loading ? 'Procesando...' : setupRequired ? 'Crear cuenta e ingresar' : 'Iniciar sesión' }}
        </button>
      </form>
    </section>
  </div>
</template>

<script>
import api from '../services/api'

export default {
  name: 'Auth',
  data() {
    return {
      setupRequired: null,
      loading: false,
      error: '',
      form: {
        usuario: '',
        password: '',
        setupSecret: '',
      },
    }
  },
  async mounted() {
    try {
      const response = await api.get('/auth/setup-status')
      this.setupRequired = response.data.setupRequired
    } catch (error) {
      console.error('Error consultando la configuración de acceso:', error)
      this.error = 'No se pudo conectar con el servidor. Verifica que el backend esté iniciado.'
    }
  },
  methods: {
    async submit() {
      this.loading = true
      this.error = ''
      try {
        const endpoint = this.setupRequired ? '/auth/setup' : '/auth/login'
        await api.post(endpoint, this.form)
        const redirect = this.$route.query.redirect
        const destination =
          typeof redirect === 'string' && redirect.startsWith('/') && !redirect.startsWith('//')
            ? redirect
            : '/'
        await this.$router.replace(destination)
      } catch (error) {
        console.error('Error autenticando usuario:', error)
        this.error = error.response?.data?.error || 'No se pudo completar el inicio de sesión.'
        if (error.response?.status === 409) {
          this.setupRequired = false
        }
      } finally {
        this.loading = false
      }
    },
  },
}
</script>
