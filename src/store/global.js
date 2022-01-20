import { useRouter } from 'vue-router';
const OrdenDeTrabajo = {
    name: 'Orden de trabajo',
    to: '/orden-de-trabajo',
    icon: 'Briefcase',
    title: 'WorkOrders',
};
const Planificación = {
    name: 'Planificación',
    to: '/planificacion-de-arena',
    icon: 'ClipboardList',
    title: 'SandPlans',
};
const Notificaciones = {
    name: 'Notificaciones',
    to: '/notificaciones-a-proveedores',
    icon: 'Bell',
    title: 'ProviderNotifications',
};
const Diseño_de_Depósito = {
    name: 'Diseño de depósito',
    to: '/diseno-de-deposito',
    icon: 'ViewGridAdd',
    title: 'DepositDesigns',
};
const Orden_de_Pedido = {
    name: 'Orden de pedido',
    to: '/orden-de-pedido',
    icon: 'Tag',
    title: 'PurchaseOrders',
};
const Ingreso_de_cajas = {
    name: 'Ingreso de cajas',
    to: '/ingreso-de-cajas',
    icon: 'Archive',
    title: 'BoxEntry',
};
const Operación_en_Cradle = {
    name: 'Operación en cradle',
    to: '/operacion-en-cradle',
    icon: 'Tag',
    title: 'CradleOperation',
};
const Stage_Sheet = {
    name: 'Stage sheet',
    to: '/stage-sheet',
    icon: 'DocumentReport',
    title: 'StageSheet',
};
const Forklift_Operation = {
    name: 'Operacion en forklift',
    to: '/operacion-en-forklift',
    icon: 'SwitchHorizontal',
    title: 'ForkliftOperation',
    keep: true,
};
const Close_Of_Operations = {
    name: 'Cierre de operaciones',
    to: '/cierre-de-operaciones',
    icon: 'Briefcase',
    title: 'CloseOfOperations',
    keep: true,
};
const Deposito_de_cajas_vacias = {
    name: 'Depósito de cajas vacias',
    to: '/deposito-cajas-vacias',
    icon: 'Archive',
    title: 'EmptyBoxDeposit',
    keep: true,
};
const Destino_de_cajas_vacias = {
    name: 'Destino de cajas vacias',
    to: '/Destino-cajas-vacias',
    icon: 'Archive',
    title: 'EmptyBox',
    keep: true,
};
const LINE = {
    name: 'LINE',
};
const Arena = {
    name: 'Arena',
    to: '/proveedores-de-arena',
    icon: 'UserGroup',
    title: 'SandProvider',
};
const Transporte = {
    name: 'Transporte',
    to: '/proveedores-de-transporte',
    icon: 'Truck',
    title: 'TransportProvider',
};
const Clientes = {
    name: 'Clientes',
    to: '/clientes',
    icon: 'UserCircle',
    title: 'Clients',
};
const Tipo_de_malla = {
    name: 'Tipo de malla',
    to: '/tipos-de-arena',
    icon: 'ClipboardList',
    title: 'Sand',
};
const Forklift = {
    name: 'Forklift',
    to: '/forklift',
    icon: 'ClipboardList',
    title: 'Forklift',
};
const Cradle = {
    name: 'Cradle',
    to: '/cradle',
    icon: 'ClipboardList',
    title: 'Cradle',
};
const Usuarios = {
    name: 'Usuarios',
    to: '/usuarios',
    icon: 'UserGroup',
    title: 'UserAdmin',
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
            Deposito_de_cajas_vacias,
            Destino_de_cajas_vacias,
            Forklift_Operation,
            Close_Of_Operations,
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
        isCustom: false,
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
        SET_CUSTOM(state, payload = true) {
            state.isCustom = payload;
        },
        SET_NEW_NAVIGATION(state, payload) {
            state.navigation = payload;
        },
    },
    actions: {
        verifyInternetConnection({ commit }) {
            commit('SET_INTERNET_CONNECTION');
        },
    },
};
