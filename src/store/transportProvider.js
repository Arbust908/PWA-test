export default {
  state: () => ({
    all: [],
  }),
  getters: {},
  mutations: {
    SET_TRANSPORTPROVIDERS(state,payload) {
      state.all = payload
    },
    ADD_TRANSPORTPROVIDER(state, payload) {
      state.all.push(payload);
    },
    UPDATE_TRANSPORTPROVIDER(state, payload) {
      state.all.map((transportProvider, index) => {
        if (transportProvider.id === payload.id) {
          state.all[index] = payload;
        }
      });
    },
    DELETE_TRANSPORTPROVIDER(state, payload) {
      state.all.map((transportProvider, index) => {
        if (transportProvider.id === payload.id) {
          state.all[index] = payload;
        }
      });
      state.all.splice(state.all.findIndex(function(i){
        return i.id === payload;
      }), 1);
    },
  },
  actions: {
    setTransportProviders({commit}, transportProviders) {
      commit('SET_TRANSPORTPROVIDERS', transportProviders)
    },
    saveTransportProvider({ commit }, transportProvider) {
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
      commit('ADD_TRANSPORTPROVIDER', { ...baseSP, ...transportProvider });
      // if (transportProvider.isFull) {
      //   // Axios POST to api to create transport provider
      // } else {
      //   // Axios POST to incomplete transport provider
      // }
    },
    updateTransportProvider({ commit }, transportProvider) {
      commit('UPDATE_TRANSPORTPROVIDER', transportProvider);
    },
    deleteTransportProvider({ commit }, transportProviderId) {
      commit('DELETE_TRANSPORTPROVIDER', transportProviderId);
    },
  },
};
