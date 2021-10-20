<template>
    <Layout>
        <header class="flex justify-start space-x-4 items-center mb-4 px-3">
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
                placeholder="Seleccionar cliente.."
                class="col-span-full sm:col-span-4"
                field-name="name"
                endpoint="/cradle"
                :data="cradleId"
                @update:data="cradleId = $event"
            />
            <div class="col-span-4 mt-7">
                <GhostBtn size="sm" @click="clearFilters()"> Borrar filtros </GhostBtn>
            </div>
        </div>
        <UiTable class="mt-5">
            <template #header>
                <tr>
                    <th scope="col">Nombre</th>
                    <th class="w-1/5" scope="col">Observaciones</th>
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
                    <td :class="cr.observations ? null : 'empty'">
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

                            <CircularBtn size="xs" :class="cr.visible ? 'bg-red-500' : 'bg-blue-500'">
                                <Icon
                                    :icon="cr.visible ? 'EyeOff' : 'Eye'"
                                    type="outlined"
                                    class="w-6 h-6 text-white"
                                    @click="update(cr)"
                                />
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
        },
        setup() {
            useTitle('Cradles <> Sandflow');
            const store = useStore();
            const crDB = ref([]);
            const cradleDB = JSON.parse(JSON.stringify(store.state.cradle.all));
            const loading = ref(false);
            let cradleId = ref(-1);

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

            const deleteFrom = async (id) => {
                const loading = ref(true);
                let cradleDB = await axios
                    .delete(`${apiUrl}/cradle/${id}`)
                    .catch((err) => {
                        console.log(err);
                    })
                    .then((res) => {
                        console.log('OK', id);

                        return {};
                    })
                    .finally(() => {
                        loading.value = false;
                        crDB.value = crDB.value.filter((st) => st.id !== id);
                    });
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
                deleteFrom,
                cradleId,
                clearFilters,
                filteredCradles,
                update,
            };
        },
    };
</script>

<style lang="scss" scoped>
    @import '@/assets/table.scss';
</style>
