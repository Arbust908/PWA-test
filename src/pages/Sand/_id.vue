<template>
    <Layout v-if="currentSand">
        <ABMTitle :title="`Arena - ${currentSand.type}`" />
        {{ currentSand }}
        <!-- <section>
            <SandForm
                :type="type"
                :description="observations"
                @update:type="type = $event"
                @update:description="observations = $event"
            />
        </section>
        <footer>
            <SecondaryBtn btn="wide" type="a" @click="$router.push('/tipos-de-arena')"> Cancelar </SecondaryBtn>
            <PrimaryBtn
                btn="wide"
                :is-loading="loading"
                :disabled="!isFull ? 'yes' : null"
                @click="isFull && getSandsAndCheckIfTypeExists()"
            >
                Finalizar
            </PrimaryBtn>
        </footer>
        <Modal type="off" :open="showModal" @close="toggleModal">
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
        <Modal type="off" :open="showErrorModal" @close="toggleErrorModal">
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
        <Modal type="off" :open="showApiErrorModal" @close="toggleApiErrorModal">
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
        </Modal> -->
    </Layout>
</template>

<script lang="ts">
    import Layout from '@/layouts/Main.vue';
    import Icon from '@/components/icon/TheAllIcon.vue';
    import SecondaryBtn from '@/components/ui/buttons/SecondaryBtn.vue';
    import PrimaryBtn from '@/components/ui/buttons/PrimaryBtn.vue';
    import WarningBtn from '@/components/ui/buttons/WarningBtn.vue';
    import { Sand } from '@/interfaces/sandflow';
    import axios from 'axios';
    import { useStoreLogic, StoreLogicMethods } from '@/helpers/useStoreLogic';

    const api = import.meta.env.VITE_API_URL || '/api';
    const Modal = defineAsyncComponent(() => import('@/components/modal/General.vue'));

    import SandForm from '@/components/sand/SandForm.vue';
    import ABMTitle from '@/components/ui/ABMTitle.vue';

    export default {
        components: {
            ABMTitle,
            Icon,
            Layout,
            Modal,
            PrimaryBtn,
            SandForm,
            SecondaryBtn,
            WarningBtn,
        },
        setup() {
            const router = useRouter();
            const route = useRoute();
            const store = useStore();
            const { GET } = StoreLogicMethods;
            const loading = ref(false);

            const currentSand: Sand = ref(null as Sand);
            onMounted(async () => {
                loading.value = true;
                const sandId = route.params.id;
                const result = await useStoreLogic(router, store, 'sand', GET, sandId);
                console.log(result);

                if (result.type == 'success') {
                    currentSand.value = result.res;
                }
                loading.value = false;
            });

            const currentSandType = currentSand.type;
            useTitle(`Arena ${currentSandType} <> Sandflow`);

            const isFull = computed(() => {
                return !!(currentSand?.type?.length > 0);
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
                save,
                currentSand,
                isFull,
                loading,
                ...toRefs(currentSand),
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
    section {
        @apply bg-white rounded-md shadow-sm max-w-2xl pb-5;
    }
    footer {
        @apply mt-[32px] gap-3 flex flex-row max-w-2xl w-full space-x-3 items-center justify-end;
    }
</style>
