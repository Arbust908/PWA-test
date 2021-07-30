export default {
  state: () => ({
    all: [
      {
        id: 0,
        sandProvider: {
          id: 0,
          name: 'Arenero San Luis',
          sandOrders: [
            {
              id: 0,
              type: 'Fina',
              quantity: 44,
              boxId: 0,
            },
          ],
        },
        transportProvider: {
          id: 0,
          name: 'Transportes Rapidos',
          transportId: 'AC 276 TT',
          boxQuantity: 2,
          observation: 'Van las dos llenitas',
        },
        draft: false,
      },
      {
        id: 1,
        sandProvider: {
          id: 0,
          name: 'Arenero San Luis',
          sandOrders: [
            {
              id: 1,
              type: 'Gruesa',
              quantity: 88,
              boxId: 1,
            },
            {
              id: 0,
              type: 'Extra fina',
              quantity: 22,
              boxId: 2,
            },
          ],
        },
        transportProvider: {
          id: 0,
          name: 'Transportes Buenos',
          transportId: 'AT 222 YT',
          boxQuantity: 5,
          observation: 'Son muchas cajas',
        },
        draft: false,
      },
      {
        id: 2,
        sandProvider: {
          id: 0,
          name: 'Arenero San Luis',
          sandOrders: [
            {
              id: 0,
              type: '',
              quantity: 0,
              boxId: 0,
            },
          ],
        },
        transportProvider: {
          id: 0,
          name: '',
          transportId: '',
          boxQuantity: 0,
          observation: '',
        },
        draft: true,
      },
    ],
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
      const lastId = state.all.length > 0 ? state.all[state.all.length - 1].id : 0;
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
