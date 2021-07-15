export default {
  state: () => ({
    all: [],
  }),
  getters: {},
  mutations: {
    ADD_WORKORDER(state, payload) {
      state.all.push(payload);
    },
    UPDATE_WORKORDER(state, payload) {
      state.all.map((workOrder, index) => {
        if (workOrder.id === payload.id) {
          state.all[index] = payload;
        }
      });
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
    updateWorkOrder({ commit }, workOrder) {
      commit('UPDATE_WORKORDER', workOrder);
    },
  },
};
