import store from '@/store';

const recoverLocalUser = () => {
  if (localStorage.getItem('user')) {
    const user = JSON.parse(localStorage.getItem('user'));
    store.dispatch('setUser', user);
  }
};

export const wokrOrdersID = store.state.workOrders.all.reduce((woIds, workOrder) => {
  woIds.push(workOrder.id);
  return woIds;
}, []);
export const isLogged = (to, from, next) => {
  recoverLocalUser();
  const isLogged = store.getters.isLogged;
  if (!isLogged) {
    next({ path: '/login' });
    return;
  } else {
    next();
  }
};
export const isAdmin = (to, from, next) => {
  recoverLocalUser();
  const isAdmin = store.getters.isAdmin;
  if (!isAdmin) {
    next({ path: '/login' });
    return;
  } else {
    next();
  }
};
export const isGuest = (to, from, next) => {
  recoverLocalUser();
  const isGuest = store.getters.isGuest;
  if (isGuest) {
    console.log(to, 'Soy guest voy a Login')
    if (to.path !== '/login') {
      next({ path: '/login' });
      return;
    } else {
      next();
    }
  } else if (to.path === '/login') {
    next({ path: '/' });
    return;
  } else {
    next();
  }
};
export const isValidWO = (to, from, next) => {
  const id = to.params.id;
  if (wokrOrdersID.indexOf(id) === -1) {
    next({ path: '/error' });
    return;
  } else {
    next();
  }
};
