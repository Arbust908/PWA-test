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
        <FieldGroup>
            <ClientPitCombo :client-id="clientId" :pit-id="pitId" />
            <PrimaryBtn>Finalizar Stage</PrimaryBtn>
        </FieldGroup>
    </Layout>
</template>

<style scoped></style>
