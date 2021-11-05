<template>
    <Layout>
        <header class="flex justify-between items-center mb-4 px-3">
            <h2 class="text-2xl font-semibold text-second-900">Ordenes de Trabajo</h2>
            <router-link to="/orden-de-trabajo/nueva">
                <PrimaryBtn>Crear nueva</PrimaryBtn>
            </router-link>
        </header>
        <UiTable>
            <template #header>
                <tr>
                    <th scope="col" title="Numero de Orden">N°</th>
                    <th scope="col">Cliente</th>
                    <th scope="col">Operadora</th>
                    <th scope="col">Pozos</th>
                    <th scope="col">
                        <span class="sr-only">Acciones</span>
                    </th>
                </tr>
            </template>
            <template #body>
                <tr
                    v-for="(wo, woKey) in workOrders"
                    :key="wo.id"
                    :class="woKey % 2 === 0 ? 'even' : 'odd'"
                    class="body-row"
                >
                    <td>
                        {{ wo.id }}
                    </td>
                    <td :class="wo.client ? null : 'empty'">{{ wo.clientName }}</td>
                    <td :class="wo.serviceCompany ? null : 'empty'">{{ wo.operatorName }}</td>
                    <td>
                        {{ listPits(wo.pits) }}
                    </td>
                    <td>
                        <div class="btn-panel">
                            <router-link :to="`/orden-de-trabajo/${wo.id}`" class="edit">
                                <Icon icon="PencilAlt" class="w-5 h-5" />
                                <span> Editar </span>
                            </router-link>
                            <button class="delete" @click="deleteWorkOrder(wo.id)">
                                <Icon icon="Trash" class="w-5 h-5" />
                                <span> Eliminar </span>
                            </button>
                        </div>
                    </td>
                </tr>
                <tr v-if="workOrders.length <= 0">
                    <td colspan="5" class="emptyState">
                        <p>No hay Ordenes de Trabajo</p>
                    </td>
                </tr>
            </template>
        </UiTable>
    </Layout>
</template>

<script lang="ts">
    import { ref, Ref, watch, defineComponent, onMounted } from 'vue';
    import { useStore } from 'vuex';
    import Layout from '@/layouts/Main.vue';
    import PrimaryBtn from '@/components/ui/buttons/PrimaryBtn.vue';
    import UiTable from '@/components/ui/TableWrapper.vue';
    import Icon from '@/components/icon/TheAllIcon.vue';
    import axios from 'axios';
    const apiUrl = import.meta.env.VITE_API_URL || '/api';

    import { useTitle } from '@vueuse/core';
    import { WorkOrder } from '@/interfaces/WorkOrder';

    export default defineComponent({
        components: {
            Layout,
            PrimaryBtn,
            UiTable,
            Icon,
        },
        setup() {
            useTitle('Ordenes de Trabajo <> Sandflow');
            const store = useStore();
            const workOrders = ref([]);
            const companies = ref([]);

            watch(workOrders, (newValue, _) => {
                if (newValue) {
                    storeToState(newValue);
                }
            });

            const listPits = (pits: Array<Pit>) => {
                if (!pits || pits.length <= 0) {
                    return '-';
                }

                return pits.reduce((list, pit) => {
                    list += list === '' ? pit.name : `, ${pit.name}`;

                    return list;
                }, '');
            };

            const storeToState = (wOs: Array<WorkOrder>) => {
                return wOs.map((wO) => {
                    store.dispatch('saveWorkOrder', wO);
                });
            };

            const deleteWorkOrder = async (woId) => {
                await axios.delete(`${apiUrl}/workOrder/${woId}`).then((res) => {
                    if (res.status == 200) {
                        store.dispatch('deleteWorkOrder', woId);
                        workOrders.value = workOrders.value.filter((woFromApi) => {
                            return woFromApi.id !== woId;
                        });
                    }
                });
            };

            const getWorkOrders = async () => {
                return await axios.get(`${apiUrl}/workOrder`).then((res) => {
                    workOrders.value = res.data.data;
                });
            };

            const getCompanies = async () => {
                return await axios.get(`${apiUrl}/company`).then((res) => {
                    companies.value = res.data.data;
                });
            };

            const idToName = (id: number) => {
                if (id == -1) {
                    return 'Sin operadora';
                }
                let company = companies.value.filter((company) => {
                    if (company.id == id) {
                        return company;
                    }
                })[0];

                return company.name;
            };

            onMounted(async () => {
                await getWorkOrders();
                await getCompanies();
                workOrders.value.forEach((workOrder) => {
                    workOrder.clientName = idToName(parseInt(workOrder.client));
                    workOrder.operatorName = idToName(parseInt(workOrder.serviceCompany));

                    return workOrder;
                });
            });

            return {
                workOrders,
                deleteWorkOrder,
                listPits,
            };
        },
    });
</script>

<style lang="scss" scoped>
    @import '@/assets/table.scss';
</style>
