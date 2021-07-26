export default {
    state: () => ({
      all: [
        {
          id: 0,
          provider: 'Arena san luis',
          sandCarges: [
            {
              id: 0,
              sandType: '30/50',
              quantity: 10,
              boxId: '#abc123'
            },
            {
              id: 1,
              sandType: '40/40',
              quantity: 100,
              boxId: '#bca123'
            },
            {
              id: 2,
              sandType: '10/90',
              quantity: 60,
              boxId: '#abc321'
            }
          ],
          transportId: '#123456',
          loaded: false
        },
        {
          id: 1,
          provider: 'Arena Orange',
          sandCarges: [
            {
              id: 0,
              sandType: '30/50',
              quantity: 40,
              boxId: '#ccc123'
            },
            {
              id: 1,
              sandType: '40/80',
              quantity: 220,
              boxId: '#bca133'
            },
          ],
          transportId: '#12ab56',
          loaded: true
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
        commit('ADD_SANDCENTER', sandCenter);
      },
      updateSandCenter({ commit }, sandCenter) {
        commit('UPDATE_SANDCENTER', sandCenter);
      },
    },
  };
  