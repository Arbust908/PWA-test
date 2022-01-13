<template>
    <Layout>
        <ABMFormTitle title="Cierre de operaciónes" />
        <FieldGroup class="bg-white rounded-lg shadow pt-3 px-4 pb-4 gap-y-3">
            <FieldSelect
                v-model:data="clientId"
                class="col-span-12 md:col-span-5 xl:col-span-4"
                title="Cliente"
                field-name="client"
                placeholder="Seleccionar cliente"
                endpoint="/company"
                @change="getPits"
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
            <section class="col-span-full">
                <div
                    v-if="!pits || pits.length <= 0"
                    class="rounded-lg border border-dashed w-full p-6 m-2 text-center text-gray-400 italic"
                >
                    <span>Seleccione un cliente</span>
                </div>
                <div v-else class="divide-y">
                    <article v-for="pit in pits" :key="pit.id" class="px-4 py-2">
                        <input id="" type="checkbox" name="" />
                        <span> {{ pit.name }} </span>
                        <div v-for="(value, key) in pit" :key="key">{{ key }}: {{ value }}</div>
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

    const getPits = async () => {
        if (clientId.value > 0) {
            const url = `/pit?companyId=${clientId.value}`;
            const response = await axios.get(`${api}/${url}`).catch((err) => {
                return false;
            });
            console.log(response);
            pits.value = response.data.data;
        }
    };
</script>

<style scoped></style>
