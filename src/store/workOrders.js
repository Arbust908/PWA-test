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
      state.all.map((workOrder, index) => {
        if (workOrder.id === payload.id) {
          state.all[index] = payload;
        }
      });
    },
  },
  actions: {
    saveWorkOrder({ commit }, workOrder) {
      console.log('>>Adding Work Order', workOrder);
      console.table(workOrder);
      const baseWO = {
        id: 0,
        client: '',
        service_co: '',
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
  },
};
