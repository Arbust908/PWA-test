<template>
    <Layout>
        <ABMFormTitle title="Depósito de cajas vacias" />
        <FieldGroup class="max-w-4xl items-start">
            <ClientPitCombo
                v-model:client-id="clientId"
                v-model:pit-id="pitId"
                shared-classes="col-span-full md:col-span-4"
            />
        </FieldGroup>
        <div class="flex flex-row justify-between">
            <section class="bg-white rounded-md mr-10 shadow-sm mb-14 w-3/5 h-full">
                <div class="w-full max-w-sm border-dashed border-4 rounded-xl p-5 mx-auto my-10">
                    <span>Seleccione cliente y pozo para comenzar.</span>
                </div>
            </section>

            <section class="bg-white rounded-md shadow-sm mb-14 w-2/5">
                <h1 class="text-center mt-4">Cajas Seleccionadas</h1>
            </section>
        </div>
    </Layout>
</template>

<script>
    import Layout from '@/layouts/Main.vue';
    import ABMFormTitle from '@/components/ui/ABMFormTitle.vue';
    import ClientPitCombo from '@/components/util/ClientPitCombo.vue';
    import FieldGroup from '@/components/ui/form/FieldGroup.vue';

    export default {
        components: {
            Layout,
            ABMFormTitle,
            ClientPitCombo,
            FieldGroup,
        },
        setup() {
            useTitle('Depósito de cajas vacias');
        },
    };
</script>

<style lang="scss" scoped></style>
