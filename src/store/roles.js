import axios from 'axios';
const api = import.meta.env.VITE_API_URL || '/api';

export default {
    state: () => ({
        all: [],
        validations: {},
    }),
    getters: {
        getRolebyId: (state) => (id) => {
            return state.all.find((all) => all.id === id);
        },
        roleValidation: (state) => {
            return state.validations;
        },
    },
    mutations: {
        SET_ROLE(state, payload) {
            state.all = payload;
        },
        ADD_ROLE(state, payload) {
            state.all.push(payload);
        },
        UPDATE_ROLE(state, payload) {
            state.all.map((role, index) => {
                if (role.id === payload.id) {
                    state.all[index] = payload;
                }
            });
        },
        UPDATE_ROLE_VALIDATION(state, payload) {
            state.validations[payload.fieldName] = payload.validationsPassed;
        },
    },
    actions: {
        roleUpdateValidation: async ({ commit }, payload) => {
            await commit('UPDATE_ROLE_VALIDATION', payload);
        },
        roleDataHandler: async ({ dispatch, getters }, methodAndPayload) => {
            let { method, payload } = methodAndPayload;
            method = `role_${method}`;
            await dispatch('verifyInternetConnection');

            if (!getters.getInternetConnection) {
                return (response.err = 'Sin internet');
            }

            let response = await dispatch(method, payload);

            return response;
        },
        role_get: async ({ commit }, roleId) => {
            return await axios
                .get(`${api}/role/${roleId}`)
                .then((res) => {
                    if (res.status == 200) {
                        commit('SET_ROLE', res.data.data);

                        return res.data.data;
                    }
                })
                .catch(() => {
                    return { status: 'failed' };
                });
        },
        role_getAll: async ({ commit }) => {
            return await axios
                .get(`${api}/role`)
                .then((res) => {
                    if (res.status == 200) {
                        commit('SET_ROLE', res.data.data);

                        return res.data.data;
                    }
                })
                .catch(() => {
                    return { status: 'failed' };
                });
        },
        saveRole({ commit }, role) {
            const baseS = {
                id: 0,
                type: '',
                description: '',
                meshType: '',
                grainType: '',
                observations: '',
            };
            commit('ADD_ROLE', { ...baseS, ...role });
        },
        updateRole({ commit }, role) {
            commit('UPDATE_ROLE', role);
        },
    },
};
