<template>
    <Layout>
        <header class="flex flex-col md:flex-row md:justify-between items-center md:mb-4">
            <h1 class="font-bold text-gray-900 text-2xl self-start mb-3 md:mb-0">Forklift - {{ forklift.id }}</h1>
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
                    :disabled="!isValidated ? 'yes' : null"
                    @click="isValidated && getForkliftsAndCheckIfNameExists()"
                >
                    Finalizar
                </PrimaryBtn>
            </section>
        </footer>
        <Modal type="off" :open="showModal" @close="togglemodal">
            <template #body>
                <div class="text-center flex flex-col justify-center items-center">
                    <Icon icon="CheckCircle" class="h-[60px] w-[60px] mb-5 text-green-400" />
                    <span class="text-center text-base border-none text-gray-900"
                        >¡El forklift fue guardado con éxito!</span
                    >
                </div>
            </template>
            <template #btn>
                <div class="flex justify-center">
                    <PrimaryBtn @click.prevent="$router.push('/forklift')">Continuar</PrimaryBtn>
                </div>
            </template>
        </Modal>
        <ErrorModal
            :open="showErrorModal"
            title="Ya existe este forklift"
            text="El forklift que intentas guardar fue creado anteriormente."
            @close="showErrorModal = false"
            @main="showErrorModal = false"
        />
        <Modal type="off" :open="showApiErrorModal" @close="togglemodal">
            <template #body>
                <div class="text-center flex flex-col justify-center items-center">
                    <Icon icon="ExclamationCircle" class="h-[54px] w-[54px] mb-4 text-red-400" />
                    <span class="text-center text-base border-none text-gray-900">
                        ¡Ups! Hubo un problema y no pudimos guardar el forklift.
                    </span>
                    <span class="text-center text-sm border-none m-2">
                        Por favor, intentá nuevamente en unos minutos.
                    </span>
                </div>
            </template>
            <template #btn>
                <div class="flex justify-center">
                    <WarningBtn @click.prevent="toggleApiErrorModal()">Volver</WarningBtn>
                </div>
            </template>
        </Modal>
    </Layout>
</template>

<script lang="ts">
    import { ref, reactive, onMounted, defineAsyncComponent, watchEffect } from 'vue';
    import { useStore } from 'vuex';
    import { useRouter, useRoute } from 'vue-router';
    import { useTitle, useToggle } from '@vueuse/core';
    import Layout from '@/layouts/Main.vue';
    import Icon from '@/components/icon/TheAllIcon.vue';
    import ForkliftForm from '@/components/forklift/Form.vue';
    import SecondaryBtn from '@/components/ui/buttons/SecondaryBtn.vue';
    import PrimaryBtn from '@/components/ui/buttons/PrimaryBtn.vue';
    import WarningBtn from '@/components/ui/buttons/WarningBtn.vue';
    import { Forklift } from '@/interfaces/sandflow';
    import { useStoreLogic } from '@/helpers/useStoreLogic';
    import { useValidator } from '@/helpers/useValidator';
    import axios from 'axios';
    const api = import.meta.env.VITE_API_URL || '/api';
    const Modal = defineAsyncComponent(() => import('@/components/modal/General.vue'));
    import ErrorModal from '@/components/modal/ErrorModal.vue';

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
        },
        setup() {
            const store = useStore();
            const router = useRouter();
            const route = useRoute();
            const id = route.params.id;
            useTitle(`Forklift ${id} <> Sandflow`);
            const forklifts: Array<Forklift> = JSON.parse(JSON.stringify(store.state.forklifts.all));

            const createdForklifts = ref([]);

            const currentForklift: Forklift = forklifts.find((forklift) => {
                return forklift.id == route.params.id;
            });

            const forklift: Forklift = reactive({
                name: '',
                owned: '',
                ownerName: '',
                ownerContact: '',
                observations: '',
            });

            const currentForkliftName = currentForklift.name;

            onMounted(async () => {
                forklift.id = currentForklift.id;
                forklift.name = currentForklift.name;
                forklift.owned = currentForklift.owned || false;
                forklift.ownerName = currentForklift.ownerName;
                forklift.ownerContact = currentForklift.ownerContact;
                forklift.observations = currentForklift.observations;
            });

            const goToIndex = (): void => {
                router.push('/forklift');
            };

            const isValidated = ref(false);

            // MODALS
            const showModal = ref(false);
            const toggleModal = useToggle(showModal);

            const showErrorModal = ref(false);
            const toggleErrorModal = useToggle(showErrorModal);

            const showApiErrorModal = ref(false);
            const toggleApiErrorModal = useToggle(showApiErrorModal);

            watchEffect(async () => {
                isValidated.value = (await useValidator(store, 'forklift')) ? true : false;
            });

            const update = async () => {
                await useStoreLogic(router, store, 'forklift', 'update', forklift).then((res) => {
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

                    if (forklift.name.toLowerCase() == currentForkliftName.toLowerCase()) {
                        update();
                    } else if (types.includes(forklift.name.toLowerCase())) {
                        toggleErrorModal();
                    } else {
                        update();
                    }
                } catch (error) {
                    console.log(error);
                }
            };

            return {
                id,
                forklift,
                isValidated,
                goToIndex,
                update,
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
    .closeButton {
        @apply inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-200 sm:bg-transparent text-base font-medium text-second-400 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:text-sm mt-3;
    }
    .btn {
        &__draft {
            @apply border-main-400 text-main-500 bg-transparent hover:bg-main-50 hover:shadow-lg;
        }
        &__delete {
            @apply border-transparent text-gray-800 bg-transparent hover:bg-red-600 hover:text-white mx-2 p-2 transition duration-150 ease-out;
            /* @apply border-transparent text-white bg-red-500 hover:bg-red-600 mx-2 p-2; */
        }
        &__add {
            @apply border-transparent text-white bg-green-500 hover:bg-green-600 mr-2;
        }
        &__add--special {
            @apply border-2 border-gray-400 text-gray-400 bg-transparent group-hover:bg-gray-200 group-hover:text-gray-600 group-hover:border-gray-600;
        }
        &__mobile-only {
            @apply lg:hidden;
        }
        &__desktop-only {
            @apply hidden lg:inline-flex;
        }
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
