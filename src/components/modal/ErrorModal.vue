<template>
    <NoticeModal
        v-bind="$attrs"
        :open="open"
        :title="title"
        :text="text"
        :icon="{ type: 'ExclamationCircle', classes: 'text-red-700' }"
        :btn="{ text: 'Volver', classes: 'warning' }"
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
        emits: ['close', 'action'],
    };
</script>
