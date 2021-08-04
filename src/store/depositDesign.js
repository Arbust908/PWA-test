export default {
  state: () => ({
    all: [],
  }),
  getters: {},
  mutations: {
    SET_DEPOSITDESIGN(state, payload) {
      state.all = payload;
    },
    ADD_DEPOSITDESIGN(state, payload) {
      state.all.push(payload);
    },
    UPDATE_DEPOSITDESIGN(state, payload) {
      state.all.map((deposit, index) => {
        if (deposit.id === payload.id) {
          state.all[index] = payload;
        }
      });
    },
    DELETE_DEPOSITDESIGN(state, payloadId) {
      state.all = state.all.filter((deposit) => deposit.id !== payloadId);
    },
  },
  actions: {
    setDeposit({ commit }, deposit) {
      commit('SET_DEPOSITDESIGN', deposit);
    },
    saveDeposit({ commit }, deposit) {
      commit('ADD_DEPOSITDESIGN', deposit);
    },
    updateDeposit({ commit }, deposit) {
      commit('UPDATE_DEPOSITDESIGN', deposit);
    },
    deleteDeposit({ commit }, depositId) {
      commit('DELETE_DEPOSITDESIGN', depositId);
    },
  },
};
