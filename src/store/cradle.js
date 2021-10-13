export default {
    state: () => ({
      all: [
        {
            id: 1,
            name: "AX-277",
            observatios: "" ,
        },
        {
            id: 2,
            name: "CBO-14",
            observatios: "No funciona correctamente" ,
        } 
        ],
        validations: {}
    }),
    getters: {
      getCradlebyId: state => (id) => {
        return state.all.find(all => all.id === id)
      },
      cradleValidation: state => {
        return state.validations
      }
    },
    mutations: {
      SET_CRADLES(state,payload) {
        state.all = payload
      },
      ADD_CRADLE(state, payload) {
        state.all.push(payload);
      },
      UPDATE_CRADLE(state, payload) {
        state.all.map((cradle, index) => {
          if (cradle.id === payload.id) {
            state.all[index] = payload;
          }
        });
      },
      UPDATE_CRADLE_VALIDATION(state,payload) {
        state.validations[payload.fieldName] = payload.validationsPassed
      }
    },
    actions: {
      cradleUpdateValidation: async({commit}, payload) => {
        await commit('UPDATE_CRADLE_VALIDATION', payload)
      },
      setCradles({commit}, cradle) {
        commit('SET_CRADLES', cradle)
      },
      saveCradle({ commit }, cradle) {
        console.log('>>Adding Cradle', cradle);
        console.table(cradle);
        const cradleS = {
            id: 0,
            name: "",
            observations: ""
    };
    commit('ADD_CRADLE', { ...cradleS, ...cradle });
        if (cradle.isFull) {
        // Axios POST to api to create sand
        } else {
        // Axios POST to incomplete sand
        }
    },
    updateCradle({ commit }, cradle) {
      commit('UPDATE_CRADLE', cradle);
        },
    },
};