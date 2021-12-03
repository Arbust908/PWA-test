<template>
    <Layout>
        <header class="flex justify-start space-x-4 items-center mb-4">
            <h2 class="text-2xl font-semibold text-gray-900">Tipos de arena</h2>
            <router-link to="/tipos-de-arena/nueva">
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
                placeholder="Seleccionar malla"
                class="col-span-full sm:col-span-5 md:col-span-3 lg:col-span-4 xl:col-span-3"
                field-name="type"
                endpoint-key="type"
                endpoint="/sand"
                :data="sandId"
                @update:data="sandId = $event"
            />
        </div>

        <VTable class="mt-5" :columns="columns" :items="filteredSands" :actions="actions">
            <template #item="{ item }">
                <!-- Desktop -->
                <td :class="item.type ? null : 'empty'">
                    {{ item.type || 'Sin definir' }}
                </td>

                <td :class="item.observations ? null : 'empty'">
                    {{ item.observations || 'Sin observaciones' }}
                </td>

                <td v-if="false">
                    <div class="btn-panel">
                        <router-link :to="`/clientes/${item.id}`">
                            <Popper hover content="Editar">
                                <CircularBtn size="xs" class="btn__delete bg-blue-500">
                                    <Icon icon="PencilAlt" type="outlined" class="w-6 h-6 icon text-white" />
                                </CircularBtn>
                            </Popper>
                        </router-link>

                        <Popper hover :content="item.visible ? 'Inhabilitar' : 'Habilitar'">
                            <CircularBtn
                                class="ml-4"
                                :class="item.visible ? 'bg-red-500' : 'bg-blue-500'"
                                size="xs"
                                @click="openModalVisibility(item)"
                            >
                                <Icon v-if="item.visible" icon="EyeOff" type="outlined" class="w-6 h-6 text-white" />
                                <Icon v-else icon="Eye" type="outlined" class="w-6 h-6 text-white" />
                            </CircularBtn>
                        </Popper>
                    </div>
                </td>
            </template>

            <!-- Mobile -->
            <template #mobileTitle="{ item }">
                {{ item.type }}
            </template>

            <template #mobileSubtitle="{ item }">
                <span class="font-bold">Observaciones: </span> {{ item.observations }}
            </template>
        </VTable>
        <Backdrop :open="showBD" title="Ver más" @close="toggleBD()">
            <template #body>
                <BackdropCard :info="bdInfo" />
            </template>
        </Backdrop>
        <Modal title="¿Desea inhabilitar este tipo de arena?" type="error" :open="showModal">
            <template #body>
                <div>
                    Una vez inhabilitado, no podrá utilizar este tipo de arena en ninguna otra sección de la aplicación
                </div>
            </template>
            <template #btn>
                <div class="flex justify-center gap-5 btn">
                    <BaseBtn class="text-gray-500" @click="showModal = false"> Volver </BaseBtn>
                    <ErrorBtn btn="btn__warning" @click="confirmModal">Inhabilitar</ErrorBtn>
                </div>
            </template>
        </Modal>
    </Layout>
</template>

<script>
    import Layout from '@/layouts/Main.vue';
    import PrimaryBtn from '@/components/ui/buttons/PrimaryBtn.vue';
    import CircularBtn from '@/components/ui/buttons/CircularBtn.vue';
    import Icon from '@/components/icon/TheAllIcon.vue';
    import FieldSelect from '@/components/ui/form/FieldSelect.vue';
    import VTable from '@/components/ui/table/VTable.vue';

    import Popper from 'vue3-popper';

    import BackdropCard from '@/components/sand/BackdropCard.vue';

    const Modal = defineAsyncComponent(() => import('@/components/modal/General.vue'));
    const Backdrop = defineAsyncComponent(() => import('@/components/modal/Backdrop.vue'));
    const ErrorBtn = defineAsyncComponent(() => import('@/components/ui/buttons/ErrorBtn.vue'));
    const BaseBtn = defineAsyncComponent(() => import('@/components/ui/buttons/BaseBtn.vue'));

    import axios from 'axios';
    const api = import.meta.env.VITE_API_URL || '/api';

    export default {
        components: {
            Backdrop,
            BackdropCard,
            BaseBtn,
            CircularBtn,
            ErrorBtn,
            FieldSelect,
            Icon,
            Layout,
            Modal,
            Popper,
            PrimaryBtn,
            VTable,
        },
        setup() {
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
            const bdInfo = ref(null);
            const toggleBD = () => (showBD.value = !showBD.value);

            const columns = [
                { title: 'Tipo de Malla', key: 'name', sortable: true },
                { title: 'Observaciones', key: 'observations', sortable: true },
                { title: '', key: 'name' },
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
                    label: 'Editar',
                    callback: (item) => {
                        router.push(`/tipos-de-arena/${item.id}`);
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

            const headers = {
                'Content-Type': 'Application/JSON',
            };

            const total = computed(() => {
                return sandId.value;
            });

            const filteredSands = computed(() => {
                if (sandId.value > -1) {
                    return stDB.value.filter((sand) => sand.id == sandId.value);
                }

                return stDB.value;
            });

            const getSands = async () => {
                loading.value = true;

                const res = await axios.get(`${api}/sand`, headers).catch((err) => {
                    console.log(err);
                });

                if (res.status === 200) {
                    stDB.value = res.data.data;
                }

                loading.value = false;
            };

            const openModalVisibility = async (sand) => {
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

            const updateVisibility = async (sand) => {
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
                            stDB.value.forEach((st, sKey) => {
                                store.dispatch('saveSand', st);
                            });
                        } else {
                            const newsDB = stDB.value.filter((stFromApi, key) => {
                                return stFromApi.id && sandDB[key] && stFromApi.id !== sandDB[key].id;
                            });
                            newsDB.forEach((st, stKey) => {
                                store.dispatch('saveSand', st);
                            });
                        }
                    }
                }
            });

            return {
                stDB,
                sandId,
                filteredSands,
                showModal,
                openModalVisibility,
                confirmModal,
                columns,
                loading,
                actions,
                toggleBD,
                showBD,
                bdInfo,
            };
        },
    };
</script>

<style lang="scss" scoped>
    @import '@/assets/table.scss';
</style>
