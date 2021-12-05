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
        loggedUser: { username: '', role: 0 },
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
        getUserToken(state) {
            return state.loggedUser.token || null;
        },
    },
    actions: {
        setUser({ commit }, payload) {
            commit('SET_USER', payload);
        },
        logOutUser({ commit }) {
            commit('SET_USER', { username: '', role: 0 });
        },
    },
    mutations: {
        SET_USER(state, payload) {
            state.loggedUser = payload;
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
