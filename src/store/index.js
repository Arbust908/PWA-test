import { createStore } from 'vuex';

import user from '@/store/user';
import global from '@/store/global';
import workOrders from '@/store/workOrders';

const store = createStore({
  state: {
    pepe: 'Pelepe',
  },
  getter: {},
  mutations: {},
  actions: {
    testAction(context, payload) {
      console.log('Entre al Action');
      console.log('El payload', payload);
      console.log('Contexto', context);
    },
  },
  modules: {
    user,
    global,
    workOrders,
  },
  strict: true,
});

export default store;
