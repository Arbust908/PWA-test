<template>
    <Layout>
        <header class="flex flex-col md:flex-row md:justify-between items-center md:mb-4">
            <h1 class="font-bold text-gray-900 text-2xl self-start mb-3 md:mb-0">Arena - {{ type }}</h1>
        </header>
        <section class="bg-white rounded-md shadow-sm max-w-2xl pb-5">
            <SandForm
                :type="type"
                :description="observations"
                @update:type="type = $event"
                @update:description="observations = $event"
            />
        </section>
        <footer class="mt-[32px] gap-3 flex flex-col md:flex-row justify-end max-w-2xl">
            <section class="w-full space-x-3 flex items-center justify-end">
                <SecondaryBtn btn="wide" @click.prevent="$router.push('/tipos-de-arena')"> Cancelar </SecondaryBtn>
                <PrimaryBtn
                    btn="wide"
                    :is-loading="loading"
                    :disabled="!isFull ? 'yes' : null"
                    @click="isFull && getSandsAndCheckIfTypeExists()"
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
                        >¡El tipo de arena fue guardado con éxito!</span
                    >
                </div>
            </template>
            <template #btn>
                <div class="flex justify-center">
                    <PrimaryBtn @click.prevent="$router.push('/tipos-de-arena')">Continuar</PrimaryBtn>
                </div>
            </template>
        </Modal>
        <Modal type="off" :open="showErrorModal" @close="togglemodal">
            <template #body>
                <div class="text-center flex flex-col justify-center items-center">
                    <Icon icon="ExclamationCircle" class="h-[54px] w-[54px] mb-4 text-red-700" />
                    <span class="text-center text-base border-none text-gray-900"> Ya existe este tipo de malla </span>
                    <span class="text-center text-sm border-none m-2">
                        El tipo de arena que intentas guardar fue creado anteriormente.
                    </span>
                </div>
            </template>
            <template #btn>
                <div class="flex justify-center">
                    <WarningBtn @click.prevent="toggleErrorModal()">Volver</WarningBtn>
                </div>
            </template>
        </Modal>
        <Modal type="off" :open="showApiErrorModal" @close="togglemodal">
            <template #body>
                <div class="text-center flex flex-col justify-center items-center">
                    <Icon icon="ExclamationCircle" class="h-[54px] w-[54px] mb-4 text-red-400" />
                    <span class="text-center text-base border-none text-gray-900">
                        ¡Ups! Hubo un problema y no pudimos guardar el tipo de arena.
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
    import { reactive, ref, toRefs, defineAsyncComponent, computed } from 'vue';
    import { useStore } from 'vuex';
    import { useTitle, useToggle } from '@vueuse/core';
    import Layout from '@/layouts/Main.vue';
    import Icon from '@/components/icon/TheAllIcon.vue';
    import { useRouter, useRoute } from 'vue-router';
    import SecondaryBtn from '@/components/ui/buttons/SecondaryBtn.vue';
    import PrimaryBtn from '@/components/ui/buttons/PrimaryBtn.vue';
    import WarningBtn from '@/components/ui/buttons/WarningBtn.vue';
    import { Sand } from '@/interfaces/SandType';
    import axios from 'axios';

    const api = import.meta.env.VITE_API_URL || '/api';
    const Modal = defineAsyncComponent(() => import('@/components/modal/General.vue'));

    import SandForm from '@/components/sand/SandForm.vue';

    export default {
        components: {
            PrimaryBtn,
            SecondaryBtn,
            Layout,
            SandForm,
            Icon,
            Modal,
            WarningBtn,
        },
        setup() {
            const route = useRoute();
            const store = useStore();

            const sands: Array<Sand> = JSON.parse(JSON.stringify(store.state.sand.all));
            const currentSand: Sand = sands.find((sand) => {
                return sand.id == route.params.id;
            });
            useTitle(`Arena ${currentSand.type} <> Sandflow`);
            const router = useRouter();
            const loading = ref(false);

            const sandToUpdate = reactive({
                id: currentSand.id,
                type: currentSand.type,
                observations: currentSand.observations,
            });

            const currentSandType = currentSand.type;

            const isFull = computed(() => {
                return !!(sandToUpdate.type.length > 0);
            });

            const createdSands = ref([]);

            // MODALS
            const showModal = ref(false);
            const toggleModal = useToggle(showModal);

            const showErrorModal = ref(false);
            const toggleErrorModal = useToggle(showErrorModal);

            const showApiErrorModal = ref(false);
            const toggleApiErrorModal = useToggle(showApiErrorModal);

            const save = async () => {
                loading.value = true;
                const response = await axios.put(`${api}/sand/${currentSand.id}`, sandToUpdate).catch((err) => {
                    console.log(err);
                });
                loading.value = false;

                if (response.status === 200) {
                    toggleModal();
                } else {
                    toggleApiErrorModal();
                }
                store.dispatch('updateSand', sandToUpdate);
            };

            // TODO: Pasar a un useExist o algo asi
            const checkIfExists = async (model: string, field: string, value: string) => {
                const baseApiUrl = import.meta.env.VITE_API_URL || '/api';
                const apiResponse = await axios.get(`${baseApiUrl}/${model}?${field}=${value}`);
                const modelArray = apiResponse.data.data;

                return modelArray.length > 0;
            };

            const getSandsAndCheckIfTypeExists = async () => {
                try {
                    if (sandToUpdate.type == currentSandType) {
                        save();
                    } else if (await checkIfExists('sand', 'type', sandToUpdate.type)) {
                        toggleErrorModal();
                    } else {
                        save();
                    }
                } catch (error) {
                    console.log(error);
                }
            };

            return {
                sands,
                save,
                sandToUpdate,
                isFull,
                loading,
                ...toRefs(sandToUpdate),
                showModal,
                showErrorModal,
                showApiErrorModal,
                toggleModal,
                toggleErrorModal,
                toggleApiErrorModal,
                getSandsAndCheckIfTypeExists,
            };
        },
    };
</script>

<style lang="scss" scoped>
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
</style>
