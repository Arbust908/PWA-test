import store from '@/store';

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

export const checkPermission = (to: any, from: any, next: any) => {
    const storePermissions = store.state.loggedUser.permissions;

    //TODO: usar el permissionManager
    const permissions = JSON.parse(JSON.stringify(storePermissions));

    const actualRoute = to.name;

    // check if has permissions
    if (permissions.view.includes(actualRoute)) {
        next();
    } else {
        next({ path: '/notLogged' });
    }
};
