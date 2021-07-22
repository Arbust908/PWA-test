import { createStore } from 'vuex';

// import user from '@/store/user';
import global from '@/store/global';
import workOrders from '@/store/workOrders';
import sand from '@/store/sand';
import sandProviders from '@/store/sandProviders';
import transportProviders from '@/store/transportProviders';
import purchaseOrder from '@/store/purchaseOrder';

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
    workOrders,
    sand,
    sandProviders,
    transportProviders,
    purchaseOrder,
  },
  strict: true,
});

export default store;
