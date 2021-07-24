import { createStore } from 'vuex';

import global from '@/store/global';
import providerNotification from '@/store/providerNotification';
import purchaseOrder from '@/store/purchaseOrder';
import sand from '@/store/sand';
import sandPlan from '@/store/sandPlan';
import sandProviders from '@/store/sandProviders';
import transportProviders from '@/store/transportProviders';
import workOrders from '@/store/workOrders';
import forklifts from '@/store/forklifts';
import sandCenter from '@/store/sandCenter';

const store = createStore({
  state: {
    user: { username: '', role: 0 },
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
    global,
    providerNotification,
    purchaseOrder,
    sand,
    sand,
    sandPlan,
    sandProviders,
    transportProviders,
    workOrders,
    sandCenter,
  },
  strict: true,
});
export default store;
