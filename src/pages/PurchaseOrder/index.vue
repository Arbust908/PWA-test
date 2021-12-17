<template>
    <Layout>
        <ABMHeader title="Ordenes de Pedido" link="/orden-de-pedido/nueva" />
        <!-- <div class="relative grid grid-cols-12 col-span-full gap-4 mt-2">
            <FieldSelect
                title="Filtro"
                class="col-span-full sm:col-span-5 md:col-span-3 lg:col-span-4 xl:col-span-3"
                field-name="name"
                placeholder="Seleccionar cliente"
                endpoint="/sandProvider"
                :data="sandProviderId"
                @update:data="sandProviderId = $event"
            />
        </div> -->
        <VTable class="mt-5" :columns="columns" :pagination="pagination" :items="PurchaseOrders" :actions="actions">
            <template #item="{ item }">
                <td>
                    {{ item.id }}
                </td>
                <td :class="item.sandProvider ? null : 'empty'">
                    {{ item.sandProvider?.name || 'Sin proveedor' }}
                </td>
                <td :class="item.transportProvider ? null : 'empty'">
                    {{ item.transportProvider?.name || 'Sin proveedor' }}
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

<script lang="ts">
    import { ref, watch } from 'vue';
    import { createNamespacedHelpers } from 'vuex-composition-helpers';
    const { useState } = createNamespacedHelpers('purchaseOrder');
    import { useActions } from 'vuex-composition-helpers';
    import Layout from '@/layouts/Main.vue';
    import PrimaryBtn from '@/components/ui/buttons/PrimaryBtn.vue';
    import UiTable from '@/components/ui/TableWrapper.vue';
    import Icon from '@/components/icon/TheAllIcon.vue';
    import { useTitle, useMagicKeys, whenever } from '@vueuse/core';

    import { PurchaseOrder } from '@/interfaces/sandflow';
    import { useApi } from '@/helpers/useApi';
    import ABMHeader from '../../components/ui/ABMHeader.vue';
    import VTable from '@/components/ui/table/VTable.vue';

    export default {
        components: {
            PrimaryBtn,
            Layout,
            UiTable,
            Icon,
            ABMHeader,
            VTable,
        },
        setup() {
            useTitle('Ordenes de Pedido <> Sandflow');

            const { Ctrl_C } = useMagicKeys();
            whenever(Ctrl_C, () => {
                console.log('Crear Nuevo!');
            });

            const { deletePurchaseOrder, savePurchaseOrder } = useActions(['deletePurchaseOrder', 'savePurchaseOrder']);
            const { read, destroy } = useApi('/purchaseOrder');
            const PurchaseOrders = read();
            watch(PurchaseOrders, (newValue, _) => {
                if (newValue) {
                    storeToState(newValue);
                }
            });
            const storeToState = (pOs: PurchaseOrder[]) => {
                return pOs.map((pO) => {
                    savePurchaseOrder(pO);
                });
            };
            const deletePO = async (poId: number) => {
                PurchaseOrders.value = PurchaseOrders.value.filter((pO: PurchaseOrder) => {
                    return pO.id !== poId;
                });
                const data = destroy(poId);
                deletePurchaseOrder(poId);
            };

            const pagination = ref({
                sortKey: 'id',
                sortDir: 'asc',
                // currentPage: 1,
                // perPage: 10,
            });

            const columns = [
                { title: 'N°', key: 'id', sortable: true },
                { title: 'Centro de carga de arena', key: 'sandProvider.name', sortable: true },
                { title: 'Proveedor de transporte', key: 'transportProvider.name', sortable: true },
                { title: '', key: '' },
            ];

            const actions = [
                {
                    label: 'Eliminar',
                    callback: (item) => {
                        deletePO(item.id);
                    },
                },
                // {
                //     label: 'Reenviar',
                //     callback: () => {
                //         toggleModal();
                //     },
                // },
            ];

            return {
                PurchaseOrders,
                deletePO,
                pagination,
                columns,
                actions,
            };
        },
    };
</script>

<style lang="scss" scoped>
    @import '@/assets/table.scss';
</style>
