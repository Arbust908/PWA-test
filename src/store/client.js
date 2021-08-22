export default {
    state: () => ({
      all: []
    }),
    getters: {
      getClientbyId: state => (id) => {
        return state.all.find(all => all.id === id)
      },
    },
    mutations: {
      SET_CLIENTS(state,payload) {
        state.all = payload
      },
      ADD_CLIENT(state, payload) {
        state.all.push(payload);
      },
      UPDATE_CLIENT(state, payload) {
        state.all.map((client, index) => {
          if (client.id === payload.id) {
            state.all[index] = payload;
          }
        });
      },
    },
    actions: {
      setClients({commit}, clients) {
        commit('SET_CLIENTS', clients)
      },
      saveClient({ commit }, client) {
        const baseC = {
            id: 0,
            name: "",
            address: "",
            legalId: "",
            isOperator: false,
            observations: "",
            companyRepresentativeId: 0,
            companyRepresentative: {},
    };

    commit('ADD_CLIENT', { ...baseC, ...client });
        if (client.isFull) {
        // Axios POST to api to create company
        } else {
        // Axios POST to incomplete company
        }
    },
    updateClient({ commit }, client) {
      commit('UPDATE_CLIENT', client);
        },
    },
};