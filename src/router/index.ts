import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import Home from '@/pages/Home.vue';
import { isLogged, isAdmin, isGuest } from '@/router/guards';


const routes: Array<RouteRecordRaw> = [
    {
    path: '/',
    name: 'Home',
    component: Home,
    beforeEnter: isLogged,
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/pages/Login.vue'),
    beforeEnter: isGuest,
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('@/pages/About.vue'),
    beforeEnter: isLogged,
  },
  {
    path: '/orden-de-trabajo',
    name: 'WorkOrders',
    component: () => import('@/pages/WorkOrder/Index.vue'),
    beforeEnter: isLogged,
  },
  {
    path: '/orden-de-trabajo/:id',
    name: 'WorkOrderById',
    component: () => import('@/pages/WorkOrder/_id.vue'),
    beforeEnter: isLogged
  },
  {
    path: '/orden-de-trabajo/nueva',
    name: 'NewWorkOrder',
    component: () => import('@/pages/WorkOrder/New.vue'),
    beforeEnter: isLogged,
  },
  {
    path: '/tipos-de-arena',
    name: 'Sand',
    component: () => import('@/pages/Sand/Index.vue'),
    beforeEnter: isLogged,
  },
  {
    path: '/tipos-de-arena/:id',
    name: 'SandById',
    component: () => import('@/pages/Sand/_id.vue'),
    beforeEnter: isLogged
  },
  {
    path: '/tipos-de-arena/nueva',
    name: 'NewSand',
    component: () => import('@/pages/Sand/New.vue'),
    beforeEnter: isLogged,
  },
  {
    path: '/usuario/salir',
    name: 'UserLogout',
    component: () => import('@/pages/User/Logout.vue'),
    beforeEnter: isLogged,
  },
  {
    path: '/usuario/admin',
    name: 'UserAdmin',
    component: () => import('@/pages/User/Admin.vue'),
    beforeEnter: isAdmin,
  },
  {
    path: '/:catchAll(.*)',
    name: 'PageNotFound',
    component: () => import('@/pages/404.vue'),
  }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router;
