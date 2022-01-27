import store from '@/store';
import axios from 'axios';
const api = import.meta.env.VITE_API_URL || '/api';

const recoverLocalUser = () => {
    if (localStorage.getItem('user')) {
        const user = JSON.parse(localStorage.getItem('user') || '');
        store.dispatch('setUser', user);
    }
};

export const wokrOrdersID = store.state.workOrders.all.reduce((woIds: any[], workOrder: { id: any }) => {
    woIds.push(workOrder.id);

    return woIds;
}, []);

export const isLogged = (to: any, from: any, next: any) => {
    recoverLocalUser();
    const isLoggedIn = store.getters.isLogged;

    if (!isLoggedIn) {
        next({ path: '/notLogged' });

        return;
    } else {
        next();
    }
};

export const isAdmin = (to: any, from: any, next: any) => {
    recoverLocalUser();
    const isUserAnAdmin = store.getters.isAdmin;

    if (!isUserAnAdmin) {
        next({ path: '/login' });

        return;
    } else {
        next();
    }
};

export const isGuest = (to, from, next) => {
    recoverLocalUser();
    const isUserGuest = store.getters.isGuest;

    if (isUserGuest) {
        if (to.path !== '/login') {
            next({ path: '/denied' });

            return;
        } else {
            next();
        }
    } else if (to.path === '/denied') {
        next({ path: '/' });

        return;
    } else {
        next();
    }
};

export const isValidWO = (to: any, from: any, next: any) => {
    const id = to.params.id;

    if (wokrOrdersID.indexOf(id) === -1) {
        next({ path: '/error' });

        return;
    } else {
        next();
    }
};

export const goToLogin = (to: any, from: any, next: any) => {
    recoverLocalUser();
    const isLoggedIn = store.getters.isLogged;

    if (!isLoggedIn) {
        next({ path: '/login' });

        return;
    } else {
        next({ path: '/home' });
    }
};

export const isMobile = (to: any, from: any, next: any) => {
    if (window.innerWidth < 640) {
        next({ path: '/no-mobile' });
    } else {
        next();
    }
};

export const isMobileAndLogged = (to: any, from: any, next: any) => {
    recoverLocalUser();
    const isLoggedIn = store.getters.isLogged;

    if (!isLoggedIn) {
        next({ path: '/notLogged' });

        return;
    } else {
        if (window.innerWidth < 640) {
            next({ path: '/no-mobile' });
        } else {
            next();
        }
    }
};

export const checkPermission = async (to: any, from: any, next: any) => {
    const loggedUser = store.state.loggedUser;
    const userFromApi = await (await axios.get(`${api}/user/${loggedUser.id}`)).data.data;
    const { visible, roleId } = userFromApi;

    let storePermissions = loggedUser.permissions;
    let userChanged = false;
    const role = await (await axios.get(`${api}/role/${roleId}`)).data.data;
    storePermissions = role.permissions;

    if (loggedUser.role !== roleId) {
        // console.log('Cambio el Role o su Id');
        store.dispatch('setUserRole', roleId);
        loggedUser.role = roleId;
        userChanged = true;
    }

    if (loggedUser.visible !== visible) {
        // console.log('Cambio la Visibilidad');
        loggedUser.visible = visible;
        userChanged = true;
    }

    if (JSON.stringify(storePermissions) !== JSON.stringify(loggedUser.permissions)) {
        // console.log('Los permisos en local Cambiaron');
        store.dispatch('setUserPermissions', storePermissions);
        loggedUser.permissions = storePermissions;
        userChanged = true;
    }

    if (userChanged) {
        // console.log('Cambio el Usuario');
        localStorage.setItem('user', JSON.stringify(loggedUser));
    }

    if (!visible) {
        next({ name: 'Error-403' });

        return;
    }

    //TODO: usar el permissionManager
    const permissions = JSON.parse(JSON.stringify(storePermissions));
    const actualRoute = to.name;

    // check if has permissions
    if (permissions.view.includes(actualRoute)) {
        next();
    } else {
        next({ name: 'Error-403' });
    }
};
