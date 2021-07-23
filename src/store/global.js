export default {
  state: () => ({
    navigation: [
      { name: 'Panel', to: '/', icon: 'HomeIcon' },
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
      {
        name: 'Proveedores de arena',
        to: '/proveedores-de-arena',
        icon: 'ClipboardListIcon',
      },
      {
        name: 'Proveedores de transporte',
        to: '/proveedores-de-transporte',
        icon: 'ClipboardListIcon',
      },
      {
        name: 'Centro de Carga',
        to: '/centro-de-carga-de-arena',
        icon: 'ClipboardListIcon',
      },
      // {
      //   name: 'Componentes',
      //   to: '/componentes',
      //   icon: 'ChipIcon',
      // },
      // {
      //   name: 'Tipos de Arena',
      //   to: '/tipos-de-arena',
      //   icon: 'ClipboardListIcon',
      // }
      {
        name: 'Orden de Pedido',
        to: '/orden-de-pedido',
        icon: 'ArchiveIcon',
      },
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
