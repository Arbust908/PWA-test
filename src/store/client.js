export default {
    state: () => ({
      all: [
        // {
        //     id: 1,
        //     name: "Cliente1",
        //     businessName: "YPF",
        //     socialNumber: "1399546",
        //     representativeLabor: "Ejemplo",
        //     representativeData: "mail,telefono",
        //     representativeContact: "contacto",
        //     observations: "observacion"
        // },
        // {
        //     id: 2,
        //     name: "Cliente2",
        //     businessName: "OTRO",
        //     socialNumber: "numero",
        //     representativeLabor: "Ejemplo2",
        //     representativeData: "mail,telefono",
        //     representativeContact: "contacto",
        //     observations: "observacion"
        // },
       ]
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
            client.all[index] = payload;
          }
        });
      },
    },
    actions: {
      setClients({commit}, clients) {
        commit('SET_CLIENTS', clients)
      },
      saveClient({ commit }, client) {
        console.log('>>Adding Client STORE', client);
        console.table(client);
        const baseC = {
            id: 0,
            name: "",
            legalName: "",
            legalId: "",
            isOperator: false,
            observations: "",
            companyRepresentativeId: "",
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