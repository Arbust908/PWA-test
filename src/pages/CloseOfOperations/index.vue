<template>
    <Layout>
        <ABMFormTitle title="Cierre de operaciones" />
        <FieldGroup class="pt-3 px-4 pb-4 gap-y-3">
            <FieldSelect
                v-model:data="clientId"
                class="col-span-12 md:col-span-5 xl:col-span-4"
                title="Cliente"
                field-name="client"
                placeholder="Seleccionar cliente"
                endpoint="/company"
                @change="getSandPlans"
            />
            <FieldSelect
                v-model:data="operatorId"
                class="col-span-12 md:col-span-5 xl:col-span-4"
                title="Operadora / Empresa de Servicios"
                field-name="operator"
                placeholder="Seleccionar operadora"
                endpoint="/company?isOperator=1"
                is-optional
            />
            <FieldSelect
                v-model:data="workOrderId"
                class="col-span-12 md:col-span-5 xl:col-span-4"
                title="Orden de trabajo"
                field-name="workOrder"
                placeholder="Seleccionar pozos"
                endpoint="/workOrder"
                endpoint-key="pad"
                is-optional
            />

            <section class="bg-white col-span-full shadow max-w-[100%]">
                <div class="grid grid-cols-4 text-sm rounded-t border p-3">
                    <span class="ml-4 text-left">POZO</span>
                    <span class="ml-4 text-left">ETAPAS</span>
                    <span class="ml-4 text-left">ESTADO</span>
                    <span class="ml-4 text-left">TONELADAS</span>
                </div>
                <div
                    v-if="!pits || pits.length <= 0"
                    class="rounded-b border-x border-b border-dashed w-full p-6 text-center text-gray-400 italic"
                >
                    <span>Seleccione un cliente</span>
                </div>
                <div v-else class="divide-y rounded-b border-x border-b">
                    <article
                        v-for="sandPlan in filteredSandPlans"
                        :key="sandPlan.id"
                        class="grid grid-cols-4 px-4 py-2 text-sm"
                    >
                        <div class="m-4 text-left">
                            <input
                                id="checkbox"
                                v-model="checked"
                                type="checkbox"
                                class="outline-none focus:outline-none text-green-500 rounded mr-2"
                            />
                            <span> {{ sandPlan.pit.name }} </span>
                        </div>
                        <div class="m-4 text-left">
                            <span> 1 / {{ sandPlan.stages.length }} </span>
                        </div>
                        <div class="m-4 text-left">
                            <Badge />
                            <span> {{ sandPlan.stages[0].status }} </span>
                        </div>
                        <div class="m-4 text-left">
                            <span>
                                {{
                                    sandPlan.stages[0].quantity1 +
                                    sandPlan.stages[0].quantity2 +
                                    sandPlan.stages[0].quantity3 +
                                    sandPlan.stages[0].quantity4
                                }}
                            </span>
                        </div>
                    </article>
                </div>
            </section>
        </FieldGroup>
    </Layout>
</template>

<script setup lang="ts">
    import axios from 'axios';

    import Layout from '@/layouts/Main.vue';
    import ABMFormTitle from '@/components/ui/ABMFormTitle.vue';
    import FieldGroup from '@/components/ui/form/FieldGroup.vue';
    import FieldSelect from '@/components/ui/form/FieldSelect.vue';
    import Badge from '@/components/ui/Badge.vue';

    const api = import.meta.env.VITE_API_URL || '/api';

    useTitle('Cierre de operaciones <> Sandflow');

    const clientId = ref(-1);
    const operatorId = ref(-1);
    const workOrderId = ref(-1);
    const pits = ref([]);
    const checked = ref(false);
    const sandPlans = ref([]);
    const filteredSandPlans = ref([]);

    const getSandPlans = async () => {
        if (clientId.value > 0) {
            const url = `/pit?companyId=${clientId.value}`;
            const response = await axios.get(`${api}/${url}`).catch((err) => {
                return false;
            });

            const result = await axios.get(`${api}/sandPlan`).catch((err) => {
                return false;
            });

            // console.log('pitResult', response);
            pits.value = response.data.data;
            console.log('pits', pits.value);

            // console.log('sandplanResult', result);
            sandPlans.value = result.data.data;
            console.log('sandplans', sandPlans.value);

            // setTimeout(() => {
            //     console.log('filteredSandPlans.value', filteredSandPlans.value);
            // }, 500);
            getFilteredSandPlans();
        }
    };

    const getFilteredSandPlans = () => {
        filteredSandPlans.value = sandPlans.value.filter((sandPlan) => sandPlan.company.id === clientId.value);

        console.log('filteredSandPlans', filteredSandPlans.value);
    };
</script>

<style scoped></style>
