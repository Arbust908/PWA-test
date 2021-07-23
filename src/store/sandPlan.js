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
    },
    actions: {
      saveSandPlan({ commit }, sandPlan) {
        console.log('>>Adding SandPlan', sandPlan);
        console.table(sandPlan);
        commit('ADD_SANDPLAN', sandPlan);
      },
      updateSandPlan({ commit }, sandPlan) {
        commit('UPDATE_SANDPLAN', sandPlan);
      },
    },
  };
  