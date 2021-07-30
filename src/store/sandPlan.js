export default {
  state: () => ({
    all: [
      {
        id: 0,
        pitId: 0,
        pit: {
          id: 0,
          name: 'VC 1',
        },
        stagesAmount: 2,
        stages: [
          {
            id: 0,
            stage: 1,
            sandId: 1,
            sand: {
              id: 1,
              type: 'type of sand',
              description: 'sand description',
              meshType: 'mesh type',
              grainType: 'grain type',
              observations: 'observations..',
            },
            quantity: 200,
            sandPlanId: 0,
          },
          {
            id: 1,
            stage: 2,
            sandId: 1,
            sand: {
              id: 1,
              type: 'type of sand',
              description: 'sand description',
              meshType: 'mesh type',
              grainType: 'grain type',
              observations: 'observations..',
            },
            quantity: 100,
            sandPlanId: 0,
          },
        ],
      },
    ],
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
      commit('ADD_SANDPLAN', sandPlan);
    },
    updateSandPlan({ commit }, sandPlan) {
      commit('UPDATE_SANDPLAN', sandPlan);
    },
  },
};
