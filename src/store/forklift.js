export default {
  state: () => ({
    all: [],
  }),
  getters: {},
  mutations: {
    SET_FORKLIFTS(state,payload) {
      state.all = payload
    },
    ADD_FORKLIFT(state, payload) {
      state.all.push(payload);
    },
    UPDATE_FORKLIFT(state, payload) {
      state.all.map((forklift, index) => {
        if (forklift.id === payload.id) {
          state.all[index] = payload;
        }
      });
    },
    DELETE_FORKLIFT(state, payload) {
      state.all.map((forklift, index) => {
        if (forklift.id === payload.id) {
          state.all[index] = payload;
        }
      });
      state.all.splice(state.all.findIndex(function(i){
        return i.id === payload;
      }), 1);
    },
  },
  actions: {
    setForklift({commit}, forklifts) {
      commit('SET_FORKLIFTS', forklifts)
    },
    saveForklift({ commit }, forklift) {
      const baseTP = {
        id: 0,
        name: "",
        legalName: "",
        legalId: 0,
        meshType: "",
        grains: "",
        observations: "",
        companyRepresentativeId: 0
      };
      commit('ADD_FORKLIFT', { ...baseTP, ...forklift });
      // if (forklift.isFull) {
      //   // Axios POST to api to create forklift
      // } else {
      //   // Axios POST to incomplete forklift
      // }
    },
    updateForklift({ commit }, forklift) {
      commit('UPDATE_FORKLIFT', forklift);
    },
    deleteForklift({ commit }, forkliftId) {
      commit('DELETE_FORKLIFT', forkliftId);
    },
  },
};
