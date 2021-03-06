<template>
    <Layout>
        <ABMHeader title="Notificaciones a proveedores" link="/notificaciones-a-proveedores/nueva" />
        <div class="relative grid grid-cols-12 col-span-full gap-4 mt-2">
            <FieldSelect
                v-model:data="sandProviderId"
                title="Filtro"
                class="col-span-full sm:col-span-5 md:col-span-3 lg:col-span-4 xl:col-span-3"
                placeholder="Seleccionar cliente"
                field-name="name"
                endpoint="/sandProvider"
            />
        </div>
        <VTable
            class="mt-5 min-w-full lg:min-w-min"
            :columns="columns"
            :pagination="pagination"
            :items="filteredNotifications"
            :actions="actions"
            disable-key="id"
        >
            <template #item="{ item }">
                <td :class="item?.sandProvider?.name ? null : 'empty'">
                    {{ item?.sandProvider?.name || 'Sin definir' }}
                </td>
                <td :class="item?.data?.sandOrders ? null : 'empty'">
                    {{ listSandTypes(item.data?.sandOrders) || 'Sin definir' }}
                </td>

                <td :class="item?.transportProvider ? null : 'empty'">
                    {{ item?.transportProvider?.name || 'Sin definir' }}
                </td>

                <td :class="item?.data?.cantidadCamiones ? null : 'empty'">
                    {{ item?.data?.cantidadCamiones || 'Sin definir' }}
                </td>

                <td class="text-center" :class="item ? null : 'empty'">
                    <Badge
                        class="text-white px-5 w-full inline-block"
                        :class="getNotificationInfo(item).color"
                        :text="getNotificationInfo(item).text"
                    />
                </td>
            </template>

            <template #mobileTitle="{ item }">
                <span class="font-bold">Carga: </span> {{ item?.sandProvider?.name }}
            </template>

            <template #mobileSubtitle="{ item }">
                <span class="font-bold">Transporte: </span>{{ item?.transportProvider?.name }}
            </template>
        </VTable>
        <Backdrop :open="showBD" title="Ver más" @close="toggleBD()">
            <template #body>
                <NotificationBackDropCard :info="bdInfo" />
            </template>
        </Backdrop>
        <Modal type="off" :open="showModal" @close="showModal = !showModal">
            <template #body>
                <div class="text-center flex flex-col justify-center items-center">
                    <Icon icon="ArrowCircleUp" class="h-[60px] w-[60px] rotate-45 mb-5 text-gray-400" />
                    <span class="text-center text-base border-none text-gray-900">
                        ¡La notificación está en proceso de envío!
                    </span>
                    <span class="text-center text-sm border-none m-2">
                        En breve lo verás reflejado en la columna “Estado”
                    </span>
                </div>
            </template>
            <template #btn>
                <div class="flex justify-center">
                    <BaseBtn class="text-gray-500 cursor-pointer" @click="toggleModal()">Volver </BaseBtn>
                </div>
            </template>
        </Modal>
    </Layout>
</template>

<script setup lang="ts">
    import Layout from '@/layouts/Main.vue';
    import Icon from '@/components/icon/TheAllIcon.vue';
    import FieldSelect from '@/components/ui/form/FieldSelect.vue';
    import VTable from '@/components/ui/table/VTable.vue';
    import Badge from '@/components/ui/Badge.vue';
    import axios from 'axios';

    import NotificationBackDropCard from '@/components/notifications/NotificationBackDropCard.vue';
    import ABMHeader from '@/components/ui/ABMHeader.vue';
    import { useModalState } from '@/store/modals.pinia';

    const api = import.meta.env.VITE_API_URL || '/api';
    const store = useModalState();
    const { openModal } = store;

    const Modal = defineAsyncComponent(() => import('@/components/modal/General.vue'));
    const Backdrop = defineAsyncComponent(() => import('@/components/modal/Backdrop.vue'));
    const BaseBtn = defineAsyncComponent(() => import('@/components/ui/buttons/BaseBtn.vue'));

    const apiUrl = import.meta.env.VITE_API_URL || '/api';

    useTitle('Notificaciones a Proveedores <> Sandflow');
    const provNotifDB = ref([]);
    const loading = ref(false);
    const sandProviderId = ref(-1);

    const showBD = ref(false);
    const bdInfo = ref(null);
    const toggleBD = () => (showBD.value = !showBD.value);

    const pagination = ref({
        sortKey: 'id',
        sortDir: 'asc',
    });

    const columns = [
        { title: 'Crto. de Carga', key: 'sandProvider.name', sortable: true },
        { title: 'Arena', key: 'sandProvider.meshType.type', sortable: true },
        { title: 'Transporte', key: 'transportProvider.name', sortable: true },
        { title: 'Camiones', key: 'data.cantidadCamiones', sortable: true },
        { title: 'Estado', key: 'status' },
        { title: '', key: 'actions' },
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
            callback: async (item) => {
                // toggleModal();
                const result = await axios.post(`${api}/providerNotification/${item.id}/resend`).catch((err) => {
                    console.error(err);
                    openModal('error', 'Error', 'Hubo un error al reenviar la notificacions');
                });

                if (result?.status === 200) {
                    openModal('success', 'Notificacion Reenviada', 'La notificacion fue reenviada con exito!');
                }
            },
        },
    ];

    const filteredNotifications = computed(() => {
        if (sandProviderId.value > -1) {
            return provNotifDB.value.filter((client) => {
                return client.sandProviderId == sandProviderId.value;
            });
        }

        return provNotifDB.value;
    });
    const getProviderNotifications = async () => {
        loading.value = true;

        const res = await axios.get(`${apiUrl}/providerNotification`).catch((err) => {
            console.error(err);
        });

        if (res.status === 200) {
            provNotifDB.value = res.data.data;
        }

        loading.value = false;
    };

    const sandTypesFromId = ref([]);

    const getSands = async () => {
        const res = await axios.get(`${apiUrl}/sand`).catch((err) => {
            console.error(err);
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

    const STATUS_NOTIFICATION_PENDING = 0;
    const STATUS_NOTIFICATION_DELIVERED = 1;
    const STATUS_NOTIFICATION_FAILED = 2;

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
</script>

<style lang="scss" scoped>
    @import '@/assets/table.scss';
</style>
