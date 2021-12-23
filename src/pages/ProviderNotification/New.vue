<template>
    <Layout>
        <ABMFormTitle title="Notificación a proveedores" />
        <section class="bg-second-0 rounded-md shadow-sm">
            <form method="POST" action="/" class="p-4 flex-col gap-4">
                <SandProviderPack
                    v-model:sand-providers="sandProviderIds"
                    :filtered-sand-types="filteredSandTypes"
                    @sand-provider-handler="sandProviderHandler"
                />
                <TransportPoviderPack
                    v-model:transportProviderId="transportOrder[0].transportProviderId"
                    v-model:amount="transportOrder[0].amount"
                    v-model:observation="transportOrder[0].observation"
                />
            </form>
        </section>

        <!-- *** -->
        <footer class="mt-8 space-x-3 flex justify-end items-center">
            <SecondaryBtn btn="wide" @click.prevent="$router.push('/notificaciones-a-proveedores')">
                Cancelar
            </SecondaryBtn>
            <PrimaryBtn
                btn="wide"
                :class="!someFull && 'opacity-50 cursor-not-allowed'"
                :disabled="!someFull"
                @click.prevent="someFull && save()"
            >
                Finalizar
            </PrimaryBtn>
        </footer>

        <NoticeModal
            :open="isNotificationConfirmed && apiRequest && hasSaveSuccess"
            title="¡La notificación está en proceso de envío!"
            text="En breve lo verás reflejado en la columna “Estado”"
            :icon="{ type: 'ArrowCircleUp', classes: 'text-gray-400 rotate-45' }"
            :btn="{ text: 'Volver', classes: 'indefinite' }"
            @close="$router.push('/notificaciones-a-proveedores')"
            @main="$router.push('/notificaciones-a-proveedores')"
        />
        <ErrorModal
            :open="isNotificationConfirmed && apiRequest && !hasSaveSuccess"
            text="Hubo un problema con el envío de la notificación. Por favor, intenta nuevamente."
            @close="
                showModal = false;
                isNotificationConfirmed = false;
            "
            @main="
                showModal = false;
                isNotificationConfirmed = false;
            "
        />
        <Modal :open="showModal" modal-classes="max-w-[440px] font-body" @close="showModal = false">
            <div v-if="!isNotificationConfirmed" class="text-left">
                <p class="text-lg text-black font-bold">Notificación a proveedores</p>
                <!-- <p class="mt-3">Se está por enviar una notificación a los siguientes proveedores:</p> -->
                <div
                    v-if="modalData.sandProvider"
                    class="bg-gray-100 mt-4 rounded-r-md py-4 pl-4 mb-2 border-l-4 border-green-500 border-opacity-50"
                >
                    <p class="font-bold text-black text-base">Arenas {{ modalData.sandProvider }}</p>
                    <ul>
                        <li
                            v-for="(order, index) in modalData.sandOrders"
                            :key="index"
                            class="text-black text-base font-light list-none mt-1"
                        >
                            {{ order.amount }}t - {{ order.sandType }}
                        </li>
                    </ul>
                </div>
                <div
                    v-if="modalData.transportProvider"
                    class="bg-gray-100 mt-3 rounded-r-md py-4 pl-4 border-l-4 border-green-500 border-opacity-50"
                >
                    <p class="font-bold text-black text-base">Transporte {{ modalData.transportProvider }}</p>
                    <ul>
                        <li class="text-black text-base font-light list-none mt-2">
                            {{ modalData.transportQuantity }} camion{{
                                modalData.transportQuantity > 1 ? '(es)' : null
                            }}
                            {{ modalData.transportObservations && ` - ${modalData.transportObservations}` }}
                        </li>
                    </ul>
                </div>
            </div>
            <div v-if="!isNotificationConfirmed" class="flex gap-4 justify-end mt-6">
                <SecondaryBtn :btn="'wide'" class="outline-none" @click.prevent="toggleModal"> Volver </SecondaryBtn>
                <PrimaryBtn :btn="'wide'" @click.prevent="confirmNotification">Confirmar</PrimaryBtn>
            </div>
        </Modal>
    </Layout>
</template>

<script lang="ts">
    import { SandOrder, TransportProvider, Sand } from '@/interfaces/sandflow';
    import axios from 'axios';
    import { useAxios } from '@vueuse/integrations/useAxios';

    import ABMFormTitle from '@/components/ui/ABMFormTitle.vue';
    import Layout from '@/layouts/Main.vue';
    import PrimaryBtn from '@/components/ui/buttons/PrimaryBtn.vue';
    import SandProviderPack from '@/components/notifications/sandProviderPack.vue';
    import TransportPoviderPack from '@/components/notifications/transportPoviderPack.vue';
    import SecondaryBtn from '@/components/ui/buttons/SecondaryBtn.vue';

    const Modal = defineAsyncComponent(() => import('@/components/modal/General.vue'));
    const ErrorModal = defineAsyncComponent(() => import('@/components/modal/ErrorModal.vue'));
    const NoticeModal = defineAsyncComponent(() => import('@/components/modal/NoticeModal.vue'));
    const apiUrl = import.meta.env.VITE_API_URL || '/api';

    export default defineComponent({
        components: {
            ABMFormTitle,
            ErrorModal,
            Layout,
            Modal,
            NoticeModal,
            PrimaryBtn,
            SandProviderPack,
            SecondaryBtn,
            TransportPoviderPack,
        },
        setup() {
            useTitle('Notificación a Proveedores <> Sandflow');
            const router = useRouter();
            const instance = axios.create({
                baseURL: apiUrl,
            });

            const pN = ref([]);
            const sandProviders = ref([] as Array<Sand>);
            const { data: sPData } = useAxios('/sandProvider', instance);
            watch(sPData, (sPData) => {
                if (sPData && sPData.data) {
                    sandProviders.value = sPData.data;
                }
            });
            const getSPName = (spId: number) => {
                const sp = sandProviders.value.find((sp) => {
                    return sp.id == spId;
                });

                return sp ? sp.name : '';
            };

            const sandTypes = ref([] as Array<Sand>);
            const { data: sData } = useAxios('/sand', instance);
            watch(sData, (sData) => {
                if (sData && sData.data) {
                    sandTypes.value = sData.data;
                }
            });

            const getSTName = (stId: number) => {
                const st = sandTypes.value.find((st) => {
                    return st.id == stId;
                });

                return st ? st.type : '';
            };

            interface sandProviderId {
                innerId: number;
                id?: number;
                sandOrders?: Array<SandOrder>;
            }
            const sandProviderIds: Ref<Array<sandProviderId>> = ref([]);

            const sandOrder: Ref<Array<SandOrder>> = ref([]);
            const fillSandType = (soId) => {
                const currSO = sandOrder.value.find((so) => so.id === soId);
                const currST = sandTypes.value.find((st) => st.id === currSO?.sandTypeId);
                currSO.sandType = currST;
            };

            const transportProviders = ref([]);
            const { data: tPData } = useAxios('/transportProvider', instance);
            watch(tPData, (tPData) => {
                if (tPData && tPData.data) {
                    transportProviders.value = tPData.data;
                }
            });
            const transportOrder: Ref<Array<TransportProvider>> = ref([]);
            const fillTransportType = (tOId) => {
                const currTO = transportOrder.value.find((tO) => tO.id === tOId);
                const currTP = transportProviders.value.find((tP) => {
                    return tP.id === currTO?.transportProviderId;
                });
                currTO.name = currTP.name;
            };

            const defaultTransportProvider: TransportProvider = {
                transportProviderId: -1,
                name: '',
                amount: null,
                observation: '',
            };

            const addTransportProvider = () => {
                const lastTransportProvider = transportOrder.value[transportOrder.value.length - 1];
                const lastTransportProviderId = lastTransportProvider ? lastTransportProvider.id : -2;
                const newTransportProvider = { ...defaultTransportProvider };
                newTransportProvider.id = lastTransportProviderId + 1;
                transportOrder.value.push(newTransportProvider);
            };
            const removeTransportProvider = (tpId: number) => {
                transportOrder.value = transportOrder.value.filter((tp) => tp.id !== tpId);
            };

            if (transportOrder.value.length === 0) {
                addTransportProvider();
            }

            const isSandFull = computed(() => {
                return !!(
                    sandProviderIds.value.length > 0 &&
                    sandProviderIds.value &&
                    sandProviderIds.value.every((spID) =>
                        spID.SandOrders.every((so) => {
                            return so.amount > 0;
                        })
                    ) &&
                    sandProviderIds.value.every((spID) =>
                        spID.SandOrders.every((so) => {
                            return so.sandTypeId >= 0;
                        })
                    )
                );
            });

            const isTransportFull = computed(() => {
                return !!(
                    transportOrder.value &&
                    transportOrder.value.every((to) => to.amount && to.amount > 0) &&
                    transportOrder.value.every((to) => to.transportProviderId && to.transportProviderId >= 0)
                );
            });

            const someFull = computed(() => {
                return isSandFull.value || isTransportFull.value;
            });

            const showModal = ref(false);
            const toggleModal = useToggle(showModal);
            const hasSaveSuccess = ref(false);
            const isNotificationConfirmed = ref(false);
            const apiRequest = ref(false);
            const modalData = ref({});

            const save = async () => {
                if (sandProviderIds.value[0].id > 0 && transportOrder.value[0].transportProviderId < 0) {
                    pN.value = {
                        sandProviderId: Number(sandProviderIds.value[0].id),
                        data: {
                            sandOrders: sandProviderIds.value[0].SandOrders,
                        },
                    };
                }

                if (transportOrder.value[0].transportProviderId > 0 && sandProviderIds.value[0].id < 0) {
                    pN.value = {
                        transportProviderId: Number(transportOrder.value[0].transportProviderId),
                        data: {
                            cantidadCamiones: Number(transportOrder.value[0].amount),
                            observations: transportOrder.value[0].observation,
                        },
                    };
                }

                if (sandProviderIds.value[0].id > 0 && transportOrder.value[0].transportProviderId > 0) {
                    pN.value = {
                        textArena: 'Arena',
                        sandProviderId: Number(sandProviderIds.value[0].id),
                        textTransporte: 'Transporte',
                        data: {
                            sandOrders: sandProviderIds.value[0].SandOrders,
                            cantidadCamiones: Number(transportOrder.value[0].amount),
                            observations: transportOrder.value[0].observation,
                        },
                        transportProviderId: Number(transportOrder.value[0].transportProviderId),
                    };
                }

                const getSanitizedSandOrders = () => {
                    let sanitizedSandOrders = [];
                    pN.value.data.sandOrders.forEach((order) => {
                        return sanitizedSandOrders.push({
                            sandType: getSTName(order.sandTypeId),
                            amount: order.amount,
                        });
                    });

                    return sanitizedSandOrders;
                };

                const getTranportProviderName = (id) => {
                    return transportProviders.value.filter((each) => {
                        if (each.id == id) {
                            return each;
                        }
                    })[0].name;
                };

                modalData.value = {
                    sandProvider: getSPName(pN.value.sandProviderId) || null,
                    sandOrders: pN.value.data.sandOrders ? getSanitizedSandOrders() : null,
                    transportProvider:
                        Number(transportOrder.value[0].transportProviderId) !== -1
                            ? getTranportProviderName(Number(transportOrder.value[0].transportProviderId))
                            : null,
                    transportQuantity: pN.value.data.cantidadCamiones || null,
                    transportObservations: pN.value.data.observations || null,
                };
                toggleModal(true);
            };

            const confirmNotification = async () => {
                const response = await axios
                    .post(`${apiUrl}/ProviderNotification`, pN.value)
                    .then((res) => {
                        return res;
                    })
                    .catch((err) => console.error(err));

                if (response?.status == 200) {
                    isNotificationConfirmed.value = true;
                    apiRequest.value = true;
                    hasSaveSuccess.value = true;
                } else {
                    isNotificationConfirmed.value = true;
                    apiRequest.value = true;
                    hasSaveSuccess.value = false;
                }
            };

            const filteredSandTypes = ref([]);

            const sandProviderHandler = (id: number) => {
                const selectedSandProviderId = id;
                const [filtered] = sandProviders.value.filter((sandProvider) => {
                    return sandProvider.id == selectedSandProviderId;
                });

                filteredSandTypes.value = filtered.meshType;
            };

            return {
                apiRequest,
                confirmNotification,
                filteredSandTypes,
                hasSaveSuccess,
                isNotificationConfirmed,
                modalData,
                sandProviderHandler,
                sandProviderIds,
                save,
                showModal,
                toggleModal,
                transportOrder,
                someFull,
            };
        },
    });
</script>

<style lang="scss" scoped>
    @import '@/assets/button.scss';
    .modal-close-button {
        @apply flex justify-center items-center rounded-md border border-black border-opacity-10 shadow-sm px-4 py-2 bg-white text-base font-medium text-second-400 hover:bg-gray-100;
    }
    .modal-create-new-button {
        @apply inline-flex justify-center w-1/2 rounded-md border border-transparent shadow-sm px-4 py-3 bg-main-600 text-base font-medium text-second-50 hover:bg-main-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-main-500;
    }
    .input {
        @apply w-full px-3 py-2 rounded focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-second-300 mt-1 flex shadow-sm;
    }
    input:read-only {
        @apply bg-second-200 border cursor-not-allowed;
    }
    fieldset:not(:last-of-type) {
        @apply border-b pb-6 border-gray-200;
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
</style>
