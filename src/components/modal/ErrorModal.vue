<template>
    <Modal type="off" :open="open" @close="$emit('close')">
        <template #body>
            <div class="text-center flex flex-col justify-center items-center">
                <Icon icon="ExclamationCircle" class="h-14 w-14 mb-4 text-red-700" />
            </div>
            <div class="text-center text-xl font-semibold mb-2 mx-10 text-gray-900">{{ title }}</div>
            <br />
            <span class="text-center text-base border-none m-2"> {{ text }} </span>
        </template>
        <template #btn>
            <div class="flex justify-center">
                <PrimaryBtn btn="!px-16 !bg-red-700" @click.prevent="$emit('action')">Volver</PrimaryBtn>
            </div>
        </template>
    </Modal>
</template>

<script lang="ts">
    import Modal from '@/components/modal/General.vue';
    import Icon from '@/components/icon/TheAllIcon.vue';
    import PrimaryBtn from '@/components/ui/buttons/PrimaryBtn.vue';

    export default {
        components: {
            Modal,
            Icon,
            PrimaryBtn,
        },
        props: {
            title: {
                type: String,
                default: '',
            },
            text: {
                type: String,
                default: '',
            },
            open: Boolean,
        },
        emits: ['close', 'action'],
    };
</script>
