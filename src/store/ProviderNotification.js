export default {
    state: () => ({
      all: [
        {
          id: 1,
          sandProvider: 'Sand Provider 1',
          sandOrder: [
            {
              id: 1,
              sandType: 'Sand Type 1',
              amount: 1,
            },
            {
              id: 2,
              sandType: 'Sand Type 2',
              amount: 2,
            }
          ],
          transportProviders: [
            {
              id: 1,
              name: 'Transport Provider 1',
              amount: 1,
              observation: 'Observations 1',
            },
            {
              id: 2,
              name: 'Transport Provider 2',
              amount: 2,
              observation: 'Observations 2',
            },
          ],
        },
      ],
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
      DELETE_PROVIDERNOTIFICATION(state, pNId) {
        state.all = state.all.filter((pN) => {
          return pN.id !== pNId
        });
      },
    },
    actions: {
      saveProviderNotification({ commit }, providerNotification) {
        console.log('>>> providerNotification', providerNotification);
        console.table(providerNotification);
        commit('ADD_PROVIDERNOTIFICATION', providerNotification);
      },
      updateProviderNotification({ commit }, providerNotification) {
        commit('UPDATE_PROVIDERNOTIFICATION', providerNotification);
      },
      deleteProviderNotification({ commit }, providerNotificationId) {
        commit('DELETE_PROVIDERNOTIFICATION', providerNotificationId);
      },
    },
  };
  