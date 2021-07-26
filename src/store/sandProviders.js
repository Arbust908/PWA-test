export default {
  state: () => ({
    all: [],
  }),
  getters: {},
  mutations: {
    SET_SANDPROVIDERS(state,payload) {
      state.all = payload
    },
    ADD_SANDPROVIDER(state, payload) {
      state.all.push(payload);
    },
    UPDATE_SANDPROVIDER(state, payload) {
      state.all.map((sandProvider, index) => {
        if (sandProvider.id === payload.id) {
          state.all[index] = payload;
        }
      });
    },
    DELETE_SANDPROVIDER(state, payload) {
      state.all.map((sandProvider, index) => {
        if (sandProvider.id === payload.id) {
          state.all[index] = payload;
        }
      });
      state.all.splice(state.all.findIndex(function(i){
        return i.id === payload;
      }), 1);
    },
  },
  actions: {
    setSandProviders({commit}, sandProviders) {
      commit('SET_SANDPROVIDERS', sandProviders)
    },
    saveSandProvider({ commit }, sandProvider) {
      const baseSP = {
        id: 0,
        name: "",
        legalName: "",
        legalId: 0,
        meshType: "",
        grains: "",
        observations: "",
        companyRepresentativeId: 0
      };
      commit('ADD_SANDPROVIDER', { ...baseSP, ...sandProvider });
      if (sandProvider.isFull) {
        // Axios POST to api to create sand provider
      } else {
        // Axios POST to incomplete sand provider
      }
    },
    updateSandProvider({ commit }, sandProvider) {
      commit('UPDATE_SANDPROVIDER', sandProvider);
    },
    deleteSandProvider({ commit }, sandProviderId) {
      commit('DELETE_SANDPROVIDER', sandProviderId);
    },
  },
};
