export default {
  state: () => ({
    navigation: [
      // { name: 'Ingreso', to: '/login', icon: 'HomeIcon' },
      // {
      //   name: 'About',
      //   to: '/about',
      //   icon: 'AtSymbolIcon',
      // },
      {
        name: 'Orden de Trabajo',
        to: '/orden-de-trabajo',
        icon: 'ClipboardListIcon',
      },
      // {
      //   name: 'Componentes',
      //   to: '/componentes',
      //   icon: 'ChipIcon',
      // },
    ],
    user_navigation: [
      // { name: 'Perfil', to: '/usuario', icon: 'AdjustmentsIcon' },
      // { name: 'Ajustes', to: '/usuaruio/ajustes', icon: 'UsersIcon' },
      { name: 'Salir', to: '/usuario/salir', icon: 'LogoutIcon' },
    ],
  }),
  getters: {},
  mutations: {},
  actions: {},
};
