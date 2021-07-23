export default {
    state: () => ({
      all: [
        {
          id: 0,
          provider: 'Arena san luis',
          
        }
      ],
    }),
    getters: {},
    mutations: {
      ADD_SANDCENTER(state, payload) {
        state.all.push(payload);
      },
      UPDATE_SANDCENTER(state, payload) {
        state.all.map((sandCenter, index) => {
          if (sandCenter.id === payload.id) {
            state.all[index] = payload;
          }
        });
      },
    },
    actions: {
      saveSandCenter({ commit }, sandCenter) {
        console.log('>>Adding Work Order', sandCenter);
        console.table(sandCenter);
        commit('ADD_SANDCENTER', sandCenter);
      },
      updateSandCenter({ commit }, sandCenter) {
        commit('UPDATE_SANDCENTER', sandCenter);
      },
    },
  };
  