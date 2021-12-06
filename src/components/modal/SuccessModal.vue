<template>
    <NoticeModal
        v-bind="$attrs"
        :open="open"
        :title="title"
        :text="text"
        :icon="{ type: 'CheckCircle', classes: 'text-green-700' }"
        :btn="{ text: 'Continuar', classes: 'success' }"
        @close="$emit('close')"
    />
</template>

<script lang="ts">
    import NoticeModal from './NoticeModal.vue';

    export default {
        components: {
            NoticeModal,
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
            open: {
                type: Boolean,
                default: false,
            },
        },
        emits: ['close'],
    };
</script>
