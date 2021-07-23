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
        icon: 'Clipboard'
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
