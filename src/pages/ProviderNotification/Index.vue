<template>
    <Layout>
        <header class="flex justify-start space-x-4 items-center mb-4">
            <h2 class="text-2xl font-semibold text-gray-900">Notificaciones a Proveedores</h2>
            <router-link to="/planificacion-de-arena/nueva">
                <PrimaryBtn size="sm">
                    <span> Crear </span>
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
                endpoint="/sandProvider"
                :data="sandProviderId"
                @update:data="sandProviderId = $event"
            />
            <div class="col-span-full sm:mt-7 sm:col-span-5">
                <GhostBtn size="sm" @click="clearFilters()"> Borrar filtros </GhostBtn>
            </div>
        </div>
        <VTable
            class="mt-5"
            :columns="columns"
            :pagination="pagination"
            :items="filteredNotifications"
            :actions="actions"
        >
            <template #item="{ item }">
                <!-- Desktop -->

                <td :class="item.sandProvider.name ? null : 'empty'">
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
                <span class="font-bold">Carga: </span> {{ item.sandProvider.name }}
            </template>

            <template #mobileSubtitle="{ item }">
                <span class="font-bold">Transporte: </span>{{ item.transportProvider?.name }}
            </template>
        </VTable>
        <Backdrop :open="showBD" title="Ver más" @close="toggleBD()">
            <template #body>
                <NotificationBackDropCard :info="bdInfo" />
            </template>
        </Backdrop>
        <Modal type="off" :open="showModal" @close="togglemodal">
            <template #body>
                <div class="text-center flex flex-col justify-center items-center">
                    <Icon icon="ArrowCircleUp" class="h-[60px] w-[60px] rotate-45 mb-5 text-gray-400" />
                    <span class="text-center text-base border-none text-gray-900"
                        >¡La notificación está en proceso de envío!
                    </span>
                    <span class="text-center text-sm border-none m-2">
                        En breve lo verás reflejado en la columna “Estado”
                    </span>
                </div>
            </template>
            <template #btn>
                <div class="flex justify-center">
                    <GhostBtn @click="toggleModal()">Volver </GhostBtn>
                </div>
            </template>
        </Modal>
    </Layout>
</template>

<script lang="ts">
    import { onMounted, ref, computed, defineAsyncComponent } from 'vue';
    import { useStore } from 'vuex';
    import { useTitle, useToggle } from '@vueuse/core';
    import Layout from '@/layouts/Main.vue';
    import PrimaryBtn from '@/components/ui/buttons/PrimaryBtn.vue';
    import GhostBtn from '@/components/ui/buttons/GhostBtn.vue';
    import WarningBtn from '@/components/ui/buttons/WarningBtn.vue';
    import Icon from '@/components/icon/TheAllIcon.vue';
    import FieldSelect from '@/components/ui/form/FieldSelect.vue';
    import VTable from '@/components/ui/table/VTable.vue';
    import Badge from '@/components/ui/Badge.vue';
    import axios from 'axios';

    import NotificationBackDropCard from '@/components/notifications/NotificationBackDropCard.vue';

    const Modal = defineAsyncComponent(() => import('@/components/modal/General.vue'));
    const Backdrop = defineAsyncComponent(() => import('@/components/modal/Backdrop.vue'));
    const ErrorBtn = defineAsyncComponent(() => import('@/components/ui/buttons/ErrorBtn.vue'));

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
            Backdrop,
            NotificationBackDropCard,
            WarningBtn,
        },

        setup() {
            useTitle('Notificaciones a Proveedores <> Sandflow');
            const store = useStore();
            const provNotifDB = ref([]);
            const loading = ref(false);
            const sandProviderId = ref(-1);

            const showBD = ref(false);
            const bdInfo = ref(null);
            const toggleBD = () => (showBD.value = !showBD.value);

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
                { title: 'Camiones', key: 'data.cantidadCamiones', sortable: true },
                { title: 'Estado', key: 'status' },
                { title: '', key: '' },
            ];

            const actions = [
                {
                    label: 'Ver más',
                    onlyMobile: true,
                    callback: (item) => {
                        bdInfo.value = item;
                        showBD.value = true;
                    },
                },
                {
                    label: 'Reenviar',
                    callback: () => {
                        toggleModal();
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
                console.log(provNotifDB.value);
                console.log(sandProviderId.value);

                if (sandProviderId.value > -1) {
                    return provNotifDB.value.filter((client) => {
                        console.log(client);

                        return client.sandProviderId == sandProviderId.value;
                    });
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
                if (!sandOrders || !sandOrders.length) {
                    return '';
                }
                let names = '';
                sandOrders.forEach((sand) => {
                    console.log(getSTName(sand.sandTypeId));
                    names += getSTName(sand.sandTypeId) + ' ';
                });

                return names;
            };

            onMounted(async () => {
                await getProviderNotifications();
                await getSands();
            });

            // MODALS
            const showModal = ref(false);
            const toggleModal = useToggle(showModal);

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
                toggleBD,
                showBD,
                bdInfo,
                showModal,
                toggleModal,
            };
        },
    };
</script>

<style lang="scss" scoped>
    @import '@/assets/table.scss';
</style>
