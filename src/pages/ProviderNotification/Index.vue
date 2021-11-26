<template>
    <Layout>
        <header class="flex justify-between items-center mb-4 px-3">
            <h2 class="text-2xl font-semibold text-second-900">Notificaciones a Proveedores</h2>
            <router-link to="/notificaciones-a-proveedores/nueva">
                <PrimaryBtn>Nueva Notificacion</PrimaryBtn>
            </router-link>
        </header>
        <div class="relative grid grid-cols-12 col-span-full gap-4 mt-2">
            <FieldSelect
                title="Filtro"
                class="col-span-full sm:col-span-5 md:col-span-3 lg:col-span-4 xl:col-span-3"
                field-name="name"
                placeholder="Seleccionar cliente"
                endpoint="/sandProvider"
                :data="sandProviderId"
                @update:data="sandProviderId = $event"
            />
            <div class="col-span-full sm:mt-7 sm:col-span-5">
                <GhostBtn size="sm" @click="listSandTypes()"> Borrar filtros </GhostBtn>
            </div>
        </div>
        <VTable class="mt-5" :columns="columns" :pagination="pagination" :items="provNotifDB" :actions="actions">
            <template #item="{ item }">
                <!-- Desktop -->

                <td :class="item.sandProvider.name ? null : 'empty'">
                    {{ item.sandProvider.name || 'Sin definir' }}
                </td>

                <td @click="listSandTypes(item.data?.sandOrders)" :class="item.sandProvider.name ? null : 'empty'">
                    {{ item.sandProvider.name || 'Sin definir' }}
                </td>

                <td :class="item.data ? null : 'empty'">
                    {{ listSandTypes(item.data?.sandOrders) || 'Sin definir' }}
                </td>

                <td :class="item.transportProvider ? null : 'empty'">
                    {{ item.transportProvider?.name || 'Sin definir' }}
                </td>

                <td :class="item.data ? null : 'empty'">
                    {{ item.data?.cantidadCamiones || 'Sin definir' }}
                </td>

                <td class="text-center" :class="item ? null : 'empty'">
                    <Badge v-if="item.isOperator" text="Completado" classes="bg-gray-500 text-white px-5" />
                    <Badge v-else text="En proceso" classes="bg-gray-300 text-gray-600" />
                </td>

                <tr v-if="provNotifDB && provNotifDB.length <= 0">
                    <td colspan="5" class="emptyState">
                        <p>No hay notificaciones cargadas</p>
                    </td>
                </tr>
            </template>

            <!-- Mobile -->
            <template #mobileTitle="{ item }">
                {{ item.name }}
            </template>

            <template #mobileSubtitle="{ item }">
                <span class="font-bold">Domicilio: </span>{{ item.address }}
            </template>
        </VTable>
    </Layout>
</template>

<script lang="ts">
    import { onMounted, ref, computed } from 'vue';
    import { useStore } from 'vuex';
    import { useTitle } from '@vueuse/core';
    import Layout from '@/layouts/Main.vue';
    import PrimaryBtn from '@/components/ui/buttons/PrimaryBtn.vue';
    import GhostBtn from '@/components/ui/buttons/GhostBtn.vue';
    import Icon from '@/components/icon/TheAllIcon.vue';
    import Modal from '@/components/modal/General.vue';
    import FieldSelect from '@/components/ui/form/FieldSelect.vue';
    import VTable from '@/components/ui/table/VTable.vue';
    import Badge from '@/components/ui/Badge.vue';
    import axios from 'axios';
    import { useAxios } from '@vueuse/integrations/useAxios';
    const apiUrl = import.meta.env.VITE_API_URL || '/api';

    export default {
        components: {
            Layout,
            PrimaryBtn,
            GhostBtn,
            Icon,
            FieldSelect,
            Badge,
            Modal,
            VTable,
        },
        setup() {
            useTitle('Notificaciones a Proveedores <> Sandflow');
            const store = useStore();
            const provNotifDB = ref([]);
            const loading = ref(false);
            const sandProviderId = ref(-1);

            const pagination = ref({
                sortKey: 'id',
                sortDir: 'asc',
                // currentPage: 1,
                // perPage: 10,
            });

            const columns = [
                { title: 'Crto. de Carga', key: 'sandProvider.name', sortable: true },
                { title: 'Arena', key: 'sandProvider.meshType.type', sortable: true },
                { title: 'Transporte', key: 'transportProvider.name', sortable: true },
                { title: 'Cant. Camiones', key: 'data.cantidadCamiones', sortable: true },
                { title: 'Estado', key: 'status' },
                { title: 'Acciones', key: '' },
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
                    callback: () => {
                        console.log('Reenviar');
                    },
                },
            ];

            const headers = {
                'Content-Type': 'Application/JSON',
            };

            const total = computed(() => {
                return clientId.value;
            });

            const filteredNotifications = computed(() => {
                if (sandProviderId.value > -1) {
                    return provNotifDB.value.filter((client) => client.sandProviderId == sandProviderId);
                }

                return provNotifDB.value;
            });

            const getProviderNotifications = async () => {
                loading.value = true;

                const res = await axios.get(`${apiUrl}/providerNotification`, headers).catch((err) => {
                    console.log(err);
                });

                if (res.status === 200) {
                    provNotifDB.value = res.data.data;
                }

                loading.value = false;
            };

            const instance = axios.create({
                baseURL: apiUrl,
            });

            const sandTypesFromId = ref([]);

            const getSands = async () => {
                const res = await axios.get(`${apiUrl}/sand`).catch((err) => {
                    console.log(err);
                });
                sandTypesFromId.value = res.data.data;
            };

            const getSTName = (id) => {
                const st = sandTypesFromId.value.find((st) => {
                    return st.id == id;
                });
                return st ? st.type : '';
            };

            const listSandTypes = (sandOrders) => {
                sandOrders.forEach((sand) => {
                    console.log(getSTName(sand.sandTypeId));
                    return getSTName(sand.sandTypeId);
                });
            };

            onMounted(async () => {
                await getProviderNotifications();
                await getSands();
            });

            const clearFilters = () => {
                sandProviderId.value = -1;
            };

            return {
                provNotifDB,
                loading,
                columns,
                total,
                actions,
                clearFilters,
                pagination,
                getSands,
                filteredNotifications,
                getProviderNotifications,
                getSTName,
                listSandTypes,
            };
        },
    };
</script>

<style lang="scss" scoped>
    @import '@/assets/table.scss';
</style>
