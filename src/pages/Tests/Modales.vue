<script setup lang="ts">
    import Layout from '@/layouts/Main.vue';
    import BaseBtn from '@/components/ui/buttons/BaseBtn.vue';
    import PrimaryBtn from '@/components/ui/buttons/PrimaryBtn.vue';
    import SecondaryBtn from '@/components/ui/buttons/SecondaryBtn.vue';
    import ErrorBtn from '@/components/ui/buttons/ErrorBtn.vue';
    import GhostBtn from '@/components/ui/buttons/GhostBtn.vue';
    import NoneBtn from '@/components/ui/buttons/NoneBtn.vue';
    import SideBtn from '@/components/ui/buttons/SideBtn.vue';
    import CircularBtn from '@/components/ui/buttons/CircularBtn.vue';
    import WarningBtn from '@/components/ui/buttons/WarningBtn.vue';

    const ErrorModal = defineAsyncComponent(() => import('@/components/modal/ErrorModal.vue'));
    const Backdrop = defineAsyncComponent(() => import('@/components/modal/Backdrop.vue'));
    const SuccessModal = defineAsyncComponent(() => import('@/components/modal/SuccessModal.vue'));
    const PurchaseOrderModal = defineAsyncComponent(() => import('@/components/modal/PurchaseOrderModal.vue'));

    const showPO = ref(false);
    const closePOModal = useToggle(showPO);
    const actionPOModal = () => {
        closePOModal(false);
    };

    const showErrorModal = ref(false);
    const closeErrorModal = useToggle(showErrorModal);
    const actionErrorModal = () => {
        closeErrorModal(false);
    };

    const showSuccessModal = ref(false);
    const closeSuccessModal = useToggle(showSuccessModal);
    const actionSuccessModal = () => {
        closeSuccessModal(false);
    };
</script>

<template>
    <Layout>
        <h1>Tests</h1>
        <section class="flex gap-4 flex-wrap">
            <BaseBtn btn="extra-wide warning" @click="closeErrorModal()">Error</BaseBtn>
            <BaseBtn btn="extra-wide success" @click="closeSuccessModal()">Exito</BaseBtn>
            <BaseBtn btn="extra-wide bg-indigo-200" @click="closePOModal()">Purchase Order</BaseBtn>
            <CircularBtn btn="bg-red-700" />
            <CircularBtn btn="bg-green-700" />
            <PrimaryBtn />
            <SecondaryBtn />
            <ErrorBtn :disbaled="true" />
            <GhostBtn :disabled="true" />
            <NoneBtn />
            <SideBtn />
            <WarningBtn />
        </section>

        <ErrorModal
            title="Error Modal"
            text="Modal de error"
            :open="showErrorModal"
            @close="closeErrorModal()"
            @main="actionErrorModal()"
        />
        <SuccessModal
            title="Success Modal"
            text="Modal de Exito"
            :open="showSuccessModal"
            @close="closeSuccessModal()"
            @main="actionSuccessModal()"
        />
        <PurchaseOrderModal
            title="Purchase Order Modal"
            text="Modal de Orden de Compra"
            :open="showPO"
            :po="{ id: '12345', date: '12/12/12', supplier: 'Proveedor', total: '$12.00' }"
            @close="closePOModal()"
            @main="actionPOModal()"
        />
    </Layout>
</template>
