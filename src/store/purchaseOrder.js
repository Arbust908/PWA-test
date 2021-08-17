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
      state.all.push(payload);
    },
    UPDATE_PURCHASEORDER(state, payload) {
      state.all.map((purchaseOrder, index) => {
        if (purchaseOrder.id === payload.id) {
          state.all[index] = payload;
        }
      });
    },
    DELETE_PURCHASEORDER(state, payloadId) {
      state.all = state.all.filter((purchaseOrder) => {
        return purchaseOrder.id !== Number(payloadId);
      });
    },
  },
  actions: {
    savePurchaseOrder({ commit }, purchaseOrder) {
      commit('ADD_PURCHASEORDER', purchaseOrder);
    },
    updatePurchaseOrder({ commit }, purchaseOrder) {
      commit('UPDATE_PURCHASEORDER', purchaseOrder);
    },
    deletePurchaseOrder({ commit }, purchaseOrderId) {
      commit('DELETE_PURCHASEORDER', purchaseOrderId);
    },
  },
};
