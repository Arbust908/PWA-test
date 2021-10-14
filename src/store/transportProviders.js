export default {
  state: () => ({
    all: [],
    validations: {}
  }),
  getters: {
    transportProviderValidation: state => {
      return state.validations
    }
  },
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
    UPDATE_TRANSPORTPROVIDER_VALIDATION(state,payload) {
      state.validations[payload.fieldName] = payload.validationsPassed
    },
    TRANSPORTPROVIDER_DELETE_VALIDATION(state,payload) {
      delete state.validations[payload]
    }
  },
  actions: {
    transportProviderDeleteValidation: async({commit}, payload) => {
      await commit('TRANSPORTPROVIDER_DELETE_VALIDATION', payload)
    },
    transportProviderUpdateValidation: async({commit}, payload) => {
      await commit('UPDATE_TRANSPORTPROVIDER_VALIDATION', payload)
    },
    setTransportProviders({commit}, transportProviders) {
      commit('SET_TRANSPORTPROVIDERS', transportProviders)
    },
    saveTransportProvider({ commit }, transportProvider) {
      const baseTP = {
        id: 0,
        name: "",
        legalId: 0,
        meshType: [],
        observations: "",
        companyRepresentativeId: 0
      };
      commit('ADD_TRANSPORTPROVIDER', { ...baseTP, ...transportProvider });
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
