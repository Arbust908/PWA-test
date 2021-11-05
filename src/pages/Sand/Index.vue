<template>
    <Layout>
        <header class="flex justify-start space-x-4 items-center mb-4">
            <h2 class="text-2xl font-semibold text-gray-900">Tipos de arena</h2>
            <router-link to="/tipos-de-arena/nueva">
                <PrimaryBtn size="sm"
                    >Crear
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
            <div class="col-span-4 mt-7">
                <GhostBtn size="sm" @click="clearFilters()"> Borrar filtros </GhostBtn>
            </div>
        </div>
        <UiTable class="mt-5 lg:w-7/12 min-w-min">
            <template #header>
                <tr>
                    <th v-for="column in tableColumns" :key="column.name" :class="column.class" scope="col">
                        <div class="flex justify-center">
                            {{ column.text }}
                            <Icon icon="ArrowUp" class="w-4 h-4" />
                            <Icon icon="ArrowDown" class="w-4 h-4" />
                        </div>
                    </th>
                    <th scope="col">Acciones</th>
                </tr>
            </template>
            <template #body>
                <tr
                    v-for="(st, sKey) in filteredSands"
                    :key="st.id"
                    :class="sKey % 2 === 0 ? 'even' : 'odd'"
                    class="body-row"
                >
                    <td :class="st.type ? null : 'empty'">
                        {{ st.type || 'Sin definir' }}
                    </td>
                    <td :class="st.observations ? null : 'empty'">
                        <p class="w-52 truncate">
                            {{ st.observations || 'Sin definir' }}
                        </p>
                    </td>
                    <td>
                        <div class="btn-panel">
                            <router-link :to="`/tipos-de-arena/${st.id}`">
                                <Popper hover content="Editar">
                                    <CircularBtn size="xs" class="bg-blue-500">
                                        <Icon icon="PencilAlt" type="outlined" class="w-5 h-5 icon text-white" />
                                    </CircularBtn>
                                </Popper>
                            </router-link>

                            <Popper hover :content="st.visible ? 'Inhabilitar' : 'Habilitar'">
                                <CircularBtn
                                    class="ml-4"
                                    :class="st.visible ? 'bg-red-500' : 'bg-blue-500'"
                                    size="xs"
                                    @click="openModalVisibility(st)"
                                >
                                    <Icon v-if="st.visible" icon="EyeOff" type="outlined" class="w-6 h-6 text-white" />
                                    <Icon v-else icon="Eye" type="outlined" class="w-6 h-6 text-white" />
                                </CircularBtn>
                            </Popper>
                        </div>
                    </td>
                </tr>
                <tr v-if="stDB.length <= 0">
                    <td colspan="5" class="emptyState">
                        <p>No hay arenas cargadas</p>
                    </td>
                </tr>
            </template>
        </UiTable>

        <Modal title="¿Desea inhabilitar este tipo de arena?" type="error" :open="showModal">
            <template #body>
                <div>
                    Una vez inhabilitado, no podrá utilizar este tipo de arena en ninguna otra sección de la aplicación
                </div>
                <div></div>
            </template>
            <template #btn>
                <div class="flex justify-center gap-5 btn">
                    <GhostBtn class="outline-none" @click="showModal = false"> Volver </GhostBtn>
                    <PrimaryBtn btn="btn__warning" @click="confirmModal">Inhabilitar tipo de arena</PrimaryBtn>
                </div>
            </template>
        </Modal>
    </Layout>
</template>

<script>
    import { onMounted, ref, computed } from 'vue';
    import { useStore } from 'vuex';
    import { useTitle } from '@vueuse/core';
    import Layout from '@/layouts/Main.vue';
    import PrimaryBtn from '@/components/ui/buttons/PrimaryBtn.vue';
    import CircularBtn from '@/components/ui/buttons/CircularBtn.vue';
    import GhostBtn from '@/components/ui/buttons/GhostBtn.vue';
    import UiTable from '@/components/ui/TableWrapper.vue';
    import Icon from '@/components/icon/TheAllIcon.vue';
    import FieldSelect from '@/components/ui/form/FieldSelect.vue';
    import Modal from '@/components/modal/General.vue';

    import Popper from 'vue3-popper';

    import axios from 'axios';
    const api = import.meta.env.VITE_API_URL || '/api';

    export default {
        components: {
            Layout,
            PrimaryBtn,
            UiTable,
            Icon,
            GhostBtn,
            FieldSelect,
            CircularBtn,
            Modal,
            Popper,
        },
        setup() {
            useTitle('Tipos de Arena <> Sandflow');
            const store = useStore();
            const stDB = ref([]);
            const sandDB = JSON.parse(JSON.stringify(store.state.sand.all));
            const sandId = ref(-1);
            const loading = ref(true);
            const selectedSand = ref(null);
            const showModal = ref(false);

            const tableColumns = [
                {
                    text: 'Tipo de Malla',
                    class: 'w-2/5',
                },
                {
                    text: 'Observaciones',
                    class: 'w-1/5',
                },
            ];

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

            const filteredSands = computed(() => {
                if (sandId.value > -1) {
                    return stDB.value.filter((sand) => sand.id == sandId.value);
                }

                return stDB.value;
            });

            const clearFilters = () => {
                sandId.value = -1;
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

            return {
                stDB,
                sandId,
                filteredSands,
                clearFilters,
                showModal,
                openModalVisibility,
                confirmModal,
                tableColumns,
            };
        },
    };
</script>

<style lang="scss" scoped>
    @import '@/assets/table.scss';
</style>
