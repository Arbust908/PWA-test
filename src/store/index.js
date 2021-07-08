import { createStore } from 'vuex';

// import user from '@/store/user';
import global from '@/store/global';
import workOrders from '@/store/workOrders';

const store = createStore({
  state: {
    user: { name: '', role: 0 },
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
  },
  actions: {
    setUser({ commit }, user) {
      commit('SET_USER', user);
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
  },
  strict: true,
});

export default store;
