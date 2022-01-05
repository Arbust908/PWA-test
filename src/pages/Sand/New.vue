<template>
    <Layout>
        <ABMTitle title="Nuevo tipo de arena" />
        <section class="bg-white rounded-md shadow-sm max-w-2xl pb-5">
            <SandForm v-model:type="type" v-model:observations="observations" />
        </section>
        <!-- *** -->
        <footer>
            <SecondaryBtn btn="wide" @click.prevent="$router.push('/tipos-de-arena')"> Cancelar </SecondaryBtn>
            <PrimaryBtn
                btn="wide"
                :is-loading="isLoading"
                :disabled="!isValidated"
                @click="isValidated && getSandsAndCheckIfTypeExists()"
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
            @close="showErrorModal = false"
            @main="showErrorModal = false"
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
    import Layout from '@/layouts/Main.vue';
    import SecondaryBtn from '@/components/ui/buttons/SecondaryBtn.vue';
    import PrimaryBtn from '@/components/ui/buttons/PrimaryBtn.vue';
    import ABMTitle from '@/components/ui/ABMFormTitle.vue';
    import { useValidator } from '@/helpers/useValidator';
    import axios from 'axios';
    const api = import.meta.env.VITE_API_URL || '/api';

    import SandForm from '@/components/sand/SandForm.vue';
    import ErrorModal from '@/components/modal/ErrorModal.vue';
    import SuccessModal from '@/components/modal/SuccessModal.vue';

    export default {
        components: {
            ABMTitle,
            Layout,
            PrimaryBtn,
            SandForm,
            SecondaryBtn,
            ErrorModal,
            SuccessModal,
        },
        setup() {
            useTitle('Nuevo tipo de arena <> Sandflow');
            const router = useRouter();
            const store = useStore();

            const goToIndex = () => {
                router.push('/tipos-de-arena');
            };

            const newSand = reactive({
                type: '',
                observations: '',
            });

            const isValidated = ref(false);
            const isLoading = ref(false);

            const createdSands = ref([]);

            // TODO: Pasar a un useExist o algo asi
            const checkIfExists = async (model: string, field: string, value: string) => {
                const baseApiUrl = import.meta.env.VITE_API_URL || '/api';
                const apiResponse = await axios.get(`${baseApiUrl}/${model}?${field}=${value}`);
                const modelArray = apiResponse.data.data;

                return modelArray.length > 0;
            };

            // MODALS
            const showModal = ref(false);
            const toggleModal = useToggle(showModal);

            const showErrorModal = ref(false);
            const toggleErrorModal = useToggle(showErrorModal);

            const showApiErrorModal = ref(false);
            const toggleApiErrorModal = useToggle(showApiErrorModal);

            watchEffect(async () => {
                isValidated.value = (await useValidator(store, 'sand')) ? true : false;
            });

            const save = async () => {
                isLoading.value = true;
                console.log(newSand);
                const response = await axios.post(`${api}/sand`, newSand).catch((err) => {
                    console.log(err);
                    toggleApiErrorModal;
                });

                isLoading.value = false;

                if (response.status === 200) {
                    toggleModal();
                } else {
                    toggleApiErrorModal;
                }
            };

            const getSandsAndCheckIfTypeExists = async () => {
                try {
                    if (await checkIfExists('sand', 'type', newSand.type)) {
                        toggleErrorModal();
                    } else {
                        save();
                    }
                } catch (error) {
                    console.log(error);
                }
            };

            return {
                ...toRefs(newSand),
                getSandsAndCheckIfTypeExists,
                goToIndex,
                isLoading,
                isValidated,
                save,
                showApiErrorModal,
                showErrorModal,
                showModal,
                toggleApiErrorModal,
                toggleErrorModal,
                toggleModal,
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
