import store from '@/store';

export const wokrOrdersID = store.state.workOrders.all.reduce((woIds, workOrder) => {
  woIds.push(workOrder.id);
  return woIds;
}, []);
export const isLogged = (to, from, next) => {
  const isLogged = store.getters.isLogged
  if (!isLogged) {
    next({ path: '/login' })
    return
  } else {
    next()
  }
}
export const isAdmin = (to, from, next) => {
  const isAdmin = store.getters.isAdmin
  if (!isAdmin) {
    next({ path: '/login' })
    return
  } else {
    next()
  }
}
export const isGuest = (to, from, next) => {
  const isGuest = store.getters.isGuest
  if (!isGuest) {
    next({ path: '/login' })
    return
  } else {
    next()
  }
}
export const isValidWO = (to, from, next) => {
  const id = to.params.id;
  if (wokrOrdersID.indexOf(id) === -1) {
    next({ path: '/error' })
    return
  } else {
    next()
  }
}