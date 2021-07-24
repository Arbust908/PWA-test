export default {
  state: () => ({
    all: [],
  }),
  getters: {},
  mutations: {
    ADD_WORKORDER(state, payload) {
      state.all.push(payload);
    },
    UPDATE_WORKORDER(state, payload) {
      // Que no sea map
      state.all.map((workOrder, index) => {
        if (workOrder.id === payload.id) {
          state.all[index] = payload;
        }
      });
    },
    DELETE_WORKORDER(state, payload) {
      state.all = state.all.filter((workOrder) => workOrder.id !== payload);
    },
  },
  actions: {
    saveWorkOrder({ commit }, workOrder) {
      console.log('saveWorkOrder', workOrder);
      const baseWO = {
        id: 0,
        client: '',
        serviceCompany: '',
        pad: '',
        pits: [],
        operativeCradle: '',
        backupCradle: '',
        operativeForklift: '',
        backupForklift: '',
        traktors: [],
        pickups: [],
        crews: [],
        rigmats: 0,
        conex: 0,
        generators: 0,
        tower: 0,
        cabin: 0,
      };
      commit('ADD_WORKORDER', { ...baseWO, ...workOrder });
      if (workOrder.isFull) {
        // Axios POST to api to create work order
      } else {
        // Axios POST to incomplete work order
      }
    },
    updateWorkOrder({ commit }, workOrder) {
      commit('UPDATE_WORKORDER', workOrder);
    },
    deleteWorkOrder({ commit }, workOrderId) {
      commit('DELETE_WORKORDER', workOrderId);
    },
  },
};
