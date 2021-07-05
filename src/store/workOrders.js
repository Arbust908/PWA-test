export default {
  state: () => ({
    workOrders: [
      {
        name: 'About',
        to: '/about',
        icon: 'AtSymbolIcon',
        current: false,
      },
    ],
  }),
  getters: {},
  mutations: {
    addNewWorkOrder({ commit }, workOrder) {},
  },
  actions: {},
};
