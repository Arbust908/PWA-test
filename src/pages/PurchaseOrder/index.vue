<template>
    <Layout>
        <header class="flex justify-start space-x-4 items-center mb-4">
            <h2 class="text-2xl font-semibold text-gray-900">Orden de Pedido</h2>
            <router-link to="/orden-de-pedido/nueva">
                <PrimaryBtn size="sm">
                    <span>Crear</span>
                    <Icon icon="PlusCircle" class="ml-1 w-4 h-4" />
                </PrimaryBtn>
            </router-link>
        </header>
        <hr />

        <div class="relative grid grid-cols-12 col-span-full gap-4 mt-2">
            <FieldSelect
                title="Filtro"
                class="col-span-full sm:col-span-5 md:col-span-3 lg:col-span-4 xl:col-span-3"
                field-name="name"
                placeholder="Seleccionar cliente"
                endpoint="/company"
                :data="clientId"
                @update:data="clientId = $event"
            />
            <div class="col-span-full sm:mt-7 sm:col-span-5">
                <GhostBtn size="sm" @click="clientId.value = -1"> Borrar filtros </GhostBtn>
            </div>
        </div>

        <VTable class="mt-5" :columns="columns" :pagination="pagination" :items="purchaseOrders" :actions="actions">
            <template #item="{ item: pO }">
                <!-- Desktop -->
                <td>
                    {{ pO.id }}
                </td>
                <td>
                    {{ (pO.company && pO.company.name) || '-' }}
                </td>
                <td>
                    {{ (pO.pit && pO.pit.name) || '-' }}
                </td>
                <td>
                    {{ (pO.sandProvider && pO.sandProvider.name) || '-' }}
                </td>
                <td>
                    {{ (pO.transportProvider && pO.transportProvider.name) || '-' }}
                </td>
                <td>
                    <Badge text="Enviada" classes="bg-green-600 text-white px-8 rounded-lg" />
                </td>
            </template>

            <!-- Mobile -->
            <template #mobileTitle="{ item }">
                {{ item.company.name }}
            </template>

            <template #mobileSubtitle="{ item }"> <span class="font-bold">Remito: </span>{{ item.id }} </template>
        </VTable>
    </Layout>
</template>

<script lang="ts">
    import { ref, onMounted } from 'vue';
    import { createNamespacedHelpers } from 'vuex-composition-helpers';
    import { useStore } from 'vuex';
    import { useRouter } from 'vue-router';
    import { useStoreLogic } from '@/helpers/useStoreLogic';
    import Layout from '@/layouts/Main.vue';
    import PrimaryBtn from '@/components/ui/buttons/PrimaryBtn.vue';
    import GhostBtn from '@/components/ui/buttons/GhostBtn.vue';
    import VTable from '@/components/ui/table/VTable.vue';
    import FieldSelect from '@/components/ui/form/FieldSelect.vue';
    import Badge from '@/components/ui/Badge.vue';
    import Icon from '@/components/icon/TheAllIcon.vue';
    import { useTitle, useMagicKeys, whenever } from '@vueuse/core';

    export default {
        components: {
            PrimaryBtn,
            GhostBtn,
            Layout,
            VTable,
            Icon,
            Badge,
            FieldSelect,
        },
        setup() {
            useTitle('Ordenes de Pedido <> Sandflow');
            const store = useStore();
            const router = useRouter();
            const clientId = ref(-1);
            const purchaseOrders = ref([]);

            const pagination = ref({
                sortKey: 'id',
                sortDir: 'asc',
                // currentPage: 1,
                // perPage: 10,
            });

            const columns = [
                { title: 'Remito', key: 'id', sortable: true },
                { title: 'Cliente', key: 'company.name', sortable: true },
                { title: 'Pozo', key: 'pit.name', sortable: true },
                { title: 'Prov.Arena', key: 'sandProvider.name', sortable: true },
                { title: 'Transporte', key: 'transportProvider.name', sortable: true },
                { title: 'Estado', key: 'operadora' },
                { title: '', key: 'name' },
            ];

            const actions = [
                {
                    label: 'Ver más',
                    onlyMobile: true,
                    callback: () => {
                        console.log('Ver más');
                    },
                },
                {
                    label: 'Reenviar',
                    callback: (item) => {
                        console.log('Reenviar');
                    },
                },
                {
                    label: 'Imprimir',
                    callback: (item) => {
                        console.log('Imprimir');
                    },
                },
                {
                    label: 'Cancelar',
                    callback: (item) => {
                        console.log('Cancelar');
                    },
                },
            ];

            const getPurchaseOrders = async () => {
                const result = await useStoreLogic(router, store, 'purchaseOrder', 'getAll');

                if (result.type == 'success') {
                    purchaseOrders.value = result.res;
                }
            };

            onMounted(async () => {
                getPurchaseOrders();
            });

            return {
                purchaseOrders,
                clientId,
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
