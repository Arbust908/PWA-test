<template>
    <Layout>
        <header class="flex flex-col md:flex-row md:justify-between items-center md:mb-4">
            <h1 class="font-bold text-gray-900 text-xl self-start mb-3 md:mb-0">Orden de pedido</h1>
        </header>
        <section class="bg-white rounded-md shadow-sm">
            <form method="POST" action="/" class="p-4 flex flex-col gap-4">
                <FieldGroup class="max-w-2xl">
                    <ClientPitCombo
                        :client-id="companyClientId"
                        :pit-id="pitId"
                        @update:clientId="companyClientId = $event"
                        @update:pitId="pitId = $event"
                    />
                </FieldGroup>
                <FieldLegend>Arena</FieldLegend>
                <div
                    v-for="(providerId, sandProvidersKey) in sandProvidersIds"
                    :key="sandProvidersKey"
                    class="border-b pb-6"
                >
                    <FieldGroup class="grid border-none max-w-full">
                        <FieldSelect
                            class="col-span-4"
                            field-name="sandProvider"
                            title="Proveedor"
                            placeholder="Selecciona proveedor"
                            endpoint="/sandProvider"
                            :data="providerId.id"
                            @update:data="providerId.id = $event"
                        />
                    </FieldGroup>
                    <FieldGroup class="grid items-center max-w-full">
                        <template
                            v-for="(order, orderKey) in providerId.sandOrders"
                            :key="orderKey"
                            class="border-none"
                        >
                            <hr v-if="orderKey !== 0" class="mt-4 mb-2 col-span-full border-gray-300" />
                            <FieldSelect
                                :title="orderKey === 0 ? 'Tipo' : ''"
                                class="col-span-4"
                                field-name="sandType"
                                placeholder="Seleccciona Tipo de Arena"
                                endpoint="/sand"
                                endpoint-key="type"
                                :data="order.sandTypeId"
                                @update:data="order.sandTypeId = $event"
                            />
                            <label class="col-span-6 sm:col-span-3" for="sandQuantity">
                                <FieldWithSides
                                    :title="orderKey === 0 ? 'Cantidad' : ''"
                                    class="mt-3"
                                    field-name="sandQuantity"
                                    placeholder="Arena"
                                    type="number"
                                    :post="{ title: '0', value: 't' }"
                                    :data="order.amount"
                                    @update:data="order.amount = $event"
                                />
                            </label>
                            <FieldInput
                                :title="orderKey === 0 ? 'ID de caja' : ''"
                                class="col-span-3"
                                field-name="sandBoxId"
                                placeholder="Ingresar ID de caja"
                                :data="order.boxId"
                                @update:data="order.boxId = $event"
                            />
                            <Icon
                                v-if="providerId.sandOrders.length > 1"
                                icon="Trash"
                                type="outline"
                                class="w-5 mt-5 h-5 items-center cursor-pointer"
                                @click="removeOrder(order.id, providerId.innerId)"
                            />
                            <Icon
                                v-if="providerId.sandOrders.length - 1 == orderKey"
                                icon="Plus"
                                type="outline"
                                class="icon w-5 h-5 mt-5 items-center cursor-pointer"
                                @click.prevent="addOrder(providerId.innerId)"
                            />
                        </template>
                        <div class="flex items-center col-span-12">
                            <AddDeleteBtn
                                v-if="sandProvidersIds.length > 1"
                                purpose="remove"
                                @click.prevent="removeSandProvider(providerId.innerId)"
                            />
                            <!-- Arena Section -->
                            <AddDeleteBtn
                                v-if="sandProvidersIds.length - 1 == sandProvidersKey"
                                purpose="add"
                                @click.prevent="addSandProvider"
                            />
                        </div>
                    </FieldGroup>
                </div>
                <FieldGroup>
                    <FieldLegend>Transporte</FieldLegend>
                    <FieldSelect
                        class="col-span-full"
                        field-name="transportProvider"
                        title="Proveedor"
                        placeholder="Selecciona proveedor"
                        endpoint="/transportProvider"
                        :data="transportProviderId"
                        @update:data="transportProviderId = $event"
                    />
                </FieldGroup>
            </form>
            <footer class="p-4 space-x-8 flex justify-end">
                <SecondaryBtn @click.prevent="$router.push('/orden-de-pedido')"> Cancelar </SecondaryBtn>
                <PrimaryBtn type="submit" size="sm" class="p-4" :disabled="!isFull" @click.prevent="isFull && save()">
                    Guardar Orden
                </PrimaryBtn>
            </footer>
        </section>
    </Layout>
</template>

<script lang="ts">
    import { ref, Ref, computed, ComputedRef, watch } from 'vue';
    import { useStore } from 'vuex';
    import { useRouter, useRoute } from 'vue-router';
    import { useActions } from 'vuex-composition-helpers';
    import { useTitle } from '@vueuse/core';

    import Layout from '@/layouts/Main.vue';
    import SecondaryBtn from '@/components/ui/buttons/SecondaryBtn.vue';
    import PrimaryBtn from '@/components/ui/buttons/PrimaryBtn.vue';
    import axios from 'axios';
    import { useAxios } from '@vueuse/integrations/useAxios';
    import { Sand, SandOrder, SandProvider, PurchaseOrder, TransportProvider } from '@/interfaces/sandflow';
    import FieldGroup from '@/components/ui/form/FieldGroup.vue';
    import FieldLegend from '@/components/ui/form/FieldLegend.vue';
    import FieldInput from '@/components/ui/form/FieldInput.vue';
    import FieldSelect from '@/components/ui/form/FieldSelect.vue';
    import FieldWithSides from '@/components/ui/form/FieldWithSides.vue';
    import ClientPitCombo from '@/components/util/ClientPitCombo.vue';
    import Icon from '@/components/icon/TheAllIcon.vue';
    const api = import.meta.env.VITE_API_URL || '/api';
    import { useApi } from '@/helpers/useApi';

    export default {
        components: {
            Layout,
            PrimaryBtn,
            FieldGroup,
            FieldLegend,
            FieldInput,
            FieldWithSides,
            FieldSelect,
            ClientPitCombo,
            Icon,
            SecondaryBtn,
        },
        setup() {
            // :: Init
            const store = useStore();
            const router = useRouter();
            const route = useRoute();
            const id = route.params.id;
            useTitle(`Orden de Pedido ${id} <> Sandflow`);
            const instance = axios.create({
                baseURL: api,
            });
            const purchaseOrders: Array<PurchaseOrder> = JSON.parse(JSON.stringify(store.state.purchaseOrder.all));
            const purchaseOrder: PurchaseOrder = purchaseOrders.find((po) => {
                return po.id == id;
            });
            const currentPurchaseOrder = ref(purchaseOrder);
            const sandProviderId = ref(currentPurchaseOrder?.value?.sandProviderId ?? 0);
            const transportProviderId = ref(currentPurchaseOrder?.value?.transportProviderId ?? 0);
            const transportProvider = ref(currentPurchaseOrder?.value?.transportProvider ?? 0);
            const sandOrder = ref(currentPurchaseOrder?.value?.sandOrders ?? 0);
            const companyClientId: Ref<number> = ref(currentPurchaseOrder?.value?.companyId ?? 0);
            const pitId: Ref<number> = ref(currentPurchaseOrder?.value?.pitId ?? 0);
            const sandProvidersIds = ref([]);
            // >> Init
            // :: Proveedores de Sand
            const sandProviders = ref([] as Array<SandProvider>);
            const { data: sandProvidersData } = useAxios('/sandProvider', instance);
            watch(sandProvidersData, (sPData, prevCount) => {
                if (sPData && sPData.data) {
                    sandProviders.value = sPData.data;
                }
            });

            const sandTypes = ref([] as Array<Sand>);
            const { data: sandTypesData } = useAxios('/sand', instance);
            watch(sandTypesData, (sOData, prevCount) => {
                if (sOData && sOData.data) {
                    sandTypes.value = sOData.data;
                }
            });
            // >> Tipos de Sand
            const removeOrder = (id: number): void => {
                sandOrder.value = sandOrder.value.filter((sandOrder: SandOrder) => sandOrder.id !== id);
            };
            const addOrder = (): void => {
                const lastSandOrder = sandOrder.value[sandOrder.value.length - 1];
                const newId = lastSandOrder.id + 1;
                sandOrder.value.push({
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

            const isFull: ComputedRef<boolean> = computed(() => {
                return !!(
                    transportProviderId.value > -1 &&
                    sandProviderId.value > -1 &&
                    sandOrder.value.length > 0 &&
                    sandOrder.value.every((sO: SandOrder) => sO.amount > 0) &&
                    sandOrder.value.every((sO: SandOrder) => sO.type !== '')
                );
            });
            const getTPbyId = (id: number): TransportProvider => {
                return transportProviders.value.find((tp) => tp.id === id);
            };
            const getSPbyId = (id: number): SandProvider => {
                return sandProviders.value.find((sp) => sp.id === id);
            };

            const { savePurchaseOrder } = useActions(['savePurchaseOrder']);
            const save = (): void => {
                if (isFull.value) {
                    // Formateamos la orden de pedido
                    const purchaseOrder: PurchaseOrder = {
                        companyId: companyClientId.value,
                        companyClientId: companyClientId.value,
                        pitId: pitId.value,
                        sandProviderId: sandProvidersIds.value[0].id,
                        transportProviderId: transportProviderId.value,
                    };
                    // Creamos via API la orden de pedido
                    const { data: pODone } = useAxios(
                        `/purchaseOrder/${id}`,
                        { method: 'PUT', data: purchaseOrder },
                        instance
                    );
                    const sOisDone = ref([]);
                    watch(pODone, (newVal, _) => {
                        if (newVal && newVal.data) {
                            // Recorremos los proveedores de sand
                            sandProvidersIds.value.map((spI) => {
                                // Guradamos via api las ordenes de sand
                                spI.sandOrders.map((sO: SandOrder) => {
                                    sO.purchaseOrderId = newVal.data.id;
                                    sO.sandProviderId = spI.id;
                                    const { data: sODone } = useAxios(
                                        '/sandOrder',
                                        { method: 'POST', data: sO },
                                        instance
                                    );
                                    watch(sODone, (newVal, _) => {
                                        if (newVal && newVal.data) {
                                            sOisDone.value.push(newVal.data);
                                        }
                                    });
                                });
                            });
                        }
                    });
                    setTimeout(() => {
                        const ordenDePedido = pODone.value.data;
                        const pedidoDeArena = sOisDone.value;
                        ordenDePedido.sandOrders = pedidoDeArena;
                        savePurchaseOrder(ordenDePedido);
                        router.push('/orden-de-pedido');
                    }, 1000);
                }
            };

            return {
                sandProviderId,
                sandOrder,
                removeOrder,
                addOrder,
                transportProvider,
                isFull,
                save,
                sandProviders,
                sandTypes,
                transportProviders,
                transportProviderId,
                sandProvidersIds,
                companyClientId,
                pitId,
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
