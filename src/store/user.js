import axios from 'axios';
const api = import.meta.env.VITE_API_URL || '/api';

export default {
    state: () => ({
        all: [],
    }),
    getters: {},
    mutations: {
        SET_USERS(state, payload) {
            state.all = payload;
        },
    },
    actions: {
        userDataHandler: async ({ dispatch, getters }, methodAndPayload) => {
            let { method, payload } = methodAndPayload;
            method = `user_${method}`;
            await dispatch('verifyInternetConnection');

            if (!getters.getInternetConnection) {
                return (response.err = 'Sin internet');
            }
            let response = await dispatch(method, payload);

            return response;
        },
        user_getAll: async ({ commit }) => {
            return await axios
                .get(`${api}/user`)
                .then((res) => {
                    if (res.status == 200) {
                        commit('SET_USERS', res.data.data);

                        return res.data.data;
                    }
                })
                .catch(() => {
                    return { status: 'failed' };
                });
        },
    },
};
