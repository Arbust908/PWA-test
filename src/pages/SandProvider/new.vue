<template>
    <Layout>
        <header class="flex flex-col md:flex-row md:justify-between items-center md:mb-4">
            <h1 class="font-bold text-gray-900 text-2xl self-start mb-3 md:mb-0">Nuevo centro de carga de arena</h1>
        </header>
        <section class="bg-white rounded-md max-w-2xl shadow-sm">
            <form method="POST" action="/" class="p-4 max-w-lg">
                <SandProviderForm v-model="sandProvider" />

                <SandProviderRep
                    :rep-name="companyRepresentative.name"
                    :rep-phone="companyRepresentative.phone"
                    :rep-email="companyRepresentative.email"
                    @update:repName="companyRepresentative.name = $event"
                    @update:repPhone="companyRepresentative.phone = $event"
                    @update:repEmail="companyRepresentative.email = $event"
                />
            </form>
        </section>

        <!-- *** -->
        <footer class="mt-8 gap-3 flex flex-col md:flex-row justify-end max-w-2xl">
            <section class="w-full space-x-3 flex items-center justify-end">
                <SecondaryBtn btn="wide" @click.prevent="$router.push('/proveedores-de-arena')">
                    Cancelar
                </SecondaryBtn>
                <PrimaryBtn btn="wide" :disabled="!isValidated ? 'yes' : null" @click="isValidated && save()">
                    Finalizar
                </PrimaryBtn>
            </section>
        </footer>

        <SuccessModal
            :open="showSuccessModal"
            text="¡El centro de carga fue guardado con éxito!"
            @close="$router.push('/proveedores-de-arena')"
            @main="$router.push('/proveedores-de-arena')"
        />
        <ErrorModal
            :open="notificationModalvisible"
            :text="errorMessage"
            @close="toggleNotificationModal()"
            @main="toggleNotificationModal()"
        />
        <ErrorModal
            :open="showErrorModal"
            title="Ya existe un centro de carga con este CUIT."
            text="El centro de carga que intenta registrar fue creado anteriormente."
            @close="showErrorModal = false"
            @main="showErrorModal = false"
        />
    </Layout>
</template>

<script lang="ts">
    import axios from 'axios';
    import { SandProvider, CompanyRepresentative } from '@/interfaces/sandflow';
    import { useStoreLogic } from '@/helpers/useStoreLogic';
    import { useValidator } from '@/helpers/useValidator';

    import ErrorModal from '@/components/modal/ErrorModal.vue';
    import Layout from '@/layouts/Main.vue';
    import PrimaryBtn from '@/components/ui/buttons/PrimaryBtn.vue';
    import SandProviderForm from '@/components/sandProvider/ProviderForm.vue';
    import SandProviderRep from '@/components/sandProvider/RepFrom.vue';
    import SecondaryBtn from '@/components/ui/buttons/SecondaryBtn.vue';
    import SuccessModal from '@/components/modal/SuccessModal.vue';

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

            const showErrorModal = ref(false);
            const showSuccessModal = ref(false);

            const isNewRep: Ref<boolean> = ref(false);
            const toggleRepStatus = useToggle(isNewRep);
            const loading = ref(false);

            const isValidated = ref(false);

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
                    showErrorModal.value = true;

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
                showSuccessModal.value = true;
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
                showErrorModal,
                showSuccessModal,
                toggleNotificationModal,
                toggleRepStatus,
            };
        },
    };
</script>
