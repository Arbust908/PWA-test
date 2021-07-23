export default {
    state: () => ({
      all: [
        {
          pit: 'VC1',
          stages: 3,
          sandStage: [
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
          pit: 'VC2',
          stages: 1,
          sandStage: [
            {
              number: 1,
              sandType: '130/240',
              quantity: 2000,
            }
          ]
        },
        {
          pit: 'VC3',
          stages: 2,
          sandStage: [
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
        console.log('>>Adding SandPlan', sandPlan);
        console.table(sandPlan);
        commit('ADD_SANDPLAN', sandPlan);
      },
      updateSandPlan({ commit }, sandPlan) {
        commit('UPDATE_SANDPLAN', sandPlan);
      },
    },
  };
  