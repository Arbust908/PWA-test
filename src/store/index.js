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

const store = createStore({
    state: {
        user: { username: '', role: 0 },
        workOrders: { all: [] },
    },
    getters: {
        isAdmin(state) {
            return state.user.role == 99;
        },
        isLogged(state) {
            return state.user.role > 0;
        },
        isGuest(state) {
            return state.user.role === 0;
        },
        getUserToken(state) {
            return state.user.token || null;
        },
    },
    actions: {
        setUser({ commit }, user) {
            commit('SET_USER', user);
        },
        logOutUser({ commit }) {
            commit('SET_USER', { username: '', role: 0 });
        },
    },
    mutations: {
        SET_USER(state, payload) {
            state.user = payload;
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
    },
    strict: true,
});
export default store;
