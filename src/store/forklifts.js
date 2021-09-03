import axios from 'axios'
const api = import.meta.env.VITE_API_URL || '/api';

export default {
  state: () => ({
    all: [],
    error_messages: {
      getAll: "No se pudieron obtener los datos de los montacargas",
      get: "No se pudieron obtener los datos del montacargas",
      create: "No se pudo crear el montacargas",
      update: "No se pudo actualizar el montacargas",
      delete: "No se pudo eliminar el montacargas"
    }
  }),
  getters: {
    forkliftMessage: (state) => (method) => {
      return state.error_messages[method]
    },
    getForklifts: state => {
      return state.all
    }
  },
  mutations: {
    SET_FORKLIFTS(state,payload) {
      state.all = payload
    },
    ADD_FORKLIFT(state, payload) {
      state.all.push(payload);
    },
    UPDATE_FORKLIFT(state, payload) {
      state.all.map((forklift, index) => {
        if (forklift.id === payload.id) {
          state.all[index] = payload;
        }
      });
    },
    DELETE_FORKLIFT(state, payload) {
      state.all.splice(state.all.findIndex(function(i){
        return i.id === payload;
      }), 1);
    },
  },
  actions: {
    forkliftDataHandler: async({dispatch, getters}, methodAndPayload) => {
      const {method,payload} = methodAndPayload
      await dispatch('verifyInternetConnection')
      if(!getters.getInternetConnection) return response.err = "Sin internet"
      let response = await dispatch(method, payload)

      return response
    },
    setForklifts({commit}, forklifts) {
      commit('SET_FORKLIFTS', forklifts)
    },
    getAll: async({commit}) => {
      return await axios.get(`${api}/forklift`)
      .then((res) => {
        if(res.status == 200) {
          commit('SET_FORKLIFTS', res.data.data)
          return res.data.data
        }
      })
      .catch((err) => { 
        return {status: "failed"}
      })
    },
    get: async(payload) => {
      return await axios.get(`${api}/forklift/${payload}`)
      .then((res) => {if(res.status == 200) return response.data = res.data.data
      })
      .catch((err) => {return response = err})
      // Traer de la API o del Store? 
    },
    create: async ({ commit }, payload) => {
      let forklift = {
        name: payload.name || "",
        owned: payload.owned || "",
        ownerName: payload.ownerName || 0,
        ownerContact: payload.ownerContact || "",
        observations: payload.observations || ""
      };

      return await axios
      .post(`${api}/forkliftasda`, forklift)
      .then((res) => {
        if (res.status === 200) {
          forklift.id = res.data.data.id;
          commit('ADD_FORKLIFT', forklift);
          return res.data.data
        }
      })
      .catch((err) => { 
        return {status: "failed"}
      })
    },
    update: async ({ commit }, payload) => {
      return await axios
      .put(`${api}/forklift/${payload.id}`, payload)
      .then((res) => {
        if (res.status === 200) {
          commit('UPDATE_FORKLIFT', payload);
          return res.data.data
        }
      })
      .catch((err) => {
        return {status: "failed"}
      })
    },
    delete: async({ commit }, payload) => {
      return await axios
      .delete(`${api}/forklift/${payload}`)
      .then((res) => {
        if(res.status == 200) {
          commit('DELETE_FORKLIFT', payload);
          return res.status
        }
      })
      .catch((err) => {
        return err
      })
    },
  },
};
