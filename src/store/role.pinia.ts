import { Role } from '@/interfaces/sandflow';
import { defineStore } from 'pinia';

export const useRoleStore = defineStore('role', {
    state: () => {
        return {
            roles: [] as Array<Role>,
            permissions: [] as Array<string>,
            selectedId: -1,
        };
    },
    getters: {
        getSelected: (state: any) => {
            return state.roles.find((role: Role) => role.id === state.selectedId) || {};
        },
        getFiltered: (state: any) => {
            if (state.selectedId === -1) {
                return state.roles;
            }

            return state.roles.filter((role: Role) => role.id === state.selectedId) || [];
        },
    },
    actions: {},
});
