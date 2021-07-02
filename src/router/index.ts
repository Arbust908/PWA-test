import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import Home from '@/pages/Home.vue';

const routes: Array<RouteRecordRaw> = [
    {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/pages/Login.vue')
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('@/pages/About.vue')
  },
  {
    path: '/orden-de-trabajo',
    name: 'WorkOrders',
    component: () => import('@/pages/WorkOrder/Index.vue')
  },
  {
    path: '/orden-de-trabajo/:id',
    name: 'WorkOrderNum',
    component: () => import('@/pages/WorkOrder/_id.vue'),
    beforeEnter: (to, _, next) => {
      const { id } = to.params
      if (Array.isArray(id)) {
        next({ path: '/error' })
        return
      }
      // *** Ordenes de Trabajo Dummy
        const workOrders: Array<WorkOrder> = [
            {id: 1, order_number: 'ac123'},
            {id: 2, order_number: 'ab123'},
            {id: 3, order_number: 'ac321'},
            {id: 4, order_number: 'ax567'},
        ];
      const index = parseInt(id)
      if (index < 0 || index >= workOrders.length) {
        next({ path: '/error' })
        return
      }
      next()
    }
  },
  {
    path: '/orden-de-trabajo/nueva',
    name: 'NewWorkOrder',
    component: () => import('@/pages/WorkOrder/New.vue')
  },
  {
    path: '/componentes',
    name: 'Components',
    component: () => import('@/pages/Components.vue')
  },
  {
    path: '/:catchAll(.*)',
    name: 'PageNotFound',
    component: () => import('@/pages/404.vue')
  }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router;
