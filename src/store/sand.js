import axios from 'axios';
const api = import.meta.env.VITE_API_URL || '/api';

export default {
    state: () => ({
        all: [],
        validations: {},
    }),
    getters: {
        getSandbyId: (state) => (id) => {
            return state.all.find((all) => all.id === id);
        },
        sandValidation: (state) => {
            return state.validations;
        },
    },
    mutations: {
        SET_SAND(state, payload) {
            state.all = payload;
        },
        ADD_SAND(state, payload) {
            state.all.push(payload);
        },
        UPDATE_SAND(state, payload) {
            state.all.map((sand, index) => {
                if (sand.id === payload.id) {
                    state.all[index] = payload;
                }
            });
        },
        UPDATE_SAND_VALIDATION(state, payload) {
            state.validations[payload.fieldName] = payload.validationsPassed;
        },
    },
    actions: {
        sandUpdateValidation: async ({ commit }, payload) => {
            await commit('UPDATE_SAND_VALIDATION', payload);
        },
        sandDataHandler: async ({ dispatch, getters }, methodAndPayload) => {
            let { method, payload } = methodAndPayload;
            method = `sand_${method}`;
            await dispatch('verifyInternetConnection');

            if (!getters.getInternetConnection) {
                return (response.err = 'Sin internet');
            }

            let response = await dispatch(method, payload);

            return response;
        },
        sand_getAll: async ({ commit }) => {
            return await axios
                .get(`${api}/sand`)
                .then((res) => {
                    if (res.status == 200) {
                        commit('SET_SAND', res.data.data);

                        return res.data.data;
                    }
                })
                .catch(() => {
                    return { status: 'failed' };
                });
        },
        saveSand({ commit }, sand) {
            // console.log('>>Adding Sand', sand);
            console.table(sand);
            const baseS = {
                id: 0,
                type: '',
                description: '',
                meshType: '',
                grainType: '',
                observations: '',
            };
            commit('ADD_SAND', { ...baseS, ...sand });

            if (sand.isFull) {
                // Axios POST to api to create sand
            } else {
                // Axios POST to incomplete sand
            }
        },
        updateSand({ commit }, sand) {
            commit('UPDATE_SAND', sand);
        },

        //TODO: el metodo debería updateSand
        async updateVisibilitySand({ commit }, sand) {
            return await axios.put(`${api}/sand/${sand.id}`, sand).catch((error) => {
                throw error.response.data;
            });
        },
    },
};
