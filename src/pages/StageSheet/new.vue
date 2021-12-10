<script setup lang="ts">
    import Layout from '@/layouts/Main.vue';
    import ABMFormTitle from '@/components/ui/ABMFormTitle.vue';
    import ClientPitCombo from '@/components/util/ClientPitCombo.vue';
    import FieldGroup from '@/components/ui/form/FieldGroup.vue';
    import PrimaryBtn from '@/components/ui/buttons/PrimaryBtn.vue';
    const clientId = ref(-1);
    const pitId = ref(-1);
</script>

<template>
    <Layout>
        <ABMFormTitle title="Stage sheet" />
        <FieldGroup class="max-w-4xl">
            <ClientPitCombo :client-id="clientId" :pit-id="pitId" shared-classes="col-span-full md:col-span-4" />
            <PrimaryBtn class="col-span-6 md:col-span-2 max-h-8">Finalizar Stage</PrimaryBtn>
        </FieldGroup>
        <nav class="flex gap-8 mt-10">
            <button class="font-bold text-lg border-b-2 border-main-500 text-main-500">Etapas pendientes</button>
            <button class="font-bold text-lg border-b-2 border-main-500 text-main-500">Etapas finalizadas</button>
        </nav>
        <section>
            <div>Etapas pendientes</div>
            <div>Etapas finalizadas</div>
        </section>
    </Layout>
</template>

<style scoped></style>
