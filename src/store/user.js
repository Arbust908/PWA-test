import axios from 'axios';
const api = import.meta.env.VITE_API_URL || '/api';

export default {
    state: () => ({
        all: [],
        validations: {},
        user_permissions: [],
    }),
    getters: {
        userValidation: (state) => {
            return state.validations;
        },
        userPermissions: (state) => {
            return state.user_permissions;
        },
    },
    mutations: {
        SET_USERS(state, payload) {
            state.all = payload;
        },
        ADD_USER(state, payload) {
            state.all.push(payload);
        },
        UPDATE_USER_VALIDATION(state, payload) {
            state.validations[payload.fieldName] = payload.validationsPassed;
        },
        SET_USER_PERMISSIONS(state, payload) {
            state.user_permissions = payload;
        },
    },
    actions: {
        setUser({ commit }, usr) {
            commit('SET_USER', usr);
        },
        logOutUser({ commit }) {
            commit('SET_USER', { username: '', role: 0 });
        },
        userUpdateValidation: async ({ commit }, payload) => {
            await commit('UPDATE_USER_VALIDATION', payload);
        },
        updateUserPerrmisions: async ({ commit }, payload) => {
            await commit('UPDATE_USER_PERMISSIONS', payload);
        },
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
        user_get: async ({ commit }, payload) => {
            return await axios
                .get(`${api}/user/${payload}`)
                .then((res) => {
                    if (res.status == 200) {
                        return res.data.data;
                    }
                })
                .catch((err) => {
                    return err;
                });
        },
        user_create: async ({ commit }, payload) => {
            let user = {
                firstName: payload.value.name,
                middleName: '',
                lastName: '',
                email: payload.value.email,
                ...payload.value,
            };

            return await axios
                .post(`${api}/user`, user)
                .then((res) => {
                    if (res.status === 200) {
                        commit('ADD_FORKLIFT', user);

                        return res;
                    }
                })
                .catch(() => {
                    return { status: 'failed' };
                });
        },
        user_update: async (_, payload) => {
            let user = {
                ...payload.value,
                id: payload.value.id,
                firstName: payload.value.firstName,
                roleId: payload.value.roleId,
                middleName: '',
                lastName: '',
                email: payload.value.email,
                visible: payload.value.visible,
            };

            return await axios
                .put(`${api}/user/${user.id}`, user)
                .then((res) => {
                    if (res.status === 200) {
                        // commit('UPDATE_USER', user);

                        return res.data.data;
                    }
                })
                .catch(() => {
                    return { status: 'failed' };
                });
        },
        setUserPermissions: async ({ commit }, payload) => {
            commit('SET_USER_PERMISSIONS', payload);
        },
    },
};
