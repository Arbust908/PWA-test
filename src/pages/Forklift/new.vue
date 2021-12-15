<template>
    <Layout>
        <header class="flex flex-col md:flex-row md:justify-between items-center md:mb-4">
            <h1 class="font-bold text-gray-900 text-2xl self-start mb-3 md:mb-0">Nuevo Forklift</h1>
        </header>
        <section class="bg-white rounded-md shadow-sm max-w-2xl">
            <ForkliftForm :forklift="forklift" @update:forklift="forklift = $event" />
        </section>
        <!-- *** -->
        <footer class="mt-8 gap-3 flex md:flex-row-reverse justify-between max-w-2xl">
            <section class="space-x-3 flex items-center justify-end">
                <SecondaryBtn btn="wide" @click.prevent="goToIndex">Cancelar</SecondaryBtn>
                <PrimaryBtn
                    btn="wide"
                    :disabled="!isValidated"
                    @click="isValidated && getForkliftsAndCheckIfNameExists()"
                >
                    Finalizar
                </PrimaryBtn>
            </section>
        </footer>

        <SuccessModal
            :open="showModal"
            title="¡El forklift fue guardado con éxito!"
            @close="$router.push('/forklift')"
            @main="$router.push('/forklift')"
        />
        <ErrorModal
            :open="showErrorModal"
            title="Ya existe este forklift"
            text="El forklift que intentas guardar fue creado anteriormente."
            @close="showErrorModal = false"
            @main="showErrorModal = false"
        />
        <ErrorModal
            :open="showApiErrorModal"
            title="¡Ups! Hubo un problema y no pudimos guardar el forklift."
            text="Por favor, intentá nuevamente en unos minutos."
            @close="showApiErrorModal = false"
            @main="showApiErrorModal = false"
        />
    </Layout>
</template>

<script lang="ts">
    import { watchEffect, reactive, defineAsyncComponent, ref } from 'vue';
    import { useStore } from 'vuex';
    import { useRouter } from 'vue-router';
    import { useTitle, useToggle } from '@vueuse/core';
    import Layout from '@/layouts/Main.vue';
    import Icon from '@/components/icon/TheAllIcon.vue';
    import ForkliftForm from '@/components/forklift/Form.vue';
    import SecondaryBtn from '@/components/ui/buttons/SecondaryBtn.vue';
    import PrimaryBtn from '@/components/ui/buttons/PrimaryBtn.vue';
    import WarningBtn from '@/components/ui/buttons/WarningBtn.vue';
    import { useStoreLogic } from '@/helpers/useStoreLogic';
    import { useValidator } from '@/helpers/useValidator';
    import axios from 'axios';
    const api = import.meta.env.VITE_API_URL || '/api';
    const Modal = defineAsyncComponent(() => import('@/components/modal/General.vue'));
    import ErrorModal from '@/components/modal/ErrorModal.vue';
    import SuccessModal from '@/components/modal/SuccessModal.vue';

    export default {
        components: {
            Layout,
            SecondaryBtn,
            PrimaryBtn,
            ForkliftForm,
            Modal,
            Icon,
            WarningBtn,
            ErrorModal,
            SuccessModal,
        },
        setup() {
            useTitle('Nuevo Forklift <> Sandflow');
            const store = useStore();
            const router = useRouter();

            const createdForklifts = ref([]);
            const forklift = reactive({
                name: '',
                observations: '',
            });

            const goToIndex = (): void => {
                router.push('/forklift');
            };

            const isValidated = ref(false);

            watchEffect(async () => {
                isValidated.value = (await useValidator(store, 'forklift')) ? true : false;
            });

            // MODALS
            const showModal = ref(false);
            const toggleModal = useToggle(showModal);

            const showErrorModal = ref(false);
            const toggleErrorModal = useToggle(showErrorModal);

            const showApiErrorModal = ref(false);
            const toggleApiErrorModal = useToggle(showApiErrorModal);

            const save = async () => {
                await useStoreLogic(router, store, 'forklift', 'create', forklift).then((res) => {
                    if (res.type == 'failed') {
                        toggleApiErrorModal();
                    } else {
                        toggleModal();
                    }
                });
            };

            const getForkliftsAndCheckIfNameExists = async () => {
                try {
                    const forkliftsFromApi = await axios.get(`${api}/forklift`);

                    createdForklifts.value = forkliftsFromApi.data.data;

                    let types = createdForklifts.value.map((forklift) => forklift.name.toLowerCase());

                    if (types.includes(forklift.name.toLowerCase())) {
                        toggleErrorModal();
                    } else {
                        save();
                    }
                } catch (error) {
                    console.log(error);
                }
            };

            return {
                forklift,
                goToIndex,
                save,
                isValidated,
                showModal,
                showErrorModal,
                showApiErrorModal,
                toggleModal,
                toggleErrorModal,
                toggleApiErrorModal,
                getForkliftsAndCheckIfNameExists,
            };
        },
    };
</script>

<style lang="scss" scoped>
    @import '@/assets/button.scss';
    .closeButton {
        @apply inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-200 sm:bg-transparent text-base font-medium text-second-400 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:text-sm mt-3;
    }
    .section-tab {
        @apply py-2 border-b-4 w-full font-bold text-gray-400 flex justify-center items-center gap-2;
    }
    .section-tab[selected='true'] {
        @apply border-main-500 text-main-500;
    }
    .input-block select,
    .input-block input {
        @apply w-full rounded mb-3 p-2;
    }

    .pit-block {
        @apply flex mt-1 items-center w-full mb-3;
        & select,
        & input {
            @apply rounded p-2 max-w-md inline-block w-full;
        }
    }

    fieldset {
        @apply mb-6;
    }
    label {
        @apply text-sm;
    }
    .equip-grid {
        @apply grid gap-4 grid-cols-2 md:grid-cols-3;
    }
    .switch {
        @apply bg-gray-200;
        border: 2px solid rgb(175, 175, 175);
        border-radius: 20px;
        padding: 5px;
        width: 60px;
        cursor: pointer;
        transition: all 500ms ease-in-out;

        .switch-circle {
            height: 20px;
            width: 20px;
            border-radius: 100%;
            @apply bg-gray-400;
            transition: all 500ms ease-in-out;
        }

        &.true {
            transition: all 500ms ease-in-out;
            @apply bg-green-300;
            @apply border-green-500;

            .switch-circle {
                transition: all 500ms ease-in-out;
                transform: translateX(25px);
                @apply bg-green-500;
            }
        }
    }
</style>
