<template>
    <Layout>
        <ABMHeader title="Centro de carga de arena" link="/proveedores-de-arena/nuevo" />
        <div class="relative grid grid-cols-12 col-span-full gap-4 mt-2">
            <FieldSelect
                title="Filtro"
                placeholder="Seleccionar centro de carga"
                class="col-span-full sm:col-span-5 md:col-span-3 lg:col-span-4 xl:col-span-3"
                field-name="name"
                endpoint-key="name"
                endpoint="/sandProvider?order=name"
                :data="sandProviderId"
                @update:data="sandProviderId = $event"
            />
        </div>

        <VTable
            class="mt-5 min-w-full lg:min-w-min"
            :columns="columns"
            :pagination="pagination"
            :items="filteredSandProviders"
            :actions="actions"
        >
            <template #item="{ item: sandProvider }">
                <!-- Desktop -->
                <td :class="sandProvider.name ? null : 'empty'">
                    {{ sandProvider?.name || '-' }}
                </td>
                <td :class="sandProvider.address ? null : 'empty'">
                    {{ sandProvider?.address || '-' }}
                </td>
                <td :class="sandProvider.meshType ? null : 'empty'">
                    <p v-for="meshType in sandProvider.meshType" :key="meshType">
                        {{ meshType?.type || '-' }}
                    </p>
                </td>
                <td :class="sandProvider.companyRepresentative ? null : 'empty'">
                    {{ sandProvider.companyRepresentative?.name || '-' }}
                </td>
                <td :class="sandProvider.companyRepresentative ? null : 'empty'">
                    {{ sandProvider.companyRepresentative?.phone || '-' }}
                </td>

                <tr v-if="sandProviders.length <= 0">
                    <td colspan="5" class="emptyState">
                        <p>No hay proveedores de arena</p>
                    </td>
                </tr>
            </template>

            <!-- Mobile -->
            <template #mobileTitle="{ item }"> {{ item.name }} </template>

            <template #mobileSubtitle="{ item }">
                <span class="font-bold">Malla: </span>
                <span v-for="(meshType, index) in item.meshType" :key="meshType">
                    {{ meshType?.type || '-' }}<span v-if="index != item.meshType.length - 1">, </span>
                </span>
            </template>
        </VTable>

        <ErrorModal
            :open="notificationModalvisible"
            :text="errorMessage"
            @close="toggleNotificationModal()"
            @main="toggleNotificationModal()"
        />
        <DisableModal
            :open="showModal"
            title="¿Desea inhabilitar este centro de carga de arena?"
            text="Una vez inhabilitado, no podrá utilizarlo en ninguna otra sección de la aplicación."
            @close="showModal = false"
            @main="confirmModal"
        />

        <Backdrop :open="showBackdrop" title="Ver más" @close="showBackdrop = false">
            <template #body>
                <p class="!text-lg !text-black">{{ selectedSandProvider.name }}</p>
                <p class="mt-2">
                    <strong>Malla: </strong>
                    <span v-for="(meshType, index) in selectedSandProvider.meshType" :key="meshType">
                        {{ meshType?.type || '-'
                        }}<span v-if="index != selectedSandProvider.meshType.length - 1">, </span>
                    </span>
                </p>
                <p class="mt-2">
                    <strong>Domicilio: </strong>
                    {{ selectedSandProvider.address }}
                </p>
                <p class="mt-2">
                    <strong>Representante: </strong>
                    {{ selectedSandProvider.companyRepresentative?.name || '-' }}
                </p>
                <p class="mt-2">
                    <strong>Teléfono: </strong>
                    {{ selectedSandProvider.companyRepresentative?.phone || '-' }}
                </p>
            </template>
        </Backdrop>
    </Layout>
</template>

<script>
    import { useStoreLogic } from '@/helpers/useStoreLogic';
    // Components
    import ABMHeader from '@/components/ui/ABMHeader.vue';
    import Backdrop from '@/components/modal/Backdrop.vue';
    import DisableModal from '@/components/modal/DisableModal.vue';
    import ErrorModal from '@/components/modal/ErrorModal.vue';
    import FieldSelect from '@/components/ui/form/FieldSelect.vue';
    import GhostBtn from '@/components/ui/buttons/GhostBtn.vue';
    import Layout from '@/layouts/Main.vue';
    import VTable from '@/components/ui/table/VTable.vue';

    export default {
        components: {
            ABMHeader,
            Backdrop,
            DisableModal,
            ErrorModal,
            FieldSelect,
            GhostBtn,
            Layout,
            VTable,
        },
        setup() {
            useTitle(`Centro de carga de Arena <> Sandflow`);
            const sandProviders = ref([]);
            const store = useStore();
            const router = useRouter();
            const loading = ref(false);
            const notificationModalvisible = ref(false);
            const toggleNotificationModal = () => (notificationModalvisible.value = !notificationModalvisible.value);
            const errorMessage = ref('');
            const sandProviderId = ref(-1);
            const selectedsandProvider = ref(null);
            const showModal = ref(false);
            const showBackdrop = ref(false);
            const selectedSandProvider = ref(null);
            const pagination = ref({
                sortKey: 'id',
                sortDir: 'asc',
            });

            const columns = [
                { title: 'Proveedor', key: 'name', sortable: true },
                { title: 'Domicilio', key: 'address', sortable: true },
                { title: 'Tipo de Malla', key: 'meshType', sortable: true },
                { title: 'Representante', key: 'companyRepresentative.name', sortable: true },
                { title: 'Teléfono', key: 'companyRepresentative.phone', sortable: true },
                { title: '', key: 'actions' },
            ];

            const actions = [
                {
                    label: 'Ver más',
                    onlyMobile: true,
                    callback: (item) => {
                        selectedSandProvider.value = item;
                        showBackdrop.value = true;
                    },
                },
                {
                    label: 'Editar',
                    callback: (item) => {
                        router.push(`/proveedores-de-arena/${item.id}`);
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

            onMounted(async () => {
                loading.value = true;
                await useStoreLogic(router, store, 'sandProvider', 'getAll').then((res) => {
                    if (res.type == 'failed') {
                        errorMessage.value = res.message;
                        toggleNotificationModal();
                    }

                    if (res.type == 'success') {
                        sandProviders.value = store.getters['getSandProviders'];
                    }
                });
                loading.value = false;
            });

            const filteredSandProviders = computed(() => {
                if (sandProviderId.value > -1) {
                    return sandProviders.value.filter((sandProvider) => sandProvider.id == sandProviderId.value);
                }

                return sandProviders.value;
            });

            const openModalVisibility = async (sandProvider) => {
                selectedsandProvider.value = sandProvider;

                if (sandProvider.visible) {
                    showModal.value = true;

                    return;
                }
                await updateVisibility(selectedsandProvider.value);
            };

            const confirmModal = async () => {
                await updateVisibility(selectedsandProvider.value);
                showModal.value = false;
            };

            const updateVisibility = async (sandProvider) => {
                const payload = {
                    ...sandProvider,
                    visible: !sandProvider.visible,
                };

                await store.dispatch('sandProvider_update', payload);
            };

            return {
                sandProviders,
                loading,
                notificationModalvisible,
                toggleNotificationModal,
                errorMessage,
                filteredSandProviders,
                sandProviderId,
                showModal,
                openModalVisibility,
                confirmModal,
                pagination,
                columns,
                actions,
                selectedSandProvider,
                showBackdrop,
            };
        },
    };
</script>

<style lang="scss" scoped>
    @import '@/assets/table.scss';
    .outline-none {
        outline: 0;
    }
</style>
