import { defineStore } from 'pinia';

export const useGlobalStore = defineStore('global', {
    // State
    state: () => {
        return {
            isLoading: false,
        };
    },
    // Actions
    actions: {},
});
