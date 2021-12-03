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

        <Modal type="off" :open="notificationModalvisible" @close="toggleNotificationModal">
            <template #body>
                <p>{{ errorMessage }}</p>
                <button class="closeButton" @click.prevent="toggleNotificationModal">Cerrar</button>
            </template>
        </Modal>

        <Modal type="off" :open="showErrorModal" @close="showErrorModal = false">
            <template #body>
                <div class="text-center flex flex-col justify-center items-center">
                    <Icon icon="ExclamationCircle" class="h-14 w-14 mb-4 text-red-700" />
                </div>
                <div class="text-center text-xl font-semibold mb-2 mx-10 text-gray-900">
                    Ya existe un centro de carga con este CUIT
                </div>
                <br />
                <span class="text-center text-base border-none m-2">
                    El centro de carga que intenta registrar fue creado anteriormente
                </span>
            </template>
            <template #btn>
                <div class="flex justify-center">
                    <PrimaryBtn btn="!px-16 !bg-red-700" @click.prevent="showErrorModal = false">Volver</PrimaryBtn>
                </div>
            </template>
        </Modal>

        <Modal type="off" :open="showSuccessModal" @close="$router.push('/proveedores-de-arena')">
            <template #body>
                <div class="text-center flex flex-col justify-center items-center">
                    <Icon icon="CheckCircle" class="h-14 w-14 mb-4 text-green-500" />
                </div>
                <div class="text-center text-lg font-semibold mb-4 mx-5 text-gray-900">
                    ¡El centro de carga fue guardado con éxito!
                </div>
            </template>
            <template #btn>
                <div class="flex justify-center mt-8">
                    <PrimaryBtn btn="!px-14 !bg-green-700" @click.prevent="$router.push('/proveedores-de-arena')"
                        >Continuar</PrimaryBtn
                    >
                </div>
            </template>
        </Modal>
    </Layout>
</template>

<script lang="ts">
    import { ref, Ref, watchEffect } from 'vue';
    import { useStore } from 'vuex';
    import { useRouter } from 'vue-router';
    import { useTitle } from '@vueuse/core';
    import { useToggle } from '@vueuse/core';
    import Layout from '@/layouts/Main.vue';
    import SecondaryBtn from '@/components/ui/buttons/SecondaryBtn.vue';
    import PrimaryBtn from '@/components/ui/buttons/PrimaryBtn.vue';
    import Icon from '@/components/icon/TheAllIcon.vue';
    import SandProviderForm from '@/components/sandProvider/ProviderForm.vue';
    import SandProviderRep from '@/components/sandProvider/RepFrom.vue';
    import Modal from '@/components/modal/General.vue';
    import { useStoreLogic } from '@/helpers/useStoreLogic';
    import { useValidator } from '@/helpers/useValidator';
    import { SandProvider, CompanyRepresentative } from '@/interfaces/sandflow';

    import axios from 'axios';
    const api = import.meta.env.VITE_API_URL || '/api';

    export default {
        components: {
            Layout,
            SecondaryBtn,
            PrimaryBtn,
            SandProviderForm,
            SandProviderRep,
            Modal,
            Icon,
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
                isNewRep,
                toggleRepStatus,
                companyRepresentative,
                sandProvider,
                isValidated,
                save,
                notificationModalvisible,
                toggleNotificationModal,
                errorMessage,
                loading,
                showErrorModal,
                showSuccessModal,
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
        &.readonly:read-only {
            @apply bg-white;
        }
        @apply w-full px-3 py-2 rounded focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-second-300 mt-1 flex shadow-sm;
    }
    input:read-only {
        @apply bg-second-200 border cursor-not-allowed;
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
