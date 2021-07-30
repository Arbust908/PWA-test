export default {
  state: () => ({
    all: [],
  }),
  getters: {},
  mutations: {
    ADD_SANDPLAN(state, payload) {
      state.all.push(payload);
    },
    UPDATE_SANDPLAN(state, payload) {
      state.all.map((sandPlan, index) => {
        if (sandPlan.id === payload.id) {
          state.all[index] = payload;
        }
      });
    },
    DELETE_SANDPLAN(state, id) {
      state.all = state.all.filter((sandPlan) => {
        return sandPlan.id !== id;
      });
    },
  },
  actions: {
    saveSandPlan({ commit }, sandPlan) {
      commit('ADD_SANDPLAN', sandPlan);
    },
    updateSandPlan({ commit }, sandPlan) {
      commit('UPDATE_SANDPLAN', sandPlan);
    },
    updateSandPlan({ commit }, sandPlanId) {
      commit('DELETE_SANDPLAN', sandPlanId);
    },
  },
};
