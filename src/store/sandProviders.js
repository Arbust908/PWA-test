import axios from 'axios'
const api = import.meta.env.VITE_API_URL || '/api';

export default {
  state: () => ({
    all: [],
    error_messages: {
      getAll: "No se pudieron obtener los datos de los proveedores de arena.",
      get: "No se pudieron obtener los datos del proveedor de arena.",
      create: "No se pudo crear el proveedor de arena.",
      update: "No se pudo actualizar el proveedor de arena.",
      delete: "No se pudo eliminar el proveedor de arena."
    }
  }),
  getters: {
    sandProviderMessage: (state) => (method) => {
      return state.error_messages[method]
    },
    getSandProviders: state => {
      return state.all
    }
  },
  mutations: {
    SET_SANDPROVIDERS(state,payload) {
      state.all = payload
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
      state.all.splice(state.all.findIndex(function(i){
        return i.id === payload;
      }), 1);
    },
  },
  actions: {
    sandProviderDataHandler: async({dispatch, getters}, methodAndPayload) => {
      const {method,payload} = methodAndPayload
      await dispatch('verifyInternetConnection')
      if(!getters.getInternetConnection) return response.err = "Sin internet"
      let response = await dispatch(method, payload)

      return response
    },
    setSandProviders({commit}, sandProviders) {
      commit('SET_SANDPROVIDERS', sandProviders)
    },
    getAll: async({commit}) => {
      return await axios.get(`${api}/sandProvider`)
      .then((res) => {
        if(res.status == 200) {
          commit('SET_SANDPROVIDERS', res.data.data)
          return res.data.data
        }
      })
      .catch((err) => { 
        return {status: "failed"}
      })
    },
    get: async(payload) => {
      return await axios.get(`${api}/sandProvider/${payload}`)
      .then((res) => {if(res.status == 200) return res.data.data
      })
      .catch((err) => {return err})
    },
    create: async ({ commit }, payload) => {
      let sandProvider = {
        name: payload.name || "",
        address: payload.address || "",
        legalId: payload.legalId || 0,
        meshType: payload.meshType || [],
        observations: payload.observations || "",
        companyRepresentativeId: payload.companyRepresentativeId || null,
        companyRepresentative: {
          email: payload.companyRepresentative.email || "",
          name: payload.companyRepresentative.name || "",
          phone: payload.companyRepresentative.phone || "",
        }
      };

      return await axios
      .post(`${api}/companyRepresentative`, payload.companyRepresentative)
      .then(async(res) => {
        if (res.status === 200) {
          sandProvider.companyRepresentativeId = res.data.data.id
          return await axios
          .post(`${api}/sandProvider`, sandProvider)
          .then((res) => {
            if (res.data.data.id) {
              sandProvider.id = res.data.data.id
              commit('UPDATE_SANDPROVIDER', sandProvider);
              return res.data.data
            }
          })
          .catch((err) => {
            return {status: "failed"}
          })
        }
      })
      .catch((err) => {
        return {status: "failed"}
      })
    },
    update: async ({ commit }, payload) => {
      return await axios
      .put(`${api}/companyRepresentative/${payload.companyRepresentativeId}`, payload.companyRepresentative)
      .then(async(res) => {
        if (res.status === 200) {
          return await axios
          .put(`${api}/sandProvider/${payload.id}`, payload)
          .then((res) => {
            if (res.status === 200) {
              commit('UPDATE_SANDPROVIDER', payload);
              return res.data.data
            }
          })
          .catch((err) => {
            return {status: "failed"}
          })
        }
      })
      .catch((err) => {
        return {status: "failed"}
      })
    },
    delete: async({ commit }, payload) => {
      return await axios
      .delete(`${api}/sandProvider/${payload}`)
      .then((res) => {
        if(res.status == 200) {
          commit('DELETE_SANDPROVIDER', payload);
          return res.status
        }
      })
      .catch((err) => {
        return err
      })
    },
  },
};
