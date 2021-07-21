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
              }
            ],
          },
          transportProvider: {
            id: 0,
            name: 'Transportes Rapidos',
            transportId: 'AC 276 TT',
            boxQuantity: 2,
            observation: 'Van las dos llenitas',
          },
          draft: false
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
              }
            ],
          },
          transportProvider: {
            id: 0,
            name: 'Transportes Buenos',
            transportId: 'AT 222 YT',
            boxQuantity: 5,
            observation: 'Son muchas cajas',
          },
          draft: false
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
              }
            ],
          },
          transportProvider: {
            id: 0,
            name: '',
            transportId: '',
            boxQuantity: 0,
            observation: '',
          },
          draft: true
        },
      ],
    }),
    getters: {},
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
    },
    actions: {
      savePurchaseOrder({ commit }, purchaseOrder) {
        console.log('>>Adding Purchase Order', purchaseOrder);
        console.table(purchaseOrder);
        const basePO = {
          id: 0,
          sandProvider: {
            id: 0,
            name: '',
            sandOrders: [
              {
                id: 0,
                type: '',
                quantity: 0,
                boxId: 0,
              }
            ],
          },
          transportProvider: {
            id: 0,
            name: '',
            transportId: 0,
            boxQuantity: 0,
            observation: '',
          },
        };
        commit('ADD_PURCHASEORDER', { ...basePO, ...purchaseOrder });
        if (purchaseOrder.isFull) {
          // Axios POST to api to create work order
        } else {
          // Axios POST to incomplete work order
        }
      },
      updatePurchaseOrder({ commit }, purchaseOrder) {
        commit('UPDATE_PURCHASEORDER', purchaseOrder);
      },
    },
  };
  