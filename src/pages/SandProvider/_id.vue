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
                <PrimaryBtn btn="wide" :disabled="!isValidated ? 'yes' : null" @click="isValidated && save()">
                    Finalizar
                </PrimaryBtn>
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

    const Modal = defineAsyncComponent(() => import('@/components/modal/General.vue'));
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
                    console.log('id existe');
                    toggleCuilErrorModal();
                    return;
                }

                const nameExists = await checkIfExists('name', currentSandProvider.value.name);
                if (nameExists) {
                    console.log('nombre existe');
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
    .input {
        @apply w-full px-3 py-2 rounded focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-second-300 mt-1 flex shadow-sm;
    }
    input:read-only {
        @apply bg-second-200 border cursor-not-allowed;
    }
    fieldset:not(:last-of-type) {
        @apply border-b pb-6;
    }
    label:not(.toggle) {
        @apply flex flex-col;
        span {
            @apply text-sm;
        }
    }
    .toggle {
        @apply flex space-x-3 items-center;
    }
    .equip-grid {
        @apply grid gap-4 grid-cols-2 md:grid-cols-3;
    }
</style>
