import axios from 'axios';
const api = import.meta.env.VITE_API_URL || '/api';

export default {
    state: () => ({
        all: [],
        error_messages: {
            getAll: 'No se pudieron obtener los datos de los centros de carga de arena.',
            get: 'No se pudieron obtener los datos del centro de carga de arena.',
            create: 'No se pudo crear el centro de carga de arena.',
            update: 'No se pudo actualizar el centro de carga de arena.',
            delete: 'No se pudo eliminar el centro de carga de arena.',
        },
        validations: {},
    }),
    getters: {
        sandProviderMessage: (state) => (method) => {
            return state.error_messages[method];
        },
        getSandProviders: (state) => {
            return state.all;
        },
        sandProviderValidation: (state) => {
            return state.validations;
        },
    },
    mutations: {
        SET_SANDPROVIDERS(state, payload) {
            state.all = payload;
        },
        ADD_SANDPROVIDER(state, payload) {
            state.all.push(payload);
        },
        UPDATE_SANDPROVIDER(state, payload) {
            state.all.map((sandProvider, index) => {
                if (sandProvider.id === payload.id) {
                    state.all[index] = payload;
                }
            });
        },
        DELETE_SANDPROVIDER(state, payload) {
            state.all.splice(
                state.all.findIndex(function (i) {
                    return i.id === payload;
                }),
                1
            );
        },
        UPDATE_SANDPROVIDER_VALIDATION(state, payload) {
            state.validations[payload.fieldName] = payload.validationsPassed;
        },
    },
    actions: {
        sandProviderUpdateValidation: async ({ commit }, payload) => {
            await commit('UPDATE_SANDPROVIDER_VALIDATION', payload);
        },
        sandProviderDataHandler: async ({ dispatch, getters }, methodAndPayload) => {
            let { method, payload } = methodAndPayload;
            method = `sandProvider_${method}`;
            await dispatch('verifyInternetConnection');

            if (!getters.getInternetConnection) {
                return (response.err = 'Sin internet');
            }

            let response = await dispatch(method, payload);

            if (!getters.getInternetConnection) {
                return (response.err = 'Sin internet');
            }

            let resp = await dispatch(method, payload);

            return resp;
        },
        setSandProviders({ commit }, sandProviders) {
            commit('SET_SANDPROVIDERS', sandProviders);
        },
        sandProvider_getAll: async ({ commit }) => {
            return await axios
                .get(`${api}/sandProvider`)
                .then((res) => {
                    if (res.status == 200) {
                        commit('SET_SANDPROVIDERS', res.data.data);

                        return res;
                    }
                })
                .catch(() => {
                    return { status: 'failed' };
                });
        },
        sandProvider_get: async (payload) => {
            return await axios
                .get(`${api}/sandProvider/${payload}`)
                .then((res) => {
                    if (res.status == 200) {
                        return res;
                    }
                })
                .catch((err) => {
                    return err;
                });
        },
        sandProvider_create: async ({ commit }, payload) => {
            let sandProvider = {
                name: payload.name || '',
                address: payload.address || '',
                legalId: payload.legalId || 0,
                meshType: payload.meshType || [],
                observations: payload.observations || '',
                companyRepresentativeId: payload.companyRepresentativeId || null,
                companyRepresentative: {
                    email: payload.companyRepresentative.email || '',
                    name: payload.companyRepresentative.name || '',
                    phone: payload.companyRepresentative.phone || '',
                },
            };

            return await axios
                .post(`${api}/companyRepresentative`, payload.companyRepresentative)
                .then(async (res) => {
                    if (res.status === 200) {
                        sandProvider.companyRepresentativeId = res.data.data.id;

                        return await axios
                            .post(`${api}/sandProvider`, sandProvider)
                            .then((response) => {
                                if (response.data.data.id) {
                                    sandProvider.id = response.data.data.id;
                                    commit('UPDATE_SANDPROVIDER', sandProvider);

                                    return response;
                                }
                            })
                            .catch(() => {
                                return { status: 'failed' };
                            });
                    }
                })
                .catch(() => {
                    return { status: 'failed' };
                });
        },
        sandProvider_update: async ({ commit }, payload) => {
            return await axios
                .put(`${api}/companyRepresentative/${payload.companyRepresentativeId}`, payload.companyRepresentative)
                .then(async (res) => {
                    if (res.status === 200) {
                        return await axios
                            .put(`${api}/sandProvider/${payload.id}`, payload)
                            .then((response) => {
                                if (response.status === 200) {
                                    commit('UPDATE_SANDPROVIDER', payload);

                                    return response;
                                }
                            })
                            .catch(() => {
                                return { status: 'failed' };
                            });
                    }
                })
                .catch(() => {
                    return { status: 'failed' };
                });
        },
        sandProvider_delete: async ({ commit }, payload) => {
            return await axios
                .delete(`${api}/sandProvider/${payload}`)
                .then((res) => {
                    if (res.status == 200) {
                        commit('DELETE_SANDPROVIDER', payload);

                        return res;
                    }
                })
                .catch((err) => {
                    return err;
                });
        },
    },
};
