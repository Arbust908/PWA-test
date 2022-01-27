<template>
    <Layout>
        <PDF v-show="false" ref="pdf" :info="pdfInfo" />

        <ABMHeader title="Ordenes de pedido" link="/orden-de-pedido/nueva" />
        <div class="relative grid grid-cols-12 col-span-full gap-4 mt-2">
            <FieldSelect
                v-model:data="sandProviderId"
                title="Filtro"
                class="col-span-full sm:col-span-5 md:col-span-3 lg:col-span-4 xl:col-span-3"
                field-name="name"
                placeholder="Seleccionar cliente"
                endpoint="/sandProvider"
            />
        </div>
        <VTable
            class="mt-5"
            :columns="columns"
            :pagination="pagination"
            :items="PurchaseOrders"
            :actions="actions"
            disable-key="id"
        >
            <template #item="{ item }">
                <td>
                    {{ item.id }}
                </td>
                <td :class="item?.company?.name ? null : 'empty'">
                    {{ item?.company?.name }}
                </td>
                <td :class="item?.pit?.name ? null : 'empty'">
                    {{ item?.pit?.name }}
                </td>
                <td :class="item.sandProvider ? null : 'empty'">
                    {{ item.sandProvider?.name || 'Sin proveedor' }}
                </td>
                <td :class="item.transportProvider ? null : 'empty'">
                    {{ item.transportProvider?.name || 'Sin proveedor' }}
                </td>
                <td class="text-center" :class="item ? null : 'empty'">
                    <Badge
                        class="text-white px-5"
                        :class="getNotificationInfo(item).color"
                        :text="getNotificationInfo(item).text"
                    />

                    <!-- <Badge v-if="item.isOperator" text="Enviada" classes="bg-[#1AA532] text-white px-5" />
                    <Badge v-else text="En proceso" classes="bg-[#616161] text-white" />
                    <Badge v-if="false" text="Rechazada" classes="bg-[#BE1A3B] text-white px-5" />
                    <p v-if="false" class="italics">Cancelada</p> -->
                </td>
            </template>

            <!-- Mobile -->
            <template #mobileTitle="{ item }"> <span class="font-bold">Orden: </span> {{ item.id }} </template>

            <template #mobileSubtitle="{ item }">
                <span class="font-bold">Arena: </span>{{ item.sandProvider?.name }}
                <span class="font-bold">Transporte: </span>{{ item.transportProvider?.name }}
            </template>
        </VTable>
    </Layout>
</template>

<script setup lang="ts">
    const STATUS_NOTIFICATION_PENDING = 0;
    const STATUS_NOTIFICATION_DELIVERED = 1;
    const STATUS_NOTIFICATION_FAILED = 2;
    const STATUS_NOTIFICATION_CANCELLED = 3;

    import { useActions } from 'vuex-composition-helpers';
    import dayjs from 'dayjs';
    import axios from 'axios';
    import Layout from '@/layouts/Main.vue';
    const api = import.meta.env.VITE_API_URL || '/api';

    import { PurchaseOrder } from '@/interfaces/sandflow';
    import { useApi } from '@/helpers/useApi';
    import ABMHeader from '@/components/ui/ABMHeader.vue';
    import VTable from '@/components/ui/table/VTable.vue';
    import FieldSelect from '@/components/ui/form/FieldSelect.vue';
    import Badge from '@/components/ui/Badge.vue';
    import PDF from '@/components/purchaseOrder/PDF.vue';
    import { useAxios } from '@vueuse/integrations/useAxios';

    const instance = axios.create({
        baseURL: api,
    });

    useTitle('Ordenes de Pedido <> Sandflow');

    const sandProviderId = ref(-1);

    const sandTypes = ref([] as Array<Sand>);
    const { data: sandTypesData } = useAxios('/sand', instance);
    watch(sandTypesData, (sOData, prevCount) => {
        if (sOData && sOData.data) {
            sandTypes.value = sOData.data;
        }
    });

    const drivers = ref([]);

    const getNotificationInfo = (value) => {
        switch (value.notificationStatus) {
            case STATUS_NOTIFICATION_PENDING:
                return {
                    color: 'bg-[#616161]',
                    text: 'En proceso',
                };
            case STATUS_NOTIFICATION_DELIVERED:
                return {
                    color: 'bg-[#1AA532]',
                    text: 'Enviada',
                };
            case STATUS_NOTIFICATION_CANCELLED:
                return {
                    color: '',
                    text: 'Cancelada',
                };
            case STATUS_NOTIFICATION_FAILED:
                return {
                    color: 'bg-[#BE1A3B]',
                    text: 'Fallida',
                };
            default:
                return {
                    color: 'bg-[#616161]',
                    text: 'En proceso',
                };
        }
    };

    const pdf = ref(null);

    const pdfInfo = computed(() => {
        const emptyThing = {
            name: 'none',
        };
        const client = emptyThing;
        const pit = emptyThing;

        const purchaseOrder = selectedPurchaseOrder.value || {};

        let localDate = '';

        let localTime = '';

        if (purchaseOrder.deliveryTime) {
            // day js get only date
            localDate = dayjs(purchaseOrder.deliveryTime).format('DD/MM/YYYY');

            // day js get only time
            localTime = dayjs(purchaseOrder.deliveryTime).format('HH:mm');
        }

        return {
            purchaseOrder: {
                ...purchaseOrder,
                sands: [...sandTypes.value],
                transportProvider: {
                    ...purchaseOrder.transportProvider,
                    drivers: drivers.value,
                },
            },

            client: purchaseOrder.company?.name,
            pit: purchaseOrder.pit?.name,
            localDate: localDate,
            localTime: purchaseOrder.deliveryTime,
            observation: purchaseOrder?.packageObservations,
        };
    });

    const { deletePurchaseOrder, savePurchaseOrder } = useActions(['deletePurchaseOrder', 'savePurchaseOrder']);
    const { read, destroy } = useApi('/purchaseOrder');
    const PurchaseOrders: Array<PurchaseOrder> = read();
    watch(PurchaseOrders, (newValue, _) => {
        if (newValue) {
            storeToState(newValue);
        }
    });
    const storeToState = (pOs: Array<PurchaseOrder>) => {
        return pOs.map((pO) => {
            savePurchaseOrder(pO);
        });
    };
    const deletePO = async (poId: number) => {
        PurchaseOrders.value = PurchaseOrders.value.filter((pO: PurchaseOrder) => {
            return pO.id !== poId;
        });
        destroy(poId);
        deletePurchaseOrder(poId);
    };

    const pagination = ref({
        sortKey: 'id',
        sortDir: 'asc',
    });

    const columns = [
        { title: 'Remito', key: 'id', sortable: true },
        { title: 'Cliente', key: 'company.name', sortable: true },
        { title: 'Pozo', key: 'sandProvider.name', sortable: true },
        { title: 'Centro de carga de arena', key: 'sandProvider.name', sortable: true },
        { title: 'Proveedor de transporte', key: 'transportProvider.name', sortable: true },
        { title: 'Estado', key: 'transportProvider.name', sortable: true },
        { title: '', key: 'actions' },
    ];

    const selectedPurchaseOrder = ref(null);

    const actions = [
        {
            label: 'Reenviar',
            // hide: (item: PurchaseOrder) => {
            //     retornar solo cuando la notificacion esta en estado ??
            // },
            callback: async (item: PurchaseOrder) => {
                selectedPurchaseOrder.value = item;

                await new Promise((resolve) => setTimeout(resolve, 500));

                const pdfContent = await pdf.value?.getFileContent();

                const result = await axios
                    .post(`${api}/purchaseOrder/${item.id}/resend`, {
                        pdfContent,
                    })
                    .catch((err) => {
                        console.log(err);
                        alert('ERROR' + err);
                    });

                if (result.status === 200) {
                    alert('OK');
                }
            },
        },

        {
            label: 'Cancelar',
            // hide: (item: PurchaseOrder) => {
            //     retornar solo cuando la notificacion esta en estado ??
            // },
            callback: async (item: PurchaseOrder) => {
                selectedPurchaseOrder.value = item;

                const result = await axios.post(`${api}/purchaseOrder/${item.id}/cancel`).catch((err) => {
                    console.log(err);
                    alert('ERROR' + err);
                });

                if (result.status === 200) {
                    alert('OK');
                }
            },
        },

        {
            label: 'Imprimir PDF',
            callback: async (item: PurchaseOrder) => {
                selectedPurchaseOrder.value = item;
                //wait one second
                await new Promise((resolve) => setTimeout(resolve, 500));

                await pdf.value?.download();
            },
        },
    ];

    onMounted(async () => {
        // TODO: StoreLogic
        const result = await axios.get(`${api}/driver`);
        drivers.value = result.data.data;
    });
</script>

<style lang="scss" scoped>
    @import '@/assets/table.scss';
</style>
