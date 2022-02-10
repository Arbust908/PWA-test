<template>
    <Layout>
        <ABMHeader title="Forklift" link="/forklift/nuevo" />
        <div class="relative grid grid-cols-12 col-span-full gap-4 mt-2">
            <FieldSelect
                title="Filtro"
                class="col-span-full sm:col-span-5 md:col-span-3 lg:col-span-4 xl:col-span-3"
                field-name="name"
                placeholder="Seleccionar forklift"
                endpoint="/forklift"
                :data="forkliftId"
                @update:data="forkliftId = $event"
            />
        </div>

        <VTable
            class="mt-5 min-w-full lg:min-w-min"
            :columns="columns"
            :pagination="pagination"
            :items="filteredForklifts"
            :actions="actions"
        >
            <template #item="{ item }" class="asddaads">
                <!-- Desktop -->
                <td :class="[item.name ? null : 'empty', item.visible ? null : 'notallowed']">
                    {{ item.name || 'Sin nombre' }}
                </td>

                <td :class="[item.observations ? null : 'empty', item.visible ? null : 'notallowed observations']">
                    {{ item.observations || 'Sin observaciones' }}
                </td>

                <tr v-if="fDB && fDB.length <= 0">
                    <td colspan="5" class="emptyState">
                        <p>No hay forklifts cargados</p>
                    </td>
                </tr>
            </template>

            <!-- Mobile -->
            <template #mobileTitle="{ item }">
                {{ item.name }}
            </template>

            <template #mobileSubtitle="{ item }">
                <div v-if="item.observations">
                    <span class="font-bold">Observaciones: </span>{{ item.observations }}
                </div>
                <div v-else>Sin observaciones</div>
            </template>
        </VTable>

        <DisableModal
            :open="showModal"
            title="¿Desea inhabilitar este forklift?"
            text="Una vez inhabilitado, no podrá utilizarlo en ninguna otra sección de la aplicación"
            @close="showModal = false"
            @main="confirmModal"
        />

        <Backdrop :open="showBackdrop" title="Ver más" @close="showBackdrop = false">
            <template #body>
                <p class="!text-lg !text-black">{{ selectedForklift.name }}</p>
                <p class="mt-2">
                    <strong>Observaciones: </strong>
                    {{ selectedForklift.observations !== '' ? selectedForklift.observations : ' -' }}
                </p>
            </template>
        </Backdrop>
    </Layout>
</template>

<script lang="ts">
    import { useStoreLogic } from '@/helpers/useStoreLogic';
    import { useRouter } from 'vue-router';

    import ABMHeader from '@/components/ui/ABMHeader.vue';
    import Backdrop from '@/components/modal/Backdrop.vue';
    import DisableModal from '@/components/modal/DisableModal.vue';
    import FieldSelect from '@/components/ui/form/FieldSelect.vue';
    import GhostBtn from '@/components/ui/buttons/GhostBtn.vue';
    import Layout from '@/layouts/Main.vue';
    import VTable from '@/components/ui/table/VTable.vue';

    export default {
        components: {
            ABMHeader,
            Backdrop,
            DisableModal,
            FieldSelect,
            GhostBtn,
            Layout,
            VTable,
        },
        setup() {
            useTitle('Forklifts <> Sandflow');
            const fDB = ref([]);
            const store = useStore();
            const router = useRouter();
            const loading = ref(false);
            const notificationModalvisible = ref(false);
            const toggleNotificationModal = () => (notificationModalvisible.value = !notificationModalvisible.value);
            const errorMessage = ref('');
            const forkliftId = ref(-1);
            const selectedForklift = ref(null);
            const showModal = ref(false);
            const showBackdrop = ref(false);

            const pagination = ref({
                sortKey: 'id',
                sortDir: 'asc',
                // currentPage: 1,
                // perPage: 10,
            });

            const columns = [
                { title: 'Nombre', key: 'name', sortable: true },
                { title: 'Observaciones', key: 'observations', sortable: false },
                { title: '', style: 'actions' },
            ];

            const actions = [
                {
                    label: 'Ver más',
                    onlyMobile: true,
                    callback: (item) => {
                        selectedForklift.value = item;
                        showBackdrop.value = true;
                    },
                },
                {
                    label: 'Editar',
                    callback: (item) => {
                        router.push(`/forklift/${item.id}`);
                    },
                },
                {
                    label: 'Inhabilitar',
                    hide: (item) => {
                        return item.visible;
                    },
                    callback: (item) => {
                        openModalVisibility(item);
                    },
                },
                {
                    label: 'Habilitar',
                    hide: (item) => {
                        return !item.visible;
                    },
                    callback: (item) => {
                        openModalVisibility(item);
                    },
                },
            ];

            const filteredForklifts = computed(() => {
                if (forkliftId.value > -1) {
                    return fDB.value.filter((forklift) => forklift.id == forkliftId.value);
                }

                return fDB.value;
            });

            const clearFilters = () => {
                forkliftId.value = -1;
            };

            const openModalVisibility = async (forklift) => {
                selectedForklift.value = forklift;

                if (forklift.visible) {
                    showModal.value = true;

                    return;
                }
                await updateVisibility(selectedForklift.value);
            };

            const confirmModal = async () => {
                await updateVisibility(selectedForklift.value);
                showModal.value = false;
            };

            const updateVisibility = async (forklift) => {
                const payload = {
                    name: forklift.name,
                    id: forklift.id,
                    visible: !forklift.visible,
                };
                await store.dispatch('forklift_update', payload);
                await getForklifts();
            };

            const getForklifts = async () => {
                await useStoreLogic(router, store, 'forklift', 'getAll').then((res) => {
                    if (res.type == 'failed') {
                        errorMessage.value = res.message;
                        toggleNotificationModal();
                    }

                    if (res.type == 'success') {
                        fDB.value = res.res;
                    }
                });
            };

            onMounted(async () => {
                loading.value = true;
                await getForklifts();
                loading.value = false;
            });

            return {
                actions,
                clearFilters,
                columns,
                confirmModal,
                errorMessage,
                fDB,
                filteredForklifts,
                forkliftId,
                loading,
                notificationModalvisible,
                openModalVisibility,
                pagination,
                selectedForklift,
                showBackdrop,
                showModal,
                toggleNotificationModal,
            };
        },
    };
</script>

<style lang="scss" scoped>
    @import '@/assets/table.scss';
    .closeButton {
        @apply inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-200 sm:bg-transparent text-base font-medium text-second-400 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:text-sm mt-3;
    }

    .outline-none {
        outline: 0;
    }
</style>
