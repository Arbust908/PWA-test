<template>
    <Layout v-if="currentSand">
        <ABMTitle :title="`Arena - ${currentSand.type}`" />
        <section>
            <SandForm
                :type="currentSand.type"
                :observations="currentSand.observations"
                @update:type="currentSand.type = $event"
                @update:observations="currentSand.observations = $event"
            />
        </section>
        <!-- *** -->
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

        <SuccessModal
            :open="showModal"
            text="¡El tipo de arena fue guardado con éxito!"
            @close="$router.push('/tipos-de-arena')"
            @main="$router.push('/tipos-de-arena')"
        />
        <ErrorModal
            :open="showErrorModal"
            title="Ya existe este tipo de malla"
            text="El tipo de arena que intentas guardar fue creado anteriormente."
            @close="toggleErrorModal()"
            @main="toggleErrorModal()"
        />
        <ErrorModal
            :open="showApiErrorModal"
            title="¡Ups! Hubo un problema y no pudimos guardar el tipo de arena."
            text="Por favor, intentá nuevamente en unos minutos."
            @close="toggleApiErrorModal()"
            @main="toggleApiErrorModal()"
        />
    </Layout>
</template>

<script lang="ts">
    import axios from 'axios';
    import { Sand } from '@/interfaces/sandflow';
    import { useStoreLogic, StoreLogicMethods } from '@/helpers/useStoreLogic';

    import ABMTitle from '@/components/ui/ABMFormTitle.vue';
    import ErrorModal from '@/components/modal/ErrorModal.vue';
    import Layout from '@/layouts/Main.vue';
    import PrimaryBtn from '@/components/ui/buttons/PrimaryBtn.vue';
    import SandForm from '@/components/sand/SandForm.vue';
    import SecondaryBtn from '@/components/ui/buttons/SecondaryBtn.vue';
    import SuccessModal from '@/components/modal/SuccessModal.vue';

    const api = import.meta.env.VITE_API_URL || '/api';
    // const Modal = defineAsyncComponent(() => import('@/components/modal/General.vue'));

    export default {
        components: {
            ABMTitle,
            ErrorModal,
            Layout,
            PrimaryBtn,
            SandForm,
            SecondaryBtn,
            SuccessModal,
        },
        setup() {
            const router = useRouter();
            const route = useRoute();
            const store = useStore();
            const { GET } = StoreLogicMethods;
            const loading = ref(false);

            const currentSand = ref({
                type: '',
                observations: '',
            });

            const currentSandType = ref('');

            onMounted(async () => {
                loading.value = true;
                const sandId = route.params.id;
                const result = await useStoreLogic(router, store, 'sand', GET, sandId);
                console.log(result);
                currentSandType.value = result.res.type;
                console.log('segundo', currentSandType.value);

                if (result.type == 'success') {
                    currentSand.value = result.res;
                }
                loading.value = false;
            });

            useTitle(`Arena ${currentSandType} <> Sandflow`);

            const isFull = computed(() => {
                return !!(currentSand?.value.type?.length > 0);
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
                const response = await axios
                    .put(`${api}/sand/${currentSand.value.id}`, currentSand.value)

                    .catch((err) => {
                        console.log(err);
                    });
                loading.value = false;

                if (response.status === 200) {
                    toggleModal();
                } else {
                    toggleApiErrorModal();
                }
                store.dispatch('updateSand', currentSand.value);
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
                    if (currentSand.value.type == currentSandType.value) {
                        save();
                    } else if (await checkIfExists('sand', 'type', currentSand.value.type)) {
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
        @apply mt-8 gap-3 flex flex-row max-w-2xl w-full space-x-3 items-center justify-end;
    }
</style>
