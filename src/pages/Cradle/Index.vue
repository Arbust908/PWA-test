<template>
    <Layout>
        <header class="flex justify-start space-x-4 items-center mb-4">
            <h2 class="text-2xl font-semibold text-gray-900">Cradle</h2>
            <router-link to="/cradle/nuevo">
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
                placeholder="Seleccionar cradle.."
                class="col-span-full sm:col-span-5 md:col-span-3 lg:col-span-4 xl:col-span-3"
                field-name="name"
                endpoint="/cradle"
                :data="cradleId"
                @update:data="cradleId = $event"
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
                    v-for="(cr, sKey) in filteredCradles"
                    :key="cr.id"
                    :class="sKey % 2 === 0 ? 'even' : 'odd'"
                    class="body-row"
                >
                    <td :class="cr.name ? null : 'empty'">
                        {{ cr.name || 'Sin definir' }}
                    </td>
                    <td>
                        <p class="w-52 truncate">
                            {{ cr.observations || 'Sin definir' }}
                        </p>
                    </td>
                    <td>
                        <div class="btn-panel">
                            <router-link :to="`/cradle/${cr.id}`">
                                <CircularBtn size="xs" class="bg-blue-500">
                                    <Icon icon="PencilAlt" type="outlined" class="w-6 h-6 icon text-white" />
                                </CircularBtn>
                            </router-link>

                            <CircularBtn v-if="cr.visible" class="bg-red-500" size="xs" @click="update(cr)">
                                <Icon icon="EyeOff" type="outlined" class="w-6 h-6 text-white" />
                            </CircularBtn>

                            <CircularBtn v-else class="bg-blue-500" size="xs" @click="openModalVisibility(cr)">
                                <Icon icon="Eye" type="outlined" class="w-6 h-6 text-white" />
                            </CircularBtn>
                        </div>
                    </td>
                </tr>
                <tr v-if="crDB.length <= 0">
                    <td colspan="5" class="emptyState">
                        <p>No hay grúas cargadas</p>
                    </td>
                </tr>
            </template>
        </UiTable>
        <Modal title="¿Desea inhabilitar este cradle?" type="error" :open="showModal">
            <template #body>
                <div>Una vez inhabilitado, no podrá utilizar este cradle en ninguna otra sección de la aplicación</div>
                <div></div>
            </template>
            <template #btn>
                <div class="flex justify-center gap-5 btn">
                    <GhostBtn size="sm" class="outline-none" @click="showModal = false"> Volver </GhostBtn>
                    <PrimaryBtn btn="btn__warning" size="sm" @click="confirm">Inhabilitar cradle </PrimaryBtn>
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
    import UiTable from '@/components/ui/TableWrapper.vue';
    import Icon from '@/components/icon/TheAllIcon.vue';
    import FieldSelect from '@/components/ui/form/FieldSelect.vue';
    import GhostBtn from '@/components/ui/buttons/GhostBtn.vue';
    import CircularBtn from '@/components/ui/buttons/CircularBtn.vue';
    import Modal from '@/components/modal/General.vue';

    import axios from 'axios';
    const apiUrl = import.meta.env.VITE_API_URL || '/api';

    export default {
        components: {
            Layout,
            PrimaryBtn,
            Icon,
            UiTable,
            FieldSelect,
            GhostBtn,
            CircularBtn,
            Modal,
        },
        setup() {
            useTitle('Cradles <> Sandflow');
            const store = useStore();
            const crDB = ref([]);
            const loading = ref(false);
            let cradleId = ref(-1);
            const selectedCradle = ref(null);
            const showModal = ref(false);
            const tableColumns = [
                {
                    text: 'Nombre',
                    class: 'w-2/5',
                },
                {
                    text: 'Observaciones',
                    class: 'w-1/5',
                },
            ];

            const filteredCradles = computed(() => {
                if (cradleId.value > -1) {
                    return crDB.value.filter((cradle) => cradle.id == cradleId.value);
                }

                return crDB.value;
            });

            const getCradles = async () => {
                loading.value = true;

                const res = await axios.get(`${apiUrl}/cradle`).catch((err) => {
                    console.log(err);
                });

                if (res.status === 200) {
                    crDB.value = res.data.data;
                }

                store.dispatch('setCradles', crDB.value);
                loading.value = false;
            };

            const openModalVisibility = (cradle) => {
                selectedCradle.value = cradle;
                showModal.value = true;
            };

            const confirm = async () => {
                await update(selectedCradle.value);
                showModal.value = false;
            };

            const update = async (cradle) => {
                const payload = {
                    ...cradle,
                    visible: !cradle.visible,
                };
                await store.dispatch('updateVisibilityCradle', payload);
                await getCradles();
            };

            const clearFilters = () => {
                cradleId.value = -1;
            };

            onMounted(async () => {
                await getCradles();
            });

            return {
                crDB,
                cradleId,
                clearFilters,
                filteredCradles,
                update,
                showModal,
                openModalVisibility,
                confirm,
                tableColumns,
            };
        },
    };
</script>

<style lang="scss" scoped>
    @import '@/assets/table.scss';
</style>
