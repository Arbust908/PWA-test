export default {
  state: () => ({
    navigation: [
      { name: 'Panel', to: '/', icon: 'HomeIcon' },
      {
        name: 'Planificacion de Arena',
        to: '/planificacion-de-arena',
        icon: 'ClipboardListIcon',
      },
      {
        name: 'Orden de Trabajo',
        to: '/orden-de-trabajo',
        icon: 'ClipboardListIcon',
      },
      {
        name: 'Orden de Pedido',
        to: '/orden-de-pedido',
        icon: 'ArchiveIcon',
      },
      {
        name: 'Notificaciones a Proveedores',
        to: '/notificaciones-a-proveedores',
        icon: 'AnnotationIcon',
      },
      {
        name: 'Proveedores de transporte',
        to: '/proveedores-de-transporte',
        icon: 'ClipboardListIcon',
      },
      {
        name: 'Proveedores de arena',
        to: '/proveedores-de-arena',
        icon: 'Clipboard',
      },
      {
        name: 'Centro de Carga',
        to: '/centro-de-carga-de-arena',
        icon: 'ClipboardListIcon',
      },
      {
        name: 'Tipos de Arena',
        to: '/tipos-de-arena',
        icon: 'ClipboardListIcon',
      },
      {
        name: 'Montacargas',
        to: '/montacargas',
        icon: 'ClipboardListIcon',
      },
      {
        name: 'Cradle',
        to: '/cradle',
        icon: 'ClipboardListIcon',
      },
      {
        name: 'Clientes',
        to: '/clientes',
        icon: 'ClipboardListIcon',
      },
    ],
    user_navigation: [
      { name: 'Salir', to: '/usuario/salir', icon: 'LogoutIcon' },
    ],
    areWeConnected: false
  }),
  getters: {
    getInternetConnection: state => {
      return state.areWeConnected
    }
  },
  mutations: {
    SET_INTERNET_CONNECTION(state) {
      state.areWeConnected = navigator.onLine
    }
  },
  actions: {
    verifyInternetConnection({commit}) {
      commit('SET_INTERNET_CONNECTION')
    }
  },
};
