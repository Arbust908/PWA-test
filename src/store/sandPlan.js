import axios from 'axios';
const api = import.meta.env.VITE_API_URL || '/api';

export default {
    state: () => ({
        all: [],
    }),
    getters: {
        getSandPlans: (state) => {
            return state.all;
        },
    },
    mutations: {
        SET_SANDPLANS(state, payload) {
            state.all = payload;
        },
        ADD_SANDPLAN(state, payload) {
            console.log('store', payload);
            state.all.push(payload);
        },
        UPDATE_SANDPLAN(state, payload) {
            state.all.map((sandPlan, index) => {
                if (sandPlan.id === payload.id) {
                    state.all[index] = payload;
                }
            });
        },
        DELETE_SANDPLAN(state, id) {
            state.all = state.all.filter((sandPlan) => {
                return sandPlan.id !== id;
            });
        },
    },
    actions: {
        sandPlanDataHandler: async ({ dispatch, getters }, methodAndPayload) => {
            let { method, payload } = methodAndPayload;
            method = `sandPlan_${method}`;
            await dispatch('verifyInternetConnection');

            if (!getters.getInternetConnection) {
                return (response.err = 'Sin internet');
            }

            let response = await dispatch(method, payload);

            return response;
        },
        sandPlan_getAll: async ({ commit }) => {
            return await axios
                .get(`${api}/sandPlan`)
                .then((res) => {
                    if (res.status == 200) {
                        commit('SET_SANDPLANS', res.data.data);

                        return res.data.data;
                    }
                })
                .catch(() => {
                    return { status: 'failed' };
                });
        },
        sandPlan_update: async ({ commit }, payload) => {
            return await axios
                .put(`${api}/sandPlan/${payload.id}`, payload)
                .then((res) => {
                    if (res.status == 200) {
                        commit('UPDATE_SANDPLAN', payload);

                        return res.data.data;
                    }
                })
                .catch(() => {
                    return { status: 'failed' };
                });
        },
        saveSandPlan({ commit }, sandPlan) {
            commit('ADD_SANDPLAN', sandPlan);
        },
        updateSandPlan({ commit }, sandPlan) {
            commit('UPDATE_SANDPLAN', sandPlan);
        },
        deleteSandPlan({ commit }, sandPlanId) {
            commit('DELETE_SANDPLAN', sandPlanId);
        },
    },
};
