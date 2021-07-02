export default {
  state: () => ({
    navigation: [
      { name: 'Ingreso', to: '/login', icon: 'HomeIcon', current: true },
      {
        name: 'About',
        to: '/about',
        icon: 'AtSymbolIcon',
        current: false,
      },
      {
        name: 'Orden de Trabajo',
        to: '/orden-de-trabajo',
        icon: 'ClipboardListIcon',
        current: false,
      },
      {
        name: 'Componentes',
        to: '/componentes',
        icon: 'ChipIcon',
        current: false,
      },
    ],
    user_navigation: [
      { name: 'Perfil', to: '/usuario', icon: 'AdjustmentsIcon' },
      { name: 'Ajustes', to: '/usuaruio/ajustes', icon: 'UsersIcon' },
      { name: 'Salir', to: '/usuario/salir', icon: 'LogoutIcon' },
    ],
  }),
  getters: {},
  mutations: {},
  actions: {},
};
