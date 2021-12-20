<template>
    <Layout>
        <header class="flex flex-col md:flex-row md:justify-between items-center md:mb-4">
            <h1 class="font-bold text-gray-900 text-2xl self-start mb-3 md:mb-0">Nuevo centro de carga de arena</h1>
        </header>
        <section class="bg-white rounded-md max-w-2xl shadow-sm">
            <form method="POST" action="/" class="p-4 max-w-lg">
                <SandProviderForm v-model="sandProvider" />

                <SandProviderRep
                    v-model:rep-name="companyRepresentative.name"
                    v-model:rep-phone="companyRepresentative.phone"
                    v-model:rep-email="companyRepresentative.email"
                />
            </form>
        </section>

        <footer class="mt-8 gap-3 flex flex-col md:flex-row justify-end max-w-2xl">
            <section class="w-full space-x-3 flex items-center justify-end">
                <SecondaryBtn btn="wide" @click.prevent="$router.push('/proveedores-de-arena')">
                    Cancelar
                </SecondaryBtn>
                <PrimaryBtn btn="wide" :disabled="!isValidated" @click="isValidated && save()"> Finalizar </PrimaryBtn>
            </section>
        </footer>

        <SuccessModal
            :open="showModal"
            title="¡El centro de carga fue guardado con éxito!"
            @close="$router.push('/proveedores-de-arena')"
            @main="$router.push('/proveedores-de-arena')"
        />
        <ErrorModal
            :open="showNameErrorModal"
            title="Ya existe un centro de carga con este nombre."
            text="El forklift que intentas guardar fue creado anteriormente."
            @close="showNameErrorModal = false"
            @main="showNameErrorModal = false"
        />
        <ErrorModal
            :open="showCuilErrorModal"
            title="Ya existe un centro de carga con este CUIT."
            text="El centro de carga que intenta registrar fue creado anteriormente."
            @close="showCuilErrorModal = false"
            @main="showCuilErrorModal = false"
        />
    </Layout>
</template>

<script lang="ts">
    import Layout from '@/layouts/Main.vue';
    import SecondaryBtn from '@/components/ui/buttons/SecondaryBtn.vue';
    import PrimaryBtn from '@/components/ui/buttons/PrimaryBtn.vue';
    import SandProviderForm from '@/components/sandProvider/ProviderForm.vue';
    import SandProviderRep from '@/components/sandProvider/RepFrom.vue';
    import { useStoreLogic } from '@/helpers/useStoreLogic';
    import { useValidator } from '@/helpers/useValidator';
    import { SandProvider, CompanyRepresentative } from '@/interfaces/sandflow';

    import ErrorModal from '@/components/modal/ErrorModal.vue';
    import SuccessModal from '@/components/modal/SuccessModal.vue';

    import axios from 'axios';
    const api = import.meta.env.VITE_API_URL || '/api';

    export default {
        components: {
            Layout,
            SecondaryBtn,
            PrimaryBtn,
            SandProviderForm,
            SandProviderRep,
            ErrorModal,
            SuccessModal,
        },
        setup() {
            useTitle(`Nuevo Centro de Carga de Arena <> Sandflow`);
            const store = useStore();
            const router = useRouter();

            const notificationModalvisible = ref(false);
            const toggleNotificationModal = () => (notificationModalvisible.value = !notificationModalvisible.value);
            const errorMessage = ref('');

            const showSuccessModal = ref(false);

            const isNewRep: Ref<boolean> = ref(false);
            const toggleRepStatus = useToggle(isNewRep);
            const loading = ref(false);

            const isValidated = ref(false);

            const showModal = ref(false);
            const toggleModal = useToggle(showModal);

            const showNameErrorModal = ref(false);
            const toggleNameErrorModal = useToggle(showNameErrorModal);

            const showCuilErrorModal = ref(false);
            const toggleCuilErrorModal = useToggle(showCuilErrorModal);

            const companyRepresentative: CompanyRepresentative = ref({
                companyRepresentativeName: '',
                phone: '',
                email: '',
            });

            const sandProvider: SandProvider = ref({
                name: '',
                address: '',
                legalId: null,
                meshType: [],
                observations: '',
                companyRepresentativeId: -1,
            });

            watchEffect(async () => {
                isValidated.value = (await useValidator(store, 'sandProvider')) ? true : false;
            });

            const save = async () => {
                const legalIdExists = await checkIfExists('legalId', sandProvider.value.legalId);

                if (legalIdExists) {
                    toggleCuilErrorModal();

                    return;
                }

                const nameExists = await checkIfExists('name', sandProvider.value.name);

                if (nameExists) {
                    toggleNameErrorModal();

                    return;
                }

                loading.value = true;
                sandProvider.value.companyRepresentative = companyRepresentative.value;

                const res = await useStoreLogic(router, store, 'sandProvider', 'create', sandProvider.value);

                loading.value = false;

                if (res.type === 'failed') {
                    errorMessage.value = res.message;
                    toggleNotificationModal();

                    return;
                }
                toggleModal();
            };

            const checkIfExists = async (field: string, value: string) => {
                //TODO: Refactor with useStoreLogic ? (useStoreLogic not accept filters)
                const apiResponse = await axios.get(`${api}/sandProvider?${field}=${value}`);
                const sandProviders = apiResponse.data.data;

                return sandProviders.length > 0;
            };

            return {
                companyRepresentative,
                errorMessage,
                isNewRep,
                isValidated,
                loading,
                notificationModalvisible,
                sandProvider,
                save,
                showCuilErrorModal,
                showModal,
                showNameErrorModal,
                showSuccessModal,
                toggleCuilErrorModal,
                toggleModal,
                toggleNameErrorModal,
                toggleNotificationModal,
                toggleRepStatus,
            };
        },
    };
</script>
