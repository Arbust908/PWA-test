export default {
  state: () => ({
    all: [],
  }),
  getters: {},
  mutations: {
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
  },
  actions: {
    saveSandProvider({ commit }, sandProvider) {
      console.table(sandProvider);
      const baseSP = {
        id: 0,
        name: "",
        legalName: "",
        legalId: 0,
        meshType: "",
        grains: "",
        observations: "",
        companyRepresentativeId: 0,
        // CompanyRepresentative?: CompanyRepresentative,
      };
      commit('ADD_SANDPROVIDER', { ...baseSP, ...sandProvider });
      if (sandProvider.isFull) {
        // Axios POST to api to create sand provider
      } else {
        // Axios POST to incomplete sand provider
      }
    },
    updateSandProvider({ commit }, sandProvider) {
      console.log("update!!!", sandProvider)

      commit('UPDATE_SANDPROVIDER', sandProvider);
    },
  },
};
