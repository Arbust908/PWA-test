<template>
    <Layout>
        <ABMHeader title="Tipos de arena" link="/tipos-de-arena/nueva" />
        <div class="relative grid grid-cols-12 col-span-full gap-4 mt-2">
            <FieldSelect
                title="Filtro"
                placeholder="Seleccionar malla"
                class="col-span-full sm:col-span-5 md:col-span-3 lg:col-span-4 xl:col-span-3"
                field-name="type"
                endpoint-key="type"
                endpoint="/sand"
                :data="sandId"
                @update:data="sandId = $event"
            />
        </div>

        <VTable
            class="mt-5 min-w-full sm:min-w-min"
            :columns="columns"
            :items="filteredSands"
            :actions="actions"
            :pagination="pagination"
        >
            <template #item="{ item }">
                <!-- Desktop -->
                <td :class="item.type ? null : 'empty'">
                    <div :class="`m-auto w-5 h-5 rounded-full mesh-type__${item.id} boxCard`"></div>
                </td>
                <td :class="item.type ? null : 'empty'">
                    {{ item.type || 'Sin definir' }}
                </td>

                <td :class="item.observations ? null : 'empty'">
                    {{ item.observations || 'Sin observaciones' }}
                </td>
            </template>

            <!-- Mobile -->
            <template #mobileTitle="{ item }">
                <div class="flex items-center">
                    <div
                        :class="`mr-2 w-5 h-5 rounded-full mesh-type__${item.id} boxCard inline-block relative top-2`"
                    />
                    {{ item.type }}
                </div>
            </template>

            <template #mobileSubtitle="{ item }">
                <span class="font-bold ml-7">Observaciones: </span> {{ item.observations }}
            </template>
        </VTable>

        <DisableModal
            :open="showModal"
            title="¿Desea inhabilitar este tipo de arena?"
            text="Una vez inhabilitado, no podrá utilizar este tipo de arena en ninguna otra sección de la aplicación"
            @close="showModal = false"
            @main="confirmModal"
        />

        <Backdrop :open="showBD" title="Ver más" @close="toggleBD()">
            <template #body>
                <BackdropCard :info="bdInfo" />
            </template>
        </Backdrop>
    </Layout>
</template>

<script setup lang="ts">
    import Layout from '@/layouts/Main.vue';
    import FieldSelect from '@/components/ui/form/FieldSelect.vue';
    import VTable from '@/components/ui/table/VTable.vue';
    import ABMHeader from '@/components/ui/ABMHeader.vue';
    import { Sand } from '@/interfaces/sandflow';

    const DisableModal = defineAsyncComponent(() => import('@/components/modal/DisableModal.vue'));
    const Backdrop = defineAsyncComponent(() => import('@/components/modal/Backdrop.vue'));
    const BackdropCard = defineAsyncComponent(() => import('@/components/sand/BackdropCard.vue'));

    import axios from 'axios';
    const api = import.meta.env.VITE_API_URL || '/api';

    useTitle('Tipos de Arena <> Sandflow');
    const store = useStore();
    const stDB = ref([]);
    const loading = ref(false);
    const sandDB = JSON.parse(JSON.stringify(store.state.sand.all));
    const sandId = ref(-1);
    const selectedSand = ref(null);
    const showModal = ref(false);
    const router = useRouter();

    const showBD = ref(false);
    const bdInfo = ref(null as Sand | null);
    const toggleBD = () => (showBD.value = !showBD.value);

    const pagination = ref({
        sortKey: 'id',
        sortDir: 'asc',
    });

    const columns = [
        { title: 'Color', key: 'id', sortable: true },
        { title: 'Tipo de Malla', key: 'type', sortable: true },
        { title: 'Observaciones', key: 'observations', sortable: true },
        { title: '', key: 'actions' },
    ];

    const actions = [
        {
            label: 'Ver más',
            onlyMobile: true,
            callback: (item: Sand) => {
                bdInfo.value = item;
                showBD.value = true;
            },
        },
        {
            label: 'Editar',
            callback: (item: Sand) => {
                router.push(`/tipos-de-arena/${item.id}`);
            },
        },
        {
            label: 'Inhabilitar',
            hide: (item: Sand) => {
                return item.visible;
            },
            callback: (item: Sand) => {
                openModalVisibility(item);
            },
        },
        {
            label: 'Habilitar',
            hide: (item: Sand) => {
                return !item.visible;
            },
            callback: (item: Sand) => {
                openModalVisibility(item);
            },
        },
    ];

    const total = computed(() => {
        return sandId.value;
    });

    const filteredSands = computed(() => {
        if (sandId.value > -1) {
            return stDB.value.filter((sand: Sand) => sand.id == sandId.value);
        }

        return stDB.value;
    });

    const getSands = async () => {
        loading.value = true;

        const res = await axios.get(`${api}/sand`).catch((err) => {
            console.log(err);
        });

        if (res.status === 200) {
            stDB.value = res.data.data;
        }

        loading.value = false;
    };

    const openModalVisibility = async (sand: Sand) => {
        selectedSand.value = sand;

        if (sand.visible) {
            showModal.value = true;

            return;
        }
        await updateVisibility(selectedSand.value);
    };

    const confirmModal = async () => {
        await updateVisibility(selectedSand.value);
        showModal.value = false;
    };

    const updateVisibility = async (sand: Sand) => {
        const payload = {
            ...sand,
            visible: !sand.visible,
        };
        await store.dispatch('updateVisibilitySand', payload);
        await getSands();
    };

    onMounted(async () => {
        await getSands();

        if (stDB.value && stDB.value.length > 0) {
            if (stDB.value.length > sandDB.length) {
                if (sandDB.length === 0) {
                    stDB.value.forEach((st) => {
                        store.dispatch('saveSand', st);
                    });
                } else {
                    const newsDB = stDB.value.filter((stFromApi: Sand, key) => {
                        return stFromApi.id && sandDB[key] && stFromApi.id !== sandDB[key].id;
                    });
                    newsDB.forEach((st) => {
                        store.dispatch('saveSand', st);
                    });
                }
            }
        }
    });
</script>

<style lang="scss" scoped>
    @import '@/assets/table.scss';
    @import '@/assets/box.scss';
</style>
