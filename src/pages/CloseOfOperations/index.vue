<template>
    <Layout>
        <ABMFormTitle title="Cierre de operaciónes" />
        <FieldGroup class="bg-white rounded-lg shadow pt-3 px-4 pb-4 gap-y-3">
            <FieldSelect
                v-model:data="clientId"
                class="col-span-12 md:col-span-4"
                title="Cliente"
                field-name="client"
                placeholder="Seleccionar cliente"
                endpoint="/company"
            />
            <FieldSelect
                v-model:data="operatorId"
                class="col-span-12 md:col-span-4"
                title="Operadora / Empresa de Servicios"
                field-name="operator"
                placeholder="Seleccionar operadora"
                endpoint="/company?isOperator=1"
                is-optional
            />
            <FieldSelect
                v-model:data="workOrderId"
                class="col-span-12 md:col-span-4"
                title="Orden de trabajo"
                field-name="workOrder"
                placeholder="Seleccionar pozos"
                endpoint="/workOrder"
                endpoint-key="pad"
                is-optional
            />
        </FieldGroup>
    </Layout>
</template>

<script setup lang="ts">
    import Layout from '@/layouts/Main.vue';
    import ABMFormTitle from '@/components/ui/ABMFormTitle.vue';
    import FieldGroup from '@/components/ui/form/FieldGroup.vue';
    import FieldSelect from '@/components/ui/form/FieldSelect.vue';

    const clientId = ref(-1);
    const operatorId = ref(-1);
    const workOrderId = ref(-1);
</script>

<style scoped></style>
