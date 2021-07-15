export default {
  state: () => ({
    all: [],
  }),
  getters: {},
  mutations: {
    ADD_WORKORDER(state, payload) {
      state.all.push(payload);
    },
  },
  actions: {
    saveWorkOrder({ commit }, workOrder) {
      commit('ADD_WORKORDER', workOrder);
      if (workOrder.isFull) {
        // Axios POST to api to create work order
      } else {
        // Axios POST to incomplete work order
      }
    },
  },
};
