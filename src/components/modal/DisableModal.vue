<template>
    <Modal v-bind="$attrs" :open="open" modal-classes="gap-4 text-center max-w-md" @close="$emit('close')">
        <div class="icon--box">
            <Icon icon="ExclamationCircle" class="icon" />
        </div>
        <h2>{{ title }}</h2>
        <span> {{ text }} </span>
        <footer>
            <NoneBtn @click="$emit('close')"> Volver </NoneBtn>
            <PrimaryBtn :btn="`extra-wide warning`" @click="$emit('main')"> Inhabilitar </PrimaryBtn>
        </footer>
    </Modal>
</template>

<script lang="ts">
    import Modal from '@/components/modal/General.vue';
    import Icon from '@/components/icon/TheAllIcon.vue';
    import PrimaryBtn from '@/components/ui/buttons/PrimaryBtn.vue';
    import NoneBtn from '../ui/buttons/NoneBtn.vue';

    export default {
        components: {
            Modal,
            Icon,
            PrimaryBtn,
            NoneBtn,
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

<style lang="scss" scoped>
    .icon {
        @apply h-14 w-14 text-red-700;
        &--box {
            @apply flex flex-col justify-center items-center;
        }
    }
    h2 {
        @apply text-xl font-semibold mx-5 text-gray-900;
    }
    span {
        @apply text-base;
    }
    footer {
        @apply flex justify-center;
    }
</style>
