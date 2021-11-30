const OrdenDeTrabajo = {
    name: 'Orden de Trabajo',
    to: '/orden-de-trabajo',
    icon: 'Briefcase',
};
const Planificación = {
    name: 'Planificación',
    to: '/planificacion-de-arena',
    icon: 'ClipboardList',
};
const Notificaciones = {
    name: 'Notificaciones',
    to: '/notificaciones-a-proveedores',
    icon: 'Bell',
};
const Diseño_de_Depósito = {
    name: 'Diseño de Depósito',
    to: '/diseno-de-deposito',
    icon: 'ViewGridAdd',
};
const Orden_de_Pedido = {
    name: 'Orden de Pedido',
    to: '/orden-de-pedido',
    icon: 'Tag',
};
const Ingreso_de_cajas = {
    name: 'Ingreso de cajas',
    to: '/ingreso-de-cajas',
    icon: 'Archive',
};
const Operación_en_Cradle = {
    name: 'Operación en Cradle',
    to: '/operacion-en-cradle',
    icon: 'Tag',
};
const Stage_Sheet = {
    name: 'Stage Sheet',
    to: '/stage-sheet',
    icon: 'DocumentReport',
};
const LINE = {
    name: 'LINE',
};
export default {
    state: () => ({
        navigation: [
            Planificación,
            OrdenDeTrabajo,
            Notificaciones,
            Diseño_de_Depósito,
            Orden_de_Pedido,
            Ingreso_de_cajas,
            Operación_en_Cradle,
            // Stage_Sheet
            LINE,
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
