<template>
    <Layout>
        <header class="flex flex-col md:flex-row md:justify-between items-center md:mb-4">
            <h1 class="font-bold text-second-900 text-2xl self-start mb-3 md:mb-0">Notificación a proveedores</h1>
        </header>
        <section class="bg-second-0 rounded-md shadow-sm">
            <form method="POST" action="/" class="p-4 flex-col gap-4">
                <SandProviderPack
                    :sandProviders="sandProviderIds"
                    @update:sandProviders="sandProviderIds = $event"
                    @change="sandProviderHandler"
                    :filteredSandTypes="filteredSandTypes"
                />
                <fieldset class="py-2 w-full grid grid-cols-12 gap-3 md:gap-4">
                    <h2 class="col-span-full text-xl mt-4">Transporte</h2>
                    <template v-for="(tO, tOKey) in transportOrder" :key="tOKey">
                        <hr v-if="tOKey !== 0" class="mt-4 mb-2 col-span-full" />
                        <FieldSelect
                            :class="tOKey !== 0 ? 'col-span-10' : 'col-span-full sm:col-span-5'"
                            title="Proveedor"
                            :fieldName="`transportProvider${tO.id}`"
                            placeholder="Seleccionar"
                            endpoint="/transportProvider"
                            :data="tO.transportProviderId"
                            @update:data="tO.transportProviderId = $event"
                        />
                        <div v-if="transportOrder.length > 1" class="col-span-2 flex mx-auto items-end pb-2">
                            <Icon icon="Trash" outline class="w-5 h-5" @click="removeTransportProvider(tO.id)" />
                        </div>
                        <div class="relative grid grid-cols-12 col-span-full gap-4 mt-2">
                            <FieldInput
                                class="col-span-full sm:col-span-3"
                                :fieldName="`transportAmount${tO.id}`"
                                placeholder="Camiones"
                                title="Camiones"
                                :data="tO.amount"
                                @update:data="tO.amount = $event"
                            />
                            <FieldInput
                                class="col-span-full sm:col-span-5"
                                :fieldName="`transportObservations${tO.id}`"
                                placeholder="Observaciones"
                                title="Observaciones"
                                :data="tO.observation"
                                @update:data="tO.observation = $event"
                            />
                        </div>
                    </template>
                </fieldset>
            </form>
            <footer class="p-4 space-x-8 flex justify-end">
                <router-link to="/">
                    <NoneBtn> Cancelar </NoneBtn>
                </router-link>
                <PrimaryBtn
                    size="md"
                    :class="isSandFull || isTransportFull ? null : 'opacity-50 cursor-not-allowed'"
                    :disabled="!(isSandFull || isTransportFull)"
                    @click.prevent="(isSandFull || isTransportFull) && save()"
                >
                    Finalizar
                </PrimaryBtn>
            </footer>
        </section>
        <Modal type="off" :open="showModal" @close="togglemodal">
            <template #body>
                <div class="text-left" v-if="!isNotificationConfirmed">
                    <p class="text-base text-black font-bold">Notificación a proveedores</p>
                    <div
                        v-if="modalData.sandProvider"
                        class="
                            bg-gray-100
                            mt-4
                            rounded-r-md
                            py-4
                            pl-4
                            mb-2
                            border-l-4 border-green-500 border-opacity-50
                        "
                    >
                        <p class="font-bold text-black text-base">Arenas {{ modalData.sandProvider }}</p>
                        <ul>
                            <li
                                v-for="(order, index) in modalData.sandOrders"
                                :key="index"
                                class="text-black text-base list-none mt-1"
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
                            <li class="text-black text-base list-none mt-2">
                                {{ modalData.transportQuantity }} camion(es){{
                                    ` - ${modalData.transportObservations}`
                                }}
                            </li>
                        </ul>
                    </div>
                </div>
                <div
                    class="divide-y text-center flex flex-col justify-center text-xl items-center"
                    v-if="isNotificationConfirmed && apiRequest && hasSaveSuccess"
                >
                    <Icon icon="CheckCircle" class="h-[60px] w-[60px] mb-5 text-green-400" />
                    <span class="text-center text-base border-none text-gray-900"
                        >¡La notificación fue enviada con éxito!</span
                    >
                </div>
                <div
                    class="divide-y text-center flex flex-col justify-center text-xl items-center"
                    v-if="isNotificationConfirmed && apiRequest && !hasSaveSuccess"
                >
                    <Icon icon="exclamationCircle" class="h-[54px] w-[54px] mb-4 text-red-400" />
                    <span class="text-center text-base border-none text-gray-900"
                        >Hubo un problema con el envío de la notificación. <br />Por favor, intenta nuevamente</span
                    >
                </div>
            </template>
            <template #btn>
                <div class="flex gap-4 justify-end" v-if="!isNotificationConfirmed">
                    <button type="button" class="modal-close-button" @click.prevent="toggleModal">Volver</button>
                    <button type="button" class="modal-create-new-button" @click.prevent="confirmNotification">
                        Confirmar
                    </button>
                </div>
                <div class="flex justify-center gap-4" v-if="isNotificationConfirmed && apiRequest && hasSaveSuccess">
                    <router-link to="/" class="modal-close-button w-1/3">
                        <button type="button">Cerrar</button>
                    </router-link>
                    <button type="button" class="modal-create-new-button" @click.prevent="createNew">
                        Crear nueva
                    </button>
                </div>
                <div class="flex gap-4" v-if="isNotificationConfirmed && apiRequest && !hasSaveSuccess">
                    <button type="button" class="modal-close-button" @click.prevent="toggleModal">Volver</button>
                </div>
            </template>
        </Modal>
    </Layout>
</template>

<script lang="ts">
    import { ref, Ref, computed, defineComponent, defineAsyncComponent, watch, watchEffect } from 'vue';
    import { useStore } from 'vuex';
    import { useRouter } from 'vue-router';
    import { useTitle } from '@vueuse/core';
    import Icon from '@/components/icon/TheAllIcon.vue';
    import { TrashIcon } from '@heroicons/vue/outline';
    import { PlusIcon, BellIcon } from '@heroicons/vue/solid';
    import Layout from '@/layouts/Main.vue';
    import NoneBtn from '@/components/ui/buttons/NoneBtn.vue';
    import CircularBtn from '@/components/ui/buttons/CircularBtn.vue';
    import PrimaryBtn from '@/components/ui/buttons/PrimaryBtn.vue';
    import { ProviderNotification, SandOrder, TransportProvider, SandProvider, Sand } from '@/interfaces/sandflow';
    import { useToggle } from '@vueuse/core';
    import FieldGroup from '@/components/ui/form/FieldGroup.vue';
    import FieldInput from '@/components/ui/form/FieldInput.vue';
    import FieldLegend from '@/components/ui/form/FieldLegend.vue';
    import FieldSelect from '@/components/ui/form/FieldSelect.vue';
    import FieldWithSides from '@/components/ui/form/FieldWithSides.vue';
    import SandProviderPack from '@/components/notifications/sandProviderPack.vue';

    const Modal = defineAsyncComponent(() => import('@/components/modal/General.vue'));

    import axios from 'axios';
    import { useAxios } from '@vueuse/integrations/useAxios';
    import FieldTextArea from '@/components/ui/form/FieldTextArea.vue';
    const apiUrl = import.meta.env.VITE_API_URL || '/api';

    export default defineComponent({
        components: {
            BellIcon,
            CircularBtn,
            NoneBtn,
            Layout,
            Modal,
            PlusIcon,
            PrimaryBtn,
            TrashIcon,
            FieldGroup,
            FieldInput,
            FieldLegend,
            FieldSelect,
            FieldWithSides,
            SandProviderPack,
            Icon,
        },
        setup() {
            useTitle('Notificacion a Proveedores <> Sandflow');
            const router = useRouter();
            const store = useStore();
            const instance = axios.create({
                baseURL: apiUrl,
            });

            const pN: Ref<ProviderNotification> = ref({} as ProviderNotification);

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
                    sandOrder.value &&
                    sandOrder.value.every((so) => so.amount && so.amount > 0) &&
                    sandOrder.value.every((so) => so.sandType && so.sandType.id > 0)
                );
            });

            const isTransportFull = computed(() => {
                return !!(transportOrder.value && transportOrder.value.every((to) => to.amount && to.amount > 0));
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
                        sandOrders: sandProviderIds.value[0].SandOrders,
                    };
                }
                if (transportOrder.value[0].transportProviderId > 0 && sandProviderIds.value[0].id < 0) {
                    pN.value = {
                        transportProviderId: Number(transportOrder.value[0].transportProviderId),
                        cantidadCamiones: Number(transportOrder.value[0].amount),
                        observations: transportOrder.value[0].observation,
                    };
                }
                if (sandProviderIds.value[0].id > 0 && transportOrder.value[0].transportProviderId > 0) {
                    pN.value = {
                        textArena: 'Arena',
                        sandProviderId: Number(sandProviderIds.value[0].id),
                        sandOrders: sandProviderIds.value[0].SandOrders,
                        textTransporte: 'Transporte',
                        transportProviderId: Number(transportOrder.value[0].transportProviderId),
                        cantidadCamiones: Number(transportOrder.value[0].amount),
                        observations: transportOrder.value[0].observation,
                    };
                }

                const getSanitizedSandOrders = () => {
                    let sanitizedSandOrders = [];
                    pN.value.sandOrders.forEach((order) => {
                        return sanitizedSandOrders.push({
                            sandType: getSTName(order.sandTypeId),
                            amount: order.amount,
                        });
                    });
                    return sanitizedSandOrders;
                };

                const getTranportProviderName = (id) => {
                    return transportProviders.value.filter((each) => {
                        if (each.id == id) return each;
                    })[0].name;
                };

                modalData.value = {
                    sandProvider: getSPName(pN.value.sandProviderId) || null,
                    sandOrders: pN.value.sandOrders ? getSanitizedSandOrders() : null,
                    transportProvider:
                        Number(transportOrder.value[0].transportProviderId) !== -1
                            ? getTranportProviderName(Number(transportOrder.value[0].transportProviderId))
                            : null,
                    transportQuantity: pN.value.cantidadCamiones || null,
                    transportObservations: pN.value.observations || null,
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

                if (response.status == 200) {
                    isNotificationConfirmed.value = true;
                    apiRequest.value = true;
                    hasSaveSuccess.value = true;
                    // store.dispatch('saveProviderNotification', pN.value);
                } else {
                    isNotificationConfirmed.value = true;
                    apiRequest.value = true;
                    hasSaveSuccess.value = false;
                }
            };

            const createNew = () => {
                isNotificationConfirmed.value = false;
                apiRequest.value = false;
                transportOrder.value = [];
                transportOrder.value[0] = defaultTransportProvider;
                sandProviderIds.value = [];
                sandProviderIds.value[0] = {
                    innerId: 0,
                    id: -1,
                    SandOrders: [
                        {
                            innerId: 0,
                            sandTypeId: -1,
                            amount: null,
                        },
                    ],
                };

                toggleModal(false);
            };

            const toCapitalize = (str: string) => {
                return str.charAt(0).toUpperCase() + str.slice(1);
            };

            const filteredSandTypes = ref({});

            const sandProviderHandler = (event: Event) => {
                const selectedSandProviderId = event.target.value;
                const [filtered] = sandProviders.value.filter((sandProvider) => {
                    return sandProvider.id == selectedSandProviderId;
                });

                filteredSandTypes.value = filtered.meshType;
            };

            return {
                // sandProviderId,
                filteredSandTypes,
                sandProviderHandler,
                sandOrder,
                transportProviders,
                // addSandOrder,
                // removeSandOrder,
                addTransportProvider,
                removeTransportProvider,
                fillTransportType,
                save,
                showModal,
                toggleModal,
                isSandFull,
                isTransportFull,
                sandProviders,
                toCapitalize,
                sandTypes,
                transportOrder,
                // sandProvider,
                fillSandType,
                sandProviderIds,
                getSPName,
                getSTName,
                hasSaveSuccess,
                createNew,
                router,
                isNotificationConfirmed,
                apiRequest,
                modalData,
                confirmNotification,
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
</style>
