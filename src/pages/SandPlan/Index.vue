<template>
    <Layout>
        <header class="flex justify-between items-center mb-4 px-3">
            <h2 class="text-2xl font-semibold text-gray-900">Planificación de arenas</h2>
            <router-link to="/planificacion-de-arena/nueva">
                <PrimaryBtn>Nuevo</PrimaryBtn>
            </router-link>
        </header>
        <UiTable>
            <template #header>
                <tr>
                    <th scope="col">Cliente</th>
                    <th scope="col">Pozo</th>
                    <th scope="col">Etapas</th>
                    <th scope="col">Total</th>
                    <th scope="col">
                        <span class="sr-only">Acciones</span>
                    </th>
                </tr>
            </template>
            <template #body>
                <tr v-for="(sp, Key) in sandPlans" :key="Key" :class="Key % 2 === 0 ? 'even' : 'odd'" class="body-row">
                    <td>
                        {{ sp?.company?.name || '-' }}
                    </td>
                    <td>
                        {{ sp?.pit?.name || '-' }}
                    </td>
                    <td>
                        {{ sp?.stages.length || '-' }}
                    </td>
                    <td>
                        {{ sumQty(sp?.stages) || 0 }}
                    </td>
                    <td>
                        <div class="btn-panel">
                            <router-link :to="`/planificacion-de-arena/${sp.id}`" class="edit">
                                <Icon icon="PencilAlt" class="w-5 h-5" />
                                <span> Editar </span>
                            </router-link>
                            <button class="delete" @click="deleteSP(sp.id)">
                                <Icon icon="Trash" class="w-5 h-5" />
                                <span> Eliminar </span>
                            </button>
                        </div>
                    </td>
                </tr>
                <tr v-if="sandPlans.length <= 0">
                    <td colspan="5" class="emptyState">
                        <p>No hay Planificacion de Arena</p>
                    </td>
                </tr>
            </template>
        </UiTable>
    </Layout>
</template>

<script>
    import { onMounted, watch, ref } from 'vue';
    import { useStore } from 'vuex';
    import Layout from '@/layouts/Main.vue';
    import {
        TrashIcon,
        PencilAltIcon,
        InformationCircleIcon,
        ExclamationCircleIcon,
        CheckCircleIcon,
    } from '@heroicons/vue/solid';
    import PrimaryBtn from '@/components/ui/buttons/PrimaryBtn.vue';
    import UiTable from '@/components/ui/TableWrapper.vue';
    import Icon from '@/components/icon/TheAllIcon.vue';

    import { useApi } from '@/helpers/useApi';

    import { useTitle } from '@vueuse/core';

    import { useAxios } from '@vueuse/integrations/useAxios';
    import axios from 'axios';
    // import { Sand } from '@/interfaces/sandflow.Types.ts';

    const api = import.meta.env.VITE_API_URL || '/api';
    export default {
        components: {
            Layout,
            PrimaryBtn,
            UiTable,
            Icon,
        },
        setup() {
            useTitle('Planificaciones de Arena <> Sandflow');
            const instance = axios.create({
                baseURL: api,
            });

            const store = useStore();

            const sandPlans = ref([]);
            const { data: sPData } = useAxios('/sandPlan', instance);
            watch(sPData, (sPData, prevCount) => {
                if (sPData && sPData.data) {
                    sandPlans.value = sPData.data;
                    console.log('mis sps', sandPlans.value);
                    // sandPlans.value.map((sp) => {
                    //     storeToVuex(sp);
                    // });
                }
            });

            // const storeToVuex = (sandPlan) => {
            //     store.dispatch('saveSandPlan', sandPlan);
            // };

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
            const deleteSP = (id) => {
                const loading = ref(true);
                const { data } = useAxios('/sandPlan/' + id, { method: 'DELETE' }, instance);
                store.dispatch('updateSandPlan', id);
                sandPlans.value = sandPlans.value.filter((sp) => {
                    return sp.id !== id;
                });
                loading.value = false;
            };

            return {
                sandPlans,
                deleteSP,
                sumQty,
            };
        },
    };
</script>

<style lang="scss" scoped>
    @import '@/assets/table.scss';
</style>
