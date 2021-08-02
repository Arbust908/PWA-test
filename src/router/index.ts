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
    beforeEnter: isLogged,
  },
  {
    path: '/orden-de-trabajo/nueva',
    name: 'NewWorkOrder',
    component: () => import('@/pages/WorkOrder/New.vue'),
    beforeEnter: isLogged,
  },
  // > :: 
  // PurchaseOrder
  // > ::
  {
    path: '/orden-de-pedido',
    name: 'PurchaseOrders',
    component: () => import('@/pages/PurchaseOrder/Index.vue'),
    beforeEnter: isLogged,
  },
  {
    path: '/orden-de-pedido/:id',
    name: 'PurchaseOrderById',
    component: () => import('@/pages/PurchaseOrder/_id.vue'),
    beforeEnter: isLogged
  },
  {
    path: '/orden-de-pedido/nueva',
    name: 'NewPurchaseOrder',
    component: () => import('@/pages/PurchaseOrder/New.vue'),
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
    beforeEnter: isLogged,
  },
  {
    path: '/tipos-de-arena/nueva',
    name: 'NewSand',
    component: () => import('@/pages/Sand/New.vue'),
    beforeEnter: isLogged,
  },
  {
    path: '/proveedores-de-arena',
    name: 'SandProvider',
    component: () => import('@/pages/SandProvider/index.vue'),
    beforeEnter: isLogged,
  },
  {
    path: '/proveedores-de-arena/:id',
    name: 'SandProviderById',
    component: () => import('@/pages/SandProvider/_id.vue'),
    beforeEnter: isLogged,
  },
  {
    path: '/proveedores-de-arena/nuevo',
    name: 'NewSandProvider',
    component: () => import('@/pages/SandProvider/new.vue'),
     beforeEnter: isLogged,
  },
  {
    path: '/planificacion-de-arena',
    name: 'SandPlans',
    component: () => import('@/pages/SandPlan/Index.vue'),
    beforeEnter: isLogged,
  },
  {
    path: '/planificacion-de-arena/:id',
    name: 'SandPlanById',
    component: () => import('@/pages/SandPlan/_id.vue'),
    beforeEnter: isLogged
  },
  {
    path: '/planificacion-de-arena/nueva',
    name: 'NewSandPlan',
    component: () => import('@/pages/SandPlan/New.vue'),
    beforeEnter: isLogged,
  },
  {
    path: '/proveedores-de-transporte',
    name: 'TransportProvider',
    component: () => import('@/pages/TransportProvider/index.vue'),
    beforeEnter: isLogged,
  },
  {
    path: '/proveedores-de-transporte/:id',
    name: 'TransportProviderById',
    component: () => import('@/pages/TransportProvider/_id.vue'),
    beforeEnter: isLogged,
  },
  {
    path: '/proveedores-de-transporte/nuevo',
    name: 'NewTransportProvider',
    component: () => import('@/pages/TransportProvider/new.vue'),
    beforeEnter: isLogged,
  },
  {
    path: '/notificaciones-a-proveedores',
    name: 'ProviderNotifications',
    component: () => import('@/pages/ProviderNotification/Index.vue'),
    beforeEnter: isLogged,
  },
  {
    path: '/notificaciones-a-proveedores/:id',
    name: 'ProviderNotificationById',
    component: () => import('@/pages/ProviderNotification/_id.vue'),
    beforeEnter: isLogged,
  },
  {
    path: '/notificaciones-a-proveedores/nueva',
    name: 'NewProviderNotification',
    component: () => import('@/pages/ProviderNotification/new.vue'),
    beforeEnter: isLogged,
  },
  {
    path: '/montacargas',
    name: 'Forklift',
    component: () => import('@/pages/Forklift/index.vue'),
    beforeEnter: isLogged,
  },
  {
    path: '/montacargas/:id',
    name: 'ForkliftById',
    component: () => import('@/pages/Forklift/_id.vue'),
    beforeEnter: isLogged,
  },
  {
    path: '/montacargas/nuevp',
    name: 'NewForklift',
    component: () => import('@/pages/Forklift/New.vue'),
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
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;