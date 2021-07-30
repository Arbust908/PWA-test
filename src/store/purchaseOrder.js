export default {
  state: () => ({
    all: [],
  }),
  getters: {
    getPurchaseOrder: (state) => (id) => {
      console.log('Getting Purchase Order number ' + id);
      console.log(state.all);
      return state.all.find((purchaseOrder) => {
        return Number(purchaseOrder.id) === Number(id);
      });
    },
  },
  mutations: {
    ADD_PURCHASEORDER(state, payload) {
      const lastId =
        state.all.length > 0 ? state.all[state.all.length - 1].id : -1;
      payload.id = lastId + 1;
      state.all.push(payload);
    },
    UPDATE_PURCHASEORDER(state, payload) {
      state.all.map((purchaseOrder, index) => {
        if (purchaseOrder.id === payload.id) {
          state.all[index] = payload;
        }
      });
    },
  },
  actions: {
    savePurchaseOrder({ commit }, purchaseOrder) {
      console.log('>>Adding Purchase Order', purchaseOrder);
      commit('ADD_PURCHASEORDER', purchaseOrder);
    },
    updatePurchaseOrder({ commit }, purchaseOrder) {
      commit('UPDATE_PURCHASEORDER', purchaseOrder);
    },
  },
};
