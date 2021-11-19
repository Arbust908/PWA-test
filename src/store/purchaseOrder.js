import axios from 'axios';
const api = import.meta.env.VITE_API_URL || '/api';

export default {
    state: () => ({
        all: [],
    }),
    getters: {
        getPurchaseOrder: (state) => (id) => {
            console.log('Getting Purchase Order number ' + id);
            console.log(state.all);

            return state.all.find((purchaseOrder) => {
                return Number(purchaseOrder.id) === Number(id);
            });
        },
    },
    mutations: {
        SET_PURCHASEORDER(state, payload) {
            state.all = payload;
        },
        ADD_PURCHASEORDER(state, payload) {
            state.all.push(payload);
        },
        UPDATE_PURCHASEORDER(state, payload) {
            state.all.map((purchaseOrder, index) => {
                if (purchaseOrder.id === payload.id) {
                    state.all[index] = payload;
                }
            });
        },
        DELETE_PURCHASEORDER(state, payloadId) {
            state.all = state.all.filter((purchaseOrder) => {
                return purchaseOrder.id !== Number(payloadId);
            });
        },
    },
    actions: {
        purchaseOrderDataHandler: async ({ dispatch, getters }, methodAndPayload) => {
            let { method, payload } = methodAndPayload;
            method = `purchaseOrder_${method}`;
            await dispatch('verifyInternetConnection');

            if (!getters.getInternetConnection) {
                return (response.err = 'Sin internet');
            }

            let response = await dispatch(method, payload);

            return response;
        },
        purchaseOrder_getAll: async ({ commit }) => {
            return await axios
                .get(`${api}/purchaseOrder`)
                .then((res) => {
                    if (res.status == 200) {
                        commit('SET_PURCHASEORDER', res.data.data);

                        return res.data.data;
                    }
                })
                .catch(() => {
                    return { status: 'failed' };
                });
        },
        savePurchaseOrder({ commit }, purchaseOrder) {
            commit('ADD_PURCHASEORDER', purchaseOrder);
        },
        updatePurchaseOrder({ commit }, purchaseOrder) {
            commit('UPDATE_PURCHASEORDER', purchaseOrder);
        },
        deletePurchaseOrder({ commit }, purchaseOrderId) {
            commit('DELETE_PURCHASEORDER', purchaseOrderId);
        },
    },
};
