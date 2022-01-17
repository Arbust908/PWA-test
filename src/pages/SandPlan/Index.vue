<template>
    <Layout>
        <ABMHeader title="Planificación de arena" link="/planificacion-de-arena/nueva" />
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
        </div>

        <VTable
            class="mt-5 min-w-full lg:min-w-min"
            :columns="columns"
            :pagination="pagination"
            :items="filteredSandPlans"
            :actions="actions"
            empty-text="No hay proveedores de arena"
        >
            <template #item="{ item: sp }">
                <!-- Desktop -->
                <td>
                    {{ sp?.company?.name || '-' }}
                </td>
                <td>
                    {{ sp?.pit?.name || '-' }}
                </td>
                <td>
                    {{ sp?.totalStages }}
                </td>
                <td>{{ sp?.totalSands }} toneladas</td>
            </template>

            <!-- Mobile -->
            <template #mobileTitle="{ item }"> {{ item.company?.name }} </template>

            <template #mobileSubtitle="{ item }">
                <span class="font-bold">Pozo: {{ item.pit?.name }} </span>
            </template>
        </VTable>

        <DisableModal
            :open="showModal"
            title="¿Desea inhabilitar esta planificación de arenas?"
            text="Una vez inhabilitado, no podrá utilizarlo en ninguna otra sección de la aplicación"
            @close="showModal = false"
            @main="confirmModal"
        />

        <Backdrop :open="showBackdrop" title="Ver más" @close="showBackdrop = false">
            <template #body>
                <p class="!text-lg !text-black">{{ selectedSandPlan.company?.name }}</p>
                <p class="mt-2">
                    <strong>Pozo: </strong>
                    {{ selectedSandPlan.pit?.name }}
                </p>
                <p class="mt-2">
                    <strong>Total Etapas: </strong>
                    {{ selectedSandPlan.totalStages }}
                </p>
                <p class="mt-2">
                    <strong>Total Arenas: </strong>
                    {{ selectedSandPlan.totalSands }} toneladas
                </p>
            </template>
        </Backdrop>
    </Layout>
</template>

<script>
    import { useStoreLogic } from '@/helpers/useStoreLogic';

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
            useTitle('Planificaciones de Arena <> Sandflow');

            const clientId = ref(-1);
            const selectedSandPlan = ref(null);
            const showBackdrop = ref(false);
            const showModal = ref(false);

            const store = useStore();
            const router = useRouter();

            const sandPlans = ref([]);

            const pagination = ref({
                sortKey: 'id',
                sortDir: 'asc',
                // currentPage: 1,
                // perPage: 10,
            });

            const columns = [
                { title: 'Cliente', key: 'company.name', sortable: true },
                { title: 'Pozo', key: 'pit.name', sortable: true },
                { title: 'Total Etapas', key: 'totalStages', sortable: true },
                { title: 'Total Arenas', key: 'totalSands', sortable: true },
                { title: '', key: 'actions' },
            ];

            const actions = [
                {
                    label: 'Ver más',
                    onlyMobile: true,
                    callback: (item) => {
                        selectedSandPlan.value = item;
                        showBackdrop.value = true;
                    },
                },
                {
                    label: 'Editar',
                    callback: (item) => {
                        router.push(`/planificacion-de-arena/${item.id}`);
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

            const getSandPlans = async () => {
                const result = await useStoreLogic(router, store, 'sandPlan', 'getAll');

                if (result.type == 'success') {
                    sandPlans.value = result.res.map((sp) => ({
                        ...sp,
                        totalStages: sp.stages.length,
                        totalSands: sumQty(sp.stages),
                    }));
                }
            };

            const filteredSandPlans = computed(() => {
                if (clientId.value > -1) {
                    return sandPlans.value.filter((sandProvider) => sandProvider.companyId == clientId.value);
                }

                return sandPlans.value;
            });

            const openModalVisibility = async (sp) => {
                selectedSandPlan.value = sp;

                if (sp.visible) {
                    showModal.value = true;

                    return;
                }
                await update(selectedSandPlan.value);
            };

            const confirmModal = async () => {
                await update(selectedSandPlan.value);
                showModal.value = false;
            };

            const update = async (sandPlan) => {
                const payload = {
                    ...sandPlan,
                    visible: !sandPlan.visible,
                };
                await store.dispatch('sandPlan_update', payload);
                sandPlan.visible = payload.visible;
            };

            const sumQty = (sandStages) => {
                let total = 0;
                sandStages.forEach((sandStage) => {
                    Object.entries(sandStage).filter((each) => {
                        if (each[0].startsWith('quantity')) {
                            total = total + each[1];
                        }
                    });
                });

                return total;
            };

            onMounted(() => {
                getSandPlans();
            });

            return {
                sandPlans,
                sumQty,
                clientId,
                selectedSandPlan,
                filteredSandPlans,
                getSandPlans,
                pagination,
                columns,
                actions,
                showBackdrop,
                showModal,
                openModalVisibility,
                confirmModal,
            };
        },
    };
</script>

<style lang="scss" scoped>
    @import '@/assets/table.scss';
</style>
