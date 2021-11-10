<template>
    <Layout>
        <header class="flex flex-col md:flex-row md:justify-between items-center md:mb-4">
            <h1 class="font-bold text-gray-900 text-[24px] self-start mb-3 md:mb-0">Orden de Pedido</h1>
        </header>
        <section class="bg-white rounded-md shadow-sm">
            <form method="POST" action="/" class="p-4 flex-col gap-4">
                <FieldGroup class="max-w-2xl border-none">
                    <ClientPitCombo
                        :client-id="companyClientId"
                        :pit-id="pitId"
                        @update:clientId="companyClientId = $event"
                        @update:pitId="pitId = $event"
                    />
                </FieldGroup>
                <FieldLegend>Arena</FieldLegend>
                <template v-for="(providerId, sandProvidersKey) in sandProvidersIds" :key="sandProvidersKey">
                    <div class="w-full grid grid-cols-12 gap-6 mb-4">
                        <FieldSelect
                            class="col-span-12 mt-5 md:col-span-6"
                            field-name="sandProvider"
                            title="Centro de Carga de Arena"
                            placeholder="Seleccionar centro de carga"
                            endpoint="/sandProvider"
                            :data="providerId.id"
                            @update:data="providerId.id = $event"
                            @change="changeProvider"
                        />
                    </div>
                    <FieldGroup
                        v-for="(order, orderKey) in providerId.sandOrders"
                        :key="orderKey"
                        class="max-w-3xl relative"
                        :class="isFirst(orderKey) ? null : ' mt-5'"
                    >
                        <FieldSelect
                            :title="orderKey === 0 ? 'Tipo' : ''"
                            class="col-span-6 sm:col-span-3"
                            field-name="sandType"
                            placeholder="Tipo de Arena"
                            endpoint="/sand"
                            endpoint-key="type"
                            :data="order.sandTypeId"
                            :filtered-data="filteredSandTypes"
                            @update:data="order.sandTypeId = $event"
                        />
                        <FieldWithSides
                            :title="orderKey === 0 ? 'Cantidad' : ''"
                            class="col-span-6 sm:col-span-3"
                            field-name="sandQuantity"
                            placeholder="Arena"
                            type="number"
                            :post="{ title: '0', value: 't', width: '3rem' }"
                            :data="order.amount"
                            @update:data="order.amount = $event"
                        />
                        <FieldInput
                            :title="orderKey === 0 ? 'ID de caja' : ''"
                            class="col-span-9 sm:col-span-4"
                            field-name="sandBoxId"
                            placeholder="ID"
                            is-optional
                            :data="order.boxId"
                            @update:data="order.boxId = $event"
                        />
                        <div
                            :class="isFirst(orderKey) ? 'mt-7' : 'mt-3'"
                            class="col-span-1 md:col-span-2 flex flex-row"
                        >
                            <CircularBtn
                                v-if="useIfNotLonly(providerId.sandOrders)"
                                size="md"
                                @click="removeOrder(order.id, providerId.innerId)"
                            >
                                <Icon icon="Trash" type="outline" class="w-7 h-7" />
                            </CircularBtn>
                            <div class="hidden sm:block">
                                <CircularBtn
                                    v-if="isLast(orderKey, providerId.sandOrders)"
                                    size="md"
                                    btn-class="bg-green-500"
                                    @click.prevent="addOrder(providerId.innerId)"
                                >
                                    <Icon icon="Plus" class="w-7 h-7 text-white" />
                                </CircularBtn>
                            </div>
                        </div>
                        <button
                            v-if="isLast(orderKey, providerId.sandOrders)"
                            class="mt-1 flex items-center col-span-6 sm:hidden"
                            @click.prevent="addOrder(providerId.innerId)"
                        >
                            <Icon icon="PlusCircle" class="w-7 h-7 text-green-500 mr-1" />
                            <span class="font-bold"> Agregar</span>
                        </button>
                    </FieldGroup>
                </template>
                <FieldGroup>
                    <FieldLegend class="mt-2">Transporte</FieldLegend>
                    <FieldSelect
                        class="col-span-12 md:col-span-6"
                        field-name="transportProvider"
                        title="Proveedor"
                        placeholder="Selecciona proveedor"
                        endpoint="/transportProvider"
                        :data="transportProviderId"
                        @update:data="transportProviderId = $event"
                    />
                    <FieldGroup v-for="(to, toKey) in TransportOrders" :key="toKey" class="col-span-full relative">
                        <FieldInput
                            :title="useOnFirst(toKey, 'Patente')"
                            class="col-span-6 sm:col-span-3"
                            field-name="trasportPatent"
                            placeholder="AA123AA"
                            endpoint="/sand"
                            endpoint-key="type"
                            :data="to.licensePlate"
                            @update:data="to.licensePlate = $event"
                        />
                        <FieldInput
                            :title="useOnFirst(toKey, 'Cantidad')"
                            class="col-span-6 sm:col-span-3"
                            field-name="boxAmount"
                            placeholder="0"
                            type="number"
                            :data="to.boxAmount"
                            @update:data="to.boxAmount = $event"
                        />
                        <FieldInput
                            :title="useOnFirst(toKey, 'Observaciones')"
                            class="col-span-9 sm:col-span-4"
                            field-name="observations"
                            placeholder="Ej: chasis chico"
                            is-optional
                            :data="to.observations"
                            @update:data="to.observations = $event"
                        />
                        <div :class="isFirst(toKey) ? 'mt-7' : 'mt-3'" class="col-span-1 md:col-span-2 flex flex-row">
                            <CircularBtn
                                v-if="useIfNotLonly(TransportOrders)"
                                size="md"
                                @click="removeTransportOrder(to.innerId)"
                            >
                                <Icon icon="Trash" type="outline" class="w-7 h-7" />
                            </CircularBtn>
                            <div class="hidden sm:block">
                                <CircularBtn
                                    v-if="isLast(toKey, TransportOrders)"
                                    size="md"
                                    btn-class="bg-green-500"
                                    @click.prevent="addTransportOrder()"
                                >
                                    <Icon icon="Plus" class="w-7 h-7 text-white" />
                                </CircularBtn>
                            </div>
                        </div>
                        <button
                            v-if="isLast(toKey, TransportOrders)"
                            class="mt-1 flex items-center col-span-6 sm:hidden"
                            @click.prevent="addTransportOrder()"
                        >
                            <Icon icon="PlusCircle" class="w-7 h-7 text-green-500 mr-1" />
                            <span class="font-bold"> Agregar</span>
                        </button>
                    </FieldGroup>
                </FieldGroup>
            </form>
        </section>
        <footer class="mt-[32px] space-x-3 flex justify-end">
            <SecondaryBtn btn="wide" @click.prevent="$router.push('/orden-de-pedido')"> Cancelar </SecondaryBtn>
            <PrimaryBtn btn="wide" :disabled="!isFull ? 'yes' : null" @click.prevent="isFull && confirm()">
                Crear Orden
            </PrimaryBtn>
        </footer>
        <OrderModal v-if="showModal" :show-modal="showModal" :po="po" @close="showModal = false" @confirm="save()" />
    </Layout>
</template>

<script lang="ts">
    import { ref, Ref, reactive, computed, ComputedRef, watch, watchEffect } from 'vue';
    import { useStore } from 'vuex';
    import { useRouter } from 'vue-router';
    import { useTitle } from '@vueuse/core';
    import Icon from '@/components/icon/TheAllIcon.vue';
    import Layout from '@/layouts/Main.vue';
    import SecondaryBtn from '@/components/ui/buttons/SecondaryBtn.vue';
    import CircularBtn from '@/components/ui/buttons/CircularBtn.vue';
    import PrimaryBtn from '@/components/ui/buttons/PrimaryBtn.vue';
    import axios from 'axios';
    import { useAxios } from '@vueuse/integrations/useAxios';
    import { useOnFirst, useIfNotLonly, isFirst, isLast, isNotLastAndNotLonly } from '@/helpers/iteretionHelpers';
    import {
        Sand,
        SandOrder,
        SandProvider,
        PurchaseOrder,
        TransportProvider,
        TransportOrder,
    } from '@/interfaces/sandflow';
    import FieldGroup from '@/components/ui/form/FieldGroup.vue';
    import FieldLegend from '@/components/ui/form/FieldLegend.vue';
    import FieldInput from '@/components/ui/form/FieldInput.vue';
    import FieldSelect from '@/components/ui/form/FieldSelect.vue';
    import FieldWithSides from '@/components/ui/form/FieldWithSides.vue';
    import ClientPitCombo from '@/components/util/ClientPitCombo.vue';
    import OrderModal from '@/components/purchaseOrder/Modal.vue';
    import Modal from '@/components/modal/General.vue';
    const api = import.meta.env.VITE_API_URL || '/api';

    export default {
        components: {
            Layout,
            SecondaryBtn,
            CircularBtn,
            PrimaryBtn,
            FieldGroup,
            FieldLegend,
            FieldInput,
            FieldSelect,
            FieldWithSides,
            ClientPitCombo,
            Icon,
            OrderModal,
            Modal,
        },
        setup() {
            useTitle('Nueva orden de pedido <> Sandflow');
            const router = useRouter();
            const instance = axios.create({
                baseURL: api,
            });
            const showModal = ref(false);
            const sandProvidersIds = ref([
                {
                    innerId: 0,
                    id: -1,
                    sandOrders: [
                        {
                            id: 0,
                            sandTypeId: -1,
                            amount: null,
                            boxId: '',
                        },
                    ],
                },
            ] as Array<Object>);

            const filteredSandTypes = ref([]);

            const changeProvider = () => {
                const [provider] = sandProviders.value.filter((sandProvider) => {
                    if (sandProvider.id == sandProvidersIds.value[0].id) {
                        return sandProvider;
                    }
                });

                filteredSandTypes.value = provider.meshType;
            };

            const defaultTransportOrder = {
                innerId: 0,
                boxAmount: 0,
                licensePlate: '',
                observations: '',
                purchaseOrderId: -1,
                drvierId: null,
            };

            const TransportOrders: Ref<Array<TransportOrder>> = ref([
                {
                    ...defaultTransportOrder,
                },
            ]);

            const removeTransportOrder = (id: number) => {
                TransportOrders.value = TransportOrders.value.filter((order) => order.innerId !== id);
            };

            const addTransportOrder = () => {
                const last = TransportOrders.value[TransportOrders.value.length - 1];
                TransportOrders.value.push({ ...defaultTransportOrder, innerId: last.innerId + 1 });
            };

            const addSandProvider = () => {
                const lastSPIndex = sandProvidersIds.value.length - 1;
                const lastSP = sandProvidersIds.value[lastSPIndex];
                const lastIndex = lastSP.innerId;
                const newInnerId = lastIndex >= 0 ? lastIndex + 1 : 0;
                sandProvidersIds.value.push({
                    innerId: newInnerId,
                    id: -1,
                    sandOrders: [
                        {
                            id: 0,
                            sandTypeId: -1,
                            amount: null,
                            boxId: '',
                        },
                    ],
                });
            };

            const removeSandProvider = (providerId: number) => {
                sandProvidersIds.value = sandProvidersIds.value.filter((sandProvider: SandProvider) => {
                    return sandProvider.innerId !== providerId;
                });
            };

            const sandProviders = ref([] as Array<SandProvider>);
            const { data: sandProvidersData } = useAxios('/sandProvider', instance);
            watch(sandProvidersData, (sPData, prevCount) => {
                if (sPData && sPData.data) {
                    sandProviders.value = sPData.data;
                }
            });
            const companyClientId: Ref<number> = ref(-1);
            const pitId: Ref<number> = ref(-1);
            // >> Proveedores de Sand
            // :: Ordenes de Sand
            const sandOrder: Ref<Array<any>> = ref([
                {
                    id: 0,
                    sandTypeId: -1,
                    amount: null,
                    boxId: '',
                },
            ]);
            // :: Ordenes de Sand
            const sandOrders = ref([] as Array<SandOrder>);

            const sandTypes = ref([] as Array<Sand>);
            const { data: sandTypesData } = useAxios('/sand', instance);

            watch(sandTypesData, (sOData, prevCount) => {
                if (sOData && sOData.data) {
                    sandTypes.value = sOData.data;
                }
            });

            const removeOrder = (id: number, providerOrderId): void => {
                const currentSPI = sandProvidersIds.value.find((spi) => spi.innerId === providerOrderId);
                currentSPI.sandOrders = currentSPI.sandOrders.filter((order) => order.id !== id);
            };
            const addOrder = (providerOrderId: number): void => {
                const currentSPI = sandProvidersIds.value.find((spi) => spi.innerId === providerOrderId);
                const sandOrder = currentSPI.sandOrders;
                const lastSandOrder = sandOrder[sandOrder.length - 1];
                const newId = lastSandOrder.id + 1;
                sandOrder.push({
                    id: newId,
                    sandTypeId: -1,
                    amount: null,
                    boxId: '',
                });
            };
            // :: TransportProvider
            const transportProviders = ref([]);
            const { data: tPData } = useAxios('/transportProvider', instance);
            watch(tPData, (tPData, prevCount) => {
                if (tPData && tPData.data) {
                    transportProviders.value = tPData.data;
                }
            });
            const transportProviderId: Ref<number> = ref(-1);
            const transportProvider: TransportProvider = reactive({
                id: 1,
                name: '',
                transportId: '',
                boxQuantity: null,
                observation: '',
                amount: null,
            });
            // >> TransportProvider
            const isFull: ComputedRef<boolean> = computed(() => {
                const hasPit = pitId.value >= 0;
                const hasClient = companyClientId.value >= 0;
                const validSandProviderIds =
                    sandProvidersIds.value &&
                    sandProvidersIds.value.every((spi) => {
                        return spi.id >= 0;
                    });
                const validSandOrders =
                    sandProvidersIds.value &&
                    sandProvidersIds.value.every((spi) => {
                        return (
                            spi.sandOrders &&
                            spi.sandOrders.every((so) => {
                                return so.sandTypeId >= 0 && so.amount > 0;
                            })
                        );
                    });
                const hasTransport = transportProviderId.value >= 0;
                const hasTransportOrders = !!(
                    TransportOrders.value.length > 0 &&
                    TransportOrders.value.every((to) => {
                        return to.boxAmount > 0;
                    }) &&
                    TransportOrders.value.every((to) => {
                        return to.licensePlate !== '' && to.licensePlate.length > 0;
                    })
                );

                return !!(
                    hasPit &&
                    hasClient &&
                    validSandProviderIds &&
                    validSandOrders &&
                    hasTransport &&
                    hasTransportOrders
                );
            });
            const po = ref(null);
            const confirm = () => {
                const sp = sandProviders.value.find((sandP) => {
                    return sandP.id === sandProvidersIds.value[0].id;
                });
                const tp = transportProviders.value.find((transportP) => {
                    return transportP.id === transportProviderId.value;
                });
                po.value = {
                    sandProvider: { ...sp },
                    sandOrders: [...sandProvidersIds.value[0].sandOrders],
                    sands: [...sandTypes.value],
                    transportProvider: { ...tp },
                    transportOrders: TransportOrders.value,
                };
                showModal.value = true;
            };

            const _saveTO = (poId: number) => {
                TransportOrders.value.forEach((to) => {
                    to.purchaseOrderId = poId;
                    useAxios('/transportOrder', { method: 'POST', data: to }, instance);
                });
            };
            const _saveSO = (poId: number) => {
                sandProvidersIds.value.map((spI) => {
                    // Guradamos via api las ordenes de sand
                    spI.sandOrders.map((sO: SandOrder) => {
                        const { id, ...newSO } = sO;
                        newSO.purchaseOrderId = poId;
                        newSO.sandProviderId = spI.id;
                        useAxios('/sandOrder', { method: 'POST', data: newSO }, instance);
                    });
                });
            };
            const _formatPO = () => {
                const purchaseOrder: PurchaseOrder = {
                    companyId: companyClientId.value,
                    companyClientId: companyClientId.value,
                    pitId: pitId.value,
                    sandProviderId: sandProvidersIds.value[0].id,
                    transportProviderId: transportProviderId.value,
                };

                return purchaseOrder;
            };
            const save = (): void => {
                if (isFull.value) {
                    // Formateamos la orden de pedido
                    const purchaseOrder = _formatPO();
                    console.log(purchaseOrder);
                    // Creamos via API la orden de pedido
                    const { data: pODone } = useAxios(
                        '/purchaseOrder',
                        { method: 'POST', data: purchaseOrder },
                        instance
                    );
                    const sOisDone = ref([]);
                    watch(pODone, (newVal, _) => {
                        if (newVal && newVal.data) {
                            // Recorremos los proveedores de sand
                            const poId = newVal.data.id;
                            _saveTO(poId);
                            _saveSO(poId);
                            setTimeout(() => {
                                router.push('/orden-de-pedido');
                            }, 1000);
                        }
                    });
                }
            };

            return {
                sandOrder,
                removeOrder,
                addOrder,
                transportProvider,
                isFull,
                save,
                sandOrders,
                sandProviders,
                sandTypes,
                transportProviders,
                transportProviderId,
                companyClientId,
                pitId,
                sandProvidersIds,
                addSandProvider,
                removeSandProvider,
                confirm,
                showModal,
                po,
                TransportOrders,
                useOnFirst,
                useIfNotLonly,
                removeTransportOrder,
                addTransportOrder,
                isFirst,
                isLast,
                isNotLastAndNotLonly,
                changeProvider,
                filteredSandTypes,
            };
        },
    };
</script>

<style lang="scss" scoped>
    .icon-button {
        @apply font-bold flex items-center col-span-12 cursor-pointer;
    }
    .input {
        @apply w-full px-3 py-2 rounded focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 mt-1 flex shadow-sm;
    }
    fieldset:not(:last-of-type) {
        @apply border-b pb-6;
    }
    label {
        @apply flex flex-col;
        span {
            @apply text-sm;
        }
    }
    // Quizas hay que armar algo externo para los estilos de boton
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
</style>
