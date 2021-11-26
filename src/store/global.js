export default {
    state: () => ({
        navigation: [
            {
                name: 'Orden de Trabajo',
                to: '/orden-de-trabajo',
                icon: 'Briefcase',
            },
            {
                name: 'Planificación',
                to: '/planificacion-de-arena',
                icon: 'ClipboardList',
            },
            {
                name: 'Notificaciones',
                to: '/notificaciones-a-proveedores',
                icon: 'Bell',
            },
            {
                name: 'Diseño de Depósito',
                to: '/diseno-de-deposito',
                icon: 'ViewGridAdd',
            },
            {
                name: 'Orden de Pedido',
                to: '/orden-de-pedido',
                icon: 'Tag',
            },
            {
                name: 'Ingreso de cajas',
                to: '/ingreso-de-cajas',
                icon: 'Archive',
            },
            {
                name: 'Operación en Cradle',
                to: '/operacion-en-cradle',
                icon: 'Tag',
            },
            // {
            //     name: 'Stage Sheet',
            //     to: '/stage-sheet',
            //     icon: 'DocumentReport',
            // },
            {
                name: 'LINE',
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
                name: 'Clientes',
                to: '/clientes',
                icon: 'UserCircle',
            },
            {
                name: 'Configuración',
                icon: 'Cog',
                subNav: [
                    {
                        name: 'Tipo de malla',
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
