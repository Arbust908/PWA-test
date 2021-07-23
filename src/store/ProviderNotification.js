export default {
    state: () => ({
      all: [],
    }),
    getters: {},
    mutations: {
      ADD_PROVIDERNOTIFICATION(state, payload) {
        state.all.push(payload);
      },
      UPDATE_PROVIDERNOTIFICATION(state, payload) {
        state.all.map((providerNotification, index) => {
          if (providerNotification.id === payload.id) {
            state.all[index] = payload;
          }
        });
      },
    },
    actions: {
      saveProviderNotification({ commit }, providerNotification) {
        console.log('>>Adding Work Order', providerNotification);
        console.table(providerNotification);
        commit('ADD_PROVIDERNOTIFICATION', providerNotification);
      },
      updateProviderNotification({ commit }, providerNotification) {
        commit('UPDATE_PROVIDERNOTIFICATION', providerNotification);
      },
    },
  };
  