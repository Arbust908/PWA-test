export default {
  state: () => ({
    navigation: [
      { name: 'Panel', to: '/', icon: 'Home' },
      {
        name: 'Planificacion de Arena',
        to: '/planificacion-de-arena',
        icon: 'ClipboardList',
      },
      {
        name: 'Diseño de Deposito',
        to: '/diseno-de-deposito',
        icon: 'ViewGridAdd',
      },
      {
        name: 'Orden de Trabajo',
        to: '/orden-de-trabajo',
        icon: 'Briefcase',
      },
      {
        name: 'Orden de Pedido',
        to: '/orden-de-pedido',
        icon: 'Tag',
      },
      // {
      //   name: 'StageSheet',
      //   to: '/stage-sheet',
      //   icon: 'DocumentReport',
      // },
      {
        name: 'Notificaciones',
        to: '/notificaciones-a-proveedores',
        icon: 'Bell',
      },
      {
        name: 'Ingreso de cajas',
        to: '/ingreso-de-cajas',
        icon: 'Archive',
      },
      {
        name: 'Proveedores',
        icon: 'ChevronRight',
        subNav: [
          {
            name: 'Arena',
            to: '/proveedores-de-arena',
            icon: 'UserGroup',
          },
          {
            name: 'Transporte',
            to: '/proveedores-de-transporte',
            icon: 'Truck',
          },
        ],
      },
      {
        name: 'Configuracion',
        icon: 'Cog',
        subNav: [
          {
            name: 'Clientes',
            to: '/clientes',
            icon: 'UserCircle',
          },
          {
            name: 'Tipos de Arena',
            to: '/tipos-de-arena',
            icon: 'ClipboardList',
          },
          {
            name: 'Forklift',
            to: '/forklift',
            icon: 'ClipboardList',
          },
          {
            name: 'Cradle',
            to: '/cradle',
            icon: 'ClipboardList',
          },
        ],
      },
    ],
    user_navigation: [{ name: 'Salir', to: '/usuario/salir', icon: 'Logout' }],
    areWeConnected: false,
  }),
  getters: {
    getInternetConnection: (state) => {
      return state.areWeConnected;
    },
  },
  mutations: {
    SET_INTERNET_CONNECTION(state) {
      state.areWeConnected = navigator.onLine;
    },
  },
  actions: {
    verifyInternetConnection({ commit }) {
      commit('SET_INTERNET_CONNECTION');
    },
  },
};
