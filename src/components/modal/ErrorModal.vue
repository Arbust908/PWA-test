<template>
    <NoticeModal
        v-bind="$attrs"
        :open="open"
        :title="title"
        :text="text"
        :text-class="'text-gray-900'"
        :icon="{ type: 'ExclamationCircle', classes: 'text-red-700' }"
        :btn="{ text: 'Volver', classes: 'warning' }"
        @close="$emit('close')"
        @main="$emit('main')"
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
        emits: ['close', 'main'],
    };
</script>
