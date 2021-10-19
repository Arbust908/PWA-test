<template>
    <Layout>
        <header class="flex justify-between items-center mb-4 px-3">
            <h2 class="text-2xl font-semibold text-gray-900">Tipos de Arena</h2>
            <router-link to="/tipos-de-arena/nueva">
                <PrimaryBtn>Nuevo</PrimaryBtn>
            </router-link>
        </header>
        <UiTable>
            <template #header>
                <tr>
                    <th scope="col">Tipo de malla</th>
                    <th scope="col">Observaciones</th>
                    <th scope="col" colspan="2">
                        <span class="sr-only">Acciones</span>
                    </th>
                </tr>
            </template>
            <template #body>
                <tr v-for="(st, sKey) in stDB" :key="st.id" :class="sKey % 2 === 0 ? 'even' : 'odd'" class="body-row">
                    <td :class="st.type ? null : 'empty'">
                        {{ st.type || 'Sin definir' }}
                    </td>
                    <td :class="st.observations ? null : 'empty'">
                        {{ st.observations || 'Sin definir' }}
                    </td>
                    <td>
                        <div class="btn-panel">
                            <router-link :to="`/tipos-de-arena/${st.id}`" class="edit">
                                <Icon icon="PencilAlt" class="w-5 h-5" />
                                <span> Editar </span>
                            </router-link>
                            <button class="delete" @click="deleteFrom(st.id)">
                                <Icon icon="Trash" class="w-5 h-5" />
                                <span> Eliminar </span>
                            </button>
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
    </Layout>
</template>

<script>
    import { onMounted, ref } from 'vue';
    import { useStore } from 'vuex';
    import { useTitle } from '@vueuse/core';
    import Layout from '@/layouts/Main.vue';
    import PrimaryBtn from '@/components/ui/buttons/PrimaryBtn.vue';
    import UiTable from '@/components/ui/TableWrapper.vue';
    import Icon from '@/components/icon/TheAllIcon.vue';

    import axios from 'axios';
    const api = import.meta.env.VITE_API_URL || '/api';

    export default {
        components: {
            Layout,
            PrimaryBtn,
            UiTable,
            Icon,
        },
        setup() {
            useTitle('Tipos de Arena <> Sandflow');
            const store = useStore();
            const stDB = ref([]);
            const sandDB = JSON.parse(JSON.stringify(store.state.sand.all));

            onMounted(async () => {
                const loading = ref(true);
                stDB.value = await axios
                    .get(`${api}/sand`)
                    .catch((err) => {
                        console.log(err);
                    })
                    .then((res) => {
                        if (res.status === 200) {
                            // console.log('data', res.data.data)
                            return res.data.data;
                        }

                        return [];
                    })
                    .finally(() => {
                        loading.value = false;
                    });

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

            const deleteFrom = async (id) => {
                const loading = ref(true);
                let sandDB = await axios
                    .delete(`${api}/sand/${id}`)
                    .catch((err) => {
                        console.log(err);
                    })
                    .then((res) => {
                        if (res.status === 200) {
                            console.log('OK', id);

                            return res.data;
                        }

                        return {};
                    })
                    .finally(() => {
                        loading.value = false;
                        stDB.value = stDB.value.filter((st) => st.id !== id);
                    });
            };

            return {
                stDB,
                deleteFrom,
            };
        },
    };
</script>

<style lang="scss" scoped>
    @import '@/assets/table.scss';
</style>
