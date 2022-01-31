import { defineStore } from 'pinia';

type ModalType = 'error' | 'success' | 'info' | '';

export const useModalState = defineStore('modals', {
    // State
    state: () => {
        return {
            isOpened: false,
            modalType: '' as ModalType,
            title: '',
            content: '',
        };
    },
    // Actions
    actions: {
        openModal(modalType: ModalType, title: string, content: string) {
            this.isOpened = true;
            this.modalType = modalType;
            this.title = title;
            this.content = content;
        },
        closeModal() {
            this.isOpened = false;
            setTimeout(() => {
                this.modalType = '';
                this.title = '';
                this.content = '';
            }, 500);
        },
    },
});
