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
const Arena = {
    name: 'Arena',
    to: '/proveedores-de-arena',
    icon: 'UserGroup',
};
const Transporte = {
    name: 'Transporte',
    to: '/proveedores-de-transporte',
    icon: 'Truck',
};
const Clientes = {
    name: 'Clientes',
    to: '/clientes',
    icon: 'UserCircle',
};
const Tipo_de_malla = {
    name: 'Tipo de malla',
    to: '/tipos-de-arena',
    icon: 'ClipboardList',
};
const Forklift = {
    name: 'Forklift',
    to: '/forklift',
    icon: 'ClipboardList',
};
const Cradle = {
    name: 'Cradle',
    to: '/cradle',
    icon: 'ClipboardList',
};
const Usuarios = {
    name: 'Usuarios',
    to: '/usuarios',
    icon: 'UserGroup',
};
export default {
    state: () => ({
        navigation: [
            OrdenDeTrabajo,
            Planificación,
            Notificaciones,
            Diseño_de_Depósito,
            Orden_de_Pedido,
            Ingreso_de_cajas,
            Operación_en_Cradle,
            Stage_Sheet,
            LINE,
            {
                name: 'Proveedores',
                icon: 'ChevronRight',
                subNav: [Arena, Transporte],
            },
            Clientes,
            {
                name: 'Configuración',
                icon: 'Cog',
                subNav: [Tipo_de_malla, Forklift, Cradle],
            },
            Usuarios,
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
