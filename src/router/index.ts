import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import Home from '@/pages/Home.vue';
import store from '@/store';

const isLogged = (to, from, next) => {
  const isLogged = store.getters.isLogged
  if (!isLogged) {
    next({ path: '/login' })
    return
  } else {
    next()
  }
}
const isAdmin = (to, from, next) => {
  const isAdmin = store.getters.isAdmin
  if (!isAdmin) {
    next({ path: '/login' })
    return
  } else {
    next()
  }
}
const isGuest = (to, from, next) => {
  const isGuest = store.getters.isGuest
  if (!isGuest) {
    next({ path: '/login' })
    return
  } else {
    next()
  }
}

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
    name: 'WorkOrderNum',
    component: () => import('@/pages/WorkOrder/_id.vue'),
    beforeEnter: [isLogged, (to, _, next) => {
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
    }]
  },
  {
    path: '/orden-de-trabajo/nueva',
    name: 'NewWorkOrder',
    component: () => import('@/pages/WorkOrder/New.vue'),
    beforeEnter: isLogged,
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
