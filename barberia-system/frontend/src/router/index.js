import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Barberos from '../views/Barberos.vue';
import Clientes from '../views/Clientes.vue';
import Servicios from '../views/Servicios.vue';
import Citas from '../views/Citas.vue';
import Productos from '../views/Productos.vue';
import Ventas from '../views/Ventas.vue';
import Reportes from '../views/Reportes.vue';

const routes = [
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
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
