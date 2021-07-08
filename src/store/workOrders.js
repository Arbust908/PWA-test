export default {
  state: () => ({
    all: [
      {
        id: '000000',
        client: 'client',
        service_co: 'pipele',
        pad: 'pad 01',
        pits: ['Pozo 1', 'Pozo2'],
        cradle: {
          main: 'efjne',
          buckup: 'sakdjb',
        },
      },
    ],
  }),
  getters: {},
  mutations: {
    ADD_WORKORDER(state, payload) {
      state.workOrders.push(payload);
    },
  },
  actions: {
    addNewWorkOrder({ commit }, workOrder) {
      commit('ADD_WORKORDER', workOrder);
    },
  },
};
