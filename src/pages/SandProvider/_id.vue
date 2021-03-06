<template>
    <Layout>
        <ABMFormTitle :title="`Centro de carga de arena - ${id}`" />
        <section class="bg-white rounded-md max-w-2xl shadow-sm">
            <form method="POST" action="/" class="p-4 max-w-lg">
                <SandProviderForm v-if="currentSandProvider" v-model="currentSandProvider" />

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
    import axios from 'axios';
    import { SandProvider, CompanyRepresentative } from '@/interfaces/sandflow';
    import { useStoreLogic } from '@/helpers/useStoreLogic';
    import { useValidator } from '@/helpers/useValidator';

    import ABMFormTitle from '@/components/ui/ABMFormTitle.vue';
    import Layout from '@/layouts/Main.vue';
    import PrimaryBtn from '@/components/ui/buttons/PrimaryBtn.vue';
    import SandProviderForm from '@/components/sandProvider/ProviderForm.vue';
    import SandProviderRep from '@/components/sandProvider/RepFrom.vue';
    import SecondaryBtn from '@/components/ui/buttons/SecondaryBtn.vue';

    import ErrorModal from '@/components/modal/ErrorModal.vue';
    import SuccessModal from '@/components/modal/SuccessModal.vue';

    const api = import.meta.env.VITE_API_URL || '/api';

    export default {
        components: {
            ABMFormTitle,
            ErrorModal,
            Layout,
            PrimaryBtn,
            SandProviderForm,
            SandProviderRep,
            SecondaryBtn,
            SuccessModal,
        },
        setup() {
            const store = useStore();
            const loading = ref(false);
            const router = useRouter();
            const route = useRoute();
            const id = ref(0);
            useTitle(`Centro de Carga de Arena ${id.value} <> Sandflow`);
            const notificationModalvisible = ref(false);
            const toggleNotificationModal = () => (notificationModalvisible.value = !notificationModalvisible.value);
            const errorMessage = ref('');
            const meshTypes = ref([]);
            const apiUrl = import.meta.env.VITE_API_URL || '/api';

            const showModal = ref(false);
            const toggleModal = useToggle(showModal);

            const showNameErrorModal = ref(false);
            const toggleNameErrorModal = useToggle(showNameErrorModal);

            const showCuilErrorModal = ref(false);
            const toggleCuilErrorModal = useToggle(showCuilErrorModal);

            const currentSandProvider: SandProvider = ref({
                meshType: [],
            });
            const isNewRep: Ref<boolean> = ref(false);
            const toggleRepStatus = useToggle(isNewRep);
            const companyRepresentative: CompanyRepresentative = ref({});

            let meshType = ref('');

            const isValidated = ref(false);

            watchEffect(async () => {
                isValidated.value = (await useValidator(store, 'sandProvider')) ? true : false;
            });

            const save = async () => {
                //Todo: fix validación para el campo sandProvider.mesh

                if (currentSandProvider.value.meshType.length === 0) {
                    alert('debe ingresar un tipo de malla');

                    return;
                }

                const legalIdExists = await checkIfExists('legalId', currentSandProvider.value.legalId);

                if (legalIdExists) {
                    toggleCuilErrorModal();

                    return;
                }

                const nameExists = await checkIfExists('name', currentSandProvider.value.name);

                if (nameExists) {
                    toggleNameErrorModal();

                    return;
                }

                loading.value = true;
                const res = await useStoreLogic(router, store, 'sandProvider', 'update', currentSandProvider.value);

                loading.value = false;

                if (res.type == 'failed') {
                    errorMessage.value = res.message;
                    toggleNotificationModal();
                } else if (res.type == 'success') {
                    toggleModal();
                }
            };

            onMounted(async () => {
                loading.value = true;
                id.value = route.params.id;

                await axios.get(`${apiUrl}/sand`).then((res) => {
                    meshTypes.value = res.data.data.map((sand) => {
                        return {
                            id: sand.id,
                            type: sand.type,
                        };
                    });
                });

                await axios.get(`${apiUrl}/sandProvider/${id.value}`).then((res) => {
                    currentSandProvider.value = res.data.data;
                    companyRepresentative.value = currentSandProvider.value.companyRepresentative;
                });

                loading.value = false;
            });

            const checkIfExists = async (field: string, value: string) => {
                //TODO: Refactor with useStoreLogic ? (useStoreLogic not accept filters)
                const apiResponse = await axios.get(`${api}/sandProvider?${field}=${value}?id__`);
                const sandProviders = apiResponse.data.data;

                return sandProviders.filter((sp) => sp.id !== currentSandProvider.value.id).length > 0;
            };

            return {
                id,
                isNewRep,
                toggleRepStatus,
                companyRepresentative,
                currentSandProvider,
                isValidated,
                save,
                meshType,
                notificationModalvisible,
                toggleNotificationModal,
                errorMessage,
                meshTypes,
                loading,
                showModal,
                showNameErrorModal,
                showCuilErrorModal,
                toggleModal,
                toggleCuilErrorModal,
                toggleNameErrorModal,
            };
        },
    };
</script>
