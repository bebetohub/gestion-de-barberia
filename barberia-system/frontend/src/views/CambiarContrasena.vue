<template>
  <section class="mx-auto max-w-xl">
    <h1 class="mb-6 text-3xl font-bold text-gray-900">Cambiar contraseña</h1>
    <form class="card space-y-5" @submit.prevent="changePassword">
      <p v-if="message" class="rounded-md bg-green-50 p-3 text-sm text-green-700" role="status">
        {{ message }}
      </p>
      <p v-if="error" class="rounded-md bg-red-50 p-3 text-sm text-red-700" role="alert">
        {{ error }}
      </p>
      <div>
        <label for="currentPassword" class="form-label">Contraseña actual</label>
        <input
          id="currentPassword"
          v-model="form.currentPassword"
          type="password"
          autocomplete="current-password"
          class="form-input"
          required
        >
      </div>
      <div>
        <label for="newPassword" class="form-label">Nueva contraseña</label>
        <input
          id="newPassword"
          v-model="form.newPassword"
          type="password"
          autocomplete="new-password"
          minlength="8"
          maxlength="72"
          class="form-input"
          required
        >
        <p class="mt-1 text-xs text-gray-500">
          Debe tener al menos 8 caracteres.
        </p>
      </div>
      <div>
        <label for="confirmPassword" class="form-label">Confirmar nueva contraseña</label>
        <input
          id="confirmPassword"
          v-model="form.confirmPassword"
          type="password"
          autocomplete="new-password"
          minlength="8"
          maxlength="72"
          class="form-input"
          required
        >
      </div>
      <button type="submit" class="btn-primary" :disabled="loading">
        {{ loading ? 'Guardando...' : 'Actualizar contraseña' }}
      </button>
    </form>
  </section>
</template>

<script>
import api from '../services/api'

export default {
  name: 'CambiarContrasena',
  data() {
    return {
      loading: false,
      message: '',
      error: '',
      form: {
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      },
    }
  },
  methods: {
    async changePassword() {
      this.message = ''
      this.error = ''
      if (this.form.newPassword !== this.form.confirmPassword) {
        this.error = 'La confirmación no coincide con la nueva contraseña.'
        return
      }

      this.loading = true
      try {
        const response = await api.post('/auth/change-password', {
          currentPassword: this.form.currentPassword,
          newPassword: this.form.newPassword,
        })
        this.message = response.data.message
        this.form = { currentPassword: '', newPassword: '', confirmPassword: '' }
      } catch (error) {
        console.error('Error cambiando contraseña:', error)
        this.error = error.response?.data?.error || 'No se pudo cambiar la contraseña.'
      } finally {
        this.loading = false
      }
    },
  },
}
</script>
