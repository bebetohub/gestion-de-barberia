<template>
  <div id="app" class="min-h-screen bg-gray-100">
    <Navbar v-if="$route.name !== 'Login'" />
    <main :class="$route.name === 'Login' ? '' : 'container mx-auto px-4 py-8'">
      <router-view />
    </main>
  </div>
</template>

<script>
import Navbar from './components/Navbar.vue'

export default {
  name: 'App',
  components: {
    Navbar
  }
}
</script>