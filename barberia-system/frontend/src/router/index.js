import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Barberos from '../views/Barberos.vue';
import Clientes from '../views/Clientes.vue';
import Servicios from '../views/Servicios.vue';
import Citas from '../views/Citas.vue';
import Productos from '../views/Productos.vue';
import Ventas from '../views/Ventas.vue';
import Reportes from '../views/Reportes.vue';
import Auth from '../views/Auth.vue';
import CambiarContrasena from '../views/CambiarContrasena.vue';
import api from '../services/api';

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Auth,
    meta: { public: true },
  },
  {
    path: '/cambiar-contrasena',
    name: 'CambiarContrasena',
    component: CambiarContrasena,
  },
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/barberos',
    name: 'Barberos',
    component: Barberos,
  },
  {
    path: '/clientes',
    name: 'Clientes',
    component: Clientes,
  },
  {
    path: '/servicios',
    name: 'Servicios',
    component: Servicios,
  },
  {
    path: '/citas',
    name: 'Citas',
    component: Citas,
  },
  {
    path: '/productos',
    name: 'Productos',
    component: Productos,
  },
  {
    path: '/ventas',
    name: 'Ventas',
    component: Ventas,
  },
  {
    path: '/reportes',
    name: 'Reportes',
    component: Reportes,
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/',
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to) => {
  if (to.meta.public) {
    if (to.name === 'Login') {
      try {
        await api.get('/auth/session');
        return { name: 'Home' };
      } catch (error) {
        if (error.response?.status !== 401) {
          console.error('No se pudo verificar la sesión:', error);
        }
      }
    }
    return true;
  }

  try {
    await api.get('/auth/session');
    return true;
  } catch (error) {
    if (error.response?.status !== 401) {
      console.error('No se pudo verificar la sesión:', error);
    }
    return {
      name: 'Login',
      query: { redirect: to.fullPath },
    };
  }
});

export default router;
