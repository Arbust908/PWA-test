export default {
    state: () => ({
      all: [
        {
          id: 0,
          pit: 'VC1',
          stages: 3,
          sandStages: [
            {
              number: 1,
              sandType: '30/40',
              quantity: 100,
            },
            {
              number: 2,
              sandType: '60/60',
              quantity: 50,
            },
            {
              number: 3,
              sandType: '130/240',
              quantity: 20,
            }
          ]
        },
        {
          id: 1,
          pit: 'VC2',
          stages: 1,
          sandStages: [
            {
              number: 1,
              sandType: '130/240',
              quantity: 2000,
            }
          ]
        },
        {
          id: 2,
          pit: 'VC3',
          stages: 2,
          sandStages: [
            {
              number: 1,
              sandType: '30/40',
              quantity: 100,
            },
            {
              number: 2,
              sandType: '60/60',
              quantity: 50,
            },
          ]
        }
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
  