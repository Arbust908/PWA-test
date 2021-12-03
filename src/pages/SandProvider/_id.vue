<template>
    <Layout>
        <header class="flex flex-col md:flex-row md:justify-between items-center md:mb-4">
            <h1 class="font-bold text-gray-900 text-2xl self-start mb-3 md:mb-0">
                Centro de carga de arena - {{ id }}
            </h1>
        </header>
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
                <div class="flex justify-center">
                    <PrimaryBtn btn="!px-14 !bg-green-700" @click.prevent="$router.push('/proveedores-de-arena')"
                        >Continuar</PrimaryBtn
                    >
                </div>
            </template>
        </Modal>
    </Layout>
</template>

<script lang="ts">
    import { ref, Ref, watchEffect, onMounted } from 'vue';
    import { useStore } from 'vuex';
    import { useRouter, useRoute } from 'vue-router';
    import { useTitle } from '@vueuse/core';
    import Layout from '@/layouts/Main.vue';
    import SecondaryBtn from '@/components/ui/buttons/SecondaryBtn.vue';
    import PrimaryBtn from '@/components/ui/buttons/PrimaryBtn.vue';
    import { useToggle } from '@vueuse/core';
    import SandProviderForm from '@/components/sandProvider/ProviderForm.vue';
    import SandProviderRep from '@/components/sandProvider/RepFrom.vue';
    import Modal from '@/components/modal/General.vue';
    import { useStoreLogic } from '@/helpers/useStoreLogic';
    import { useValidator } from '@/helpers/useValidator';
    import Icon from '@/components/icon/TheAllIcon.vue';

    // TIPOS
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

            const showErrorModal = ref(false);
            const showSuccessModal = ref(false);

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
                    showErrorModal.value = true;

                    return;
                }

                loading.value = true;
                const res = await useStoreLogic(router, store, 'sandProvider', 'update', currentSandProvider.value);

                loading.value = false;

                if (res.type == 'failed') {
                    errorMessage.value = res.message;
                    toggleNotificationModal();
                } else if (res.type == 'success') {
                    showSuccessModal.value = true;
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
