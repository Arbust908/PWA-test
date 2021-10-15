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
        DELETE_PROVIDERNOTIFICATION(state, pNId) {
            state.all = state.all.filter((pN) => {
                return pN.id !== pNId;
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
