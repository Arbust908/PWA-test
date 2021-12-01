<template>
    <Modal v-bind="$attrs" type="off" :open="open" @close="$emit('close')">
        <template #body>
            <div class="text-center flex flex-col justify-center items-center">
                <Icon icon="CheckCircle" class="h-14 w-14 mb-4 text-green-500" />
            </div>
            <div class="text-center text-xl font-semibold text-gray-900">
                {{ title }}
            </div>
            <span v-if="text" class="text-center text-base border-none m-2"> {{ text }} </span>
        </template>
        <template #btn>
            <div class="flex justify-center">
                <PrimaryBtn btn="!px-14 !bg-green-700" @click.prevent="$emit('action')">Continuar</PrimaryBtn>
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
        inheritAttrs: false,
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
