<template>
    <div>
        <span class="label-wrapper">
            <div class="icon-wrapper">
                <Icon icon="ExclamationCircle" type="solid" class="icon" />
            </div>
            <div class="message-wrapper">{{ message }}</div>
        </span>
    </div>
</template>

<script>
    import { ref, toRefs, watchEffect } from 'vue';
    import Icon from '@/components/icon/TheAllIcon.vue';

    export default {
        components: {
            Icon,
        },
        props: {
            validationType: {
                type: String,
                required: false,
            },
            charAmount: {
                type: Number,
                required: false,
            },
        },
        setup(props) {
            const validationType = ref(props.validationType);
            const message = ref('');

            if (validationType.value == 'empty') message.value = 'Este campo es obligatorio.';
            if (validationType.value == 'email') message.value = 'Formato de mail incorrecto.';
            if (validationType.value == 'extension') message.value = 'Cantidad de caracteres incorrecta.';
            if (validationType.value == 'numeric') message.value = 'Este campo sólo puede estar compuesto por números';

            return {
                message,
            };
        },
    };
</script>

<style lang="scss" scoped>
    @keyframes enter {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }
    .label-wrapper {
        animation: enter 500ms;
        @apply flex mt-2 items-center;
    }
    .message-wrapper {
        @apply text-red-700 ml-1;
    }
    .icon-wrapper {
        .icon {
            @apply h-5 w-5 text-red-700;
        }
    }
</style>
