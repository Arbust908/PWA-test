export default {
    state: () => ({
      all: [],
      validations: {}
    }),
    getters: {
      getSandbyId: state => (id) => {
        return state.all.find(all => all.id === id)
      },
      sandValidation: state => {
        return state.validations
      }
    },
    mutations: {
      ADD_SAND(state, payload) {
        state.all.push(payload);
      },
      UPDATE_SAND(state, payload) {
        state.all.map((sand, index) => {
          if (sand.id === payload.id) {
            state.all[index] = payload;
          }
        });
      },
      UPDATE_SAND_VALIDATION(state,payload) {
        state.validations[payload.fieldName] = payload.validationsPassed
      }
    },
    actions: {
      sandUpdateValidation: async({commit}, payload) => {
        await commit('UPDATE_SAND_VALIDATION', payload)
      },
      saveSand({ commit }, sand) {
        // console.log('>>Adding Sand', sand);
        console.table(sand);
        const baseS = {
            id: 0,
            type: "",
            description: "",
            meshType: "",
            grainType: "",
            observations: ""
    };
    commit('ADD_SAND', { ...baseS, ...sand });
        if (sand.isFull) {
        // Axios POST to api to create sand
        } else {
        // Axios POST to incomplete sand
        }
    },
    updateSand({ commit }, sand) {
      commit('UPDATE_SAND', sand);
        },
    },
};