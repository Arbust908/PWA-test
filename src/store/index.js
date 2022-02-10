import { createStore } from 'vuex';

import client from '@/store/client';
import cradle from '@/store/cradle';
import depositDesign from '@/store/depositDesign';
import forklifts from '@/store/forklifts';
import global from '@/store/global';
import providerNotification from '@/store/providerNotification';
import purchaseOrder from '@/store/purchaseOrder';
import sand from '@/store/sand';
import sandPlan from '@/store/sandPlan';
import sandProviders from '@/store/sandProviders';
import transportProviders from '@/store/transportProviders';
import workOrders from '@/store/workOrders';
import role from '@/store/roles';
import user from '@/store/user';

const store = createStore({
    state: {
        loggedUser: { id: -1, username: '', role: 0, permissions: null, token: '', visible: false },
    },
    getters: {
        isAdmin(state) {
            return state.loggedUser.role == 99;
        },
        isLogged(state) {
            return state.loggedUser.role > 0;
        },
        isGuest(state) {
            return state.loggedUser.role === 0;
        },
        getLoggedUser(state) {
            return state.loggedUser || null;
        },
        getUserToken(state) {
            return state.loggedUser.token || null;
        },
        getUserPermissions(state) {
            return state.loggedUser.permissions || [];
        },
        getUserVisibiliy(state) {
            return state.loggedUser.visible;
        },
    },
    actions: {
        setUser({ commit }, payload) {
            commit('SET_USER', payload);
        },
        logOutUser({ commit }) {
            commit('SET_USER', { username: '', role: 0 });
        },
        setUserPermissions({ commit }, permissions) {
            commit('SET_USER_PERMISSIONS', permissions);
        },
        setUserRole({ commit }, roleId) {
            commit('SET_USER_ROLE', roleId);
        },
    },
    mutations: {
        SET_USER(state, payload) {
            state.loggedUser = payload;
        },
        SET_USER_PERMISSIONS(state, permissions) {
            state.loggedUser.permissions = permissions;
        },
        SET_USER_ROLE(state, roleId) {
            state.loggedUser.role = roleId;
        },
    },
    modules: {
        client,
        cradle,
        depositDesign,
        forklifts,
        global,
        providerNotification,
        purchaseOrder,
        sand,
        sandPlan,
        sandProviders,
        transportProviders,
        workOrders,
        role,
        user,
    },
    strict: true,
});
export default store;
