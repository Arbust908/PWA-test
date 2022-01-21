<template>
    <Layout>
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
                    <Badge v-if="item.isOperator" text="Enviada" classes="bg-[#1AA532] text-white px-5" />
                    <Badge v-else text="En proceso" classes="bg-[#616161] text-white" />
                    <Badge v-if="false" text="Rechazada" classes="bg-[#BE1A3B] text-white px-5" />
                    <p v-if="false" class="italics">Cancelada</p>
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
    import { useActions } from 'vuex-composition-helpers';
    import Layout from '@/layouts/Main.vue';

    import { PurchaseOrder } from '@/interfaces/sandflow';
    import { useApi } from '@/helpers/useApi';
    import ABMHeader from '@/components/ui/ABMHeader.vue';
    import VTable from '@/components/ui/table/VTable.vue';
    import FieldSelect from '@/components/ui/form/FieldSelect.vue';
    import Badge from '@/components/ui/Badge.vue';

    useTitle('Ordenes de Pedido <> Sandflow');

    const sandProviderId = ref(-1);

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

    const actions = [
        {
            // label: 'Eliminar',
            // callback: (item: PurchaseOrder) => {
            //     deletePO(item.id);
            // },
            label: 'Reenviar',
            callback: (item: PurchaseOrder) => {
                console.log(item);
            },
            label: 'Imprimir',
            callback: (item: PurchaseOrder) => {
                console.log(item);
            },
            label: 'Cancelar',
            callback: (item: PurchaseOrder) => {
                console.log(item);
            },
        },
    ];
</script>

<style lang="scss" scoped>
    @import '@/assets/table.scss';
</style>
