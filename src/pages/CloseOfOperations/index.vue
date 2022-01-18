<template>
    <Layout>
        <ABMFormTitle title="Cierre de operaciónes" />
        <FieldGroup class="pt-3 px-4 pb-4 gap-y-3">
            <FieldSelect
                v-model:data="clientId"
                class="col-span-12 md:col-span-5 xl:col-span-4"
                title="Cliente"
                field-name="client"
                placeholder="Seleccionar cliente"
                :endpoint-data="companiesFiltered"
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

            <section class="bg-white col-span-full shadow">
                <div class="grid grid-cols-4 text-sm rounded-t border p-3">
                    <span class="ml-12">POZO</span>
                    <span class="ml-12">ETAPAS</span>
                    <span class="ml-12">ESTADO</span>
                    <span class="ml-12">TONELADAS</span>
                </div>
                <div
                    v-if="!pits || pits.length <= 0"
                    class="rounded-b border-x border-b border-dashed w-full p-6 text-center text-gray-400 italic"
                >
                    <span>Seleccione un cliente</span>
                </div>
                <div v-else class="divide-y rounded-b border-x border-b">
                    <article v-for="pit in pits" :key="pit.id" class="grid grid-cols-4 px-4 py-2 text-sm">
                        <div class="m-4 ml-10">
                            <input
                                id="checkbox"
                                v-model="checked"
                                type="checkbox"
                                class="outline-none focus:outline-none text-green-500 rounded mr-2"
                            />
                            <span> {{ pit.name }} </span>
                        </div>
                        <!-- <div v-for="(value, key) in pit" :key="key">{{ key }}: {{ value }}</div> -->
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

    const api = import.meta.env.VITE_API_URL || '/api';

    useTitle('Cierre de operaciónes <> Sandflow');

    const clientId = ref(-1);
    const operatorId = ref(-1);
    const workOrderId = ref(-1);
    const pits = ref([]);
    const checked = ref(false);
    const sandPlans = ref([]);
    const companiesFiltered = ref([]);

    // const getPits = async () => {
    //     if (clientId.value > 0) {
    //         const url = `/pit?companyId=${clientId.value}`;
    //         const response = await axios.get(`${api}/${url}`).catch((err) => {
    //             return false;
    //         });
    //         console.log(response);
    //         pits.value = response.data.data;
    //         console.log(pits.value);
    //     }
    // };

    onMounted(async () => {
        const response = await axios.get(`${api}/sandPlan`).catch((err) => {
            return false;
        });
        console.log(response);

        sandPlans.value = response.data.data;
        console.log(sandPlans.value);
        getCompanies();
    });

    const getCompanies = () => {
        sandPlans.value.forEach((sandPlan) => console.log(sandPlan));
    };
</script>

<style scoped></style>
