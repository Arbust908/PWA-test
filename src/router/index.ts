import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import Home from '@/pages/Home.vue';
import store from '@/store';

const wokrOrdersID = store.state.workOrders.all.reduce((woIds, workOrder) => {
  woIds.push(workOrder.id);
  return woIds;
}, []);

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
// Route Guard to check if id param is on workOrdersID array
const isValidWO = (to, from, next) => {
  const id = to.params.id;
  if (wokrOrdersID.indexOf(id) === -1) {
    next({ path: '/error' })
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
    path: '/usuario/salir',
    name: 'UserLogout',
    component: () => import('@/pages/User/Logout.vue'),
    beforeEnter: isLogged,
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
