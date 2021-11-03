<template>
    <article class="success-box">
        <h2>Contraseña Actualizada</h2>
        <CheckCircleIcon class="success-logo" />
        <p>Tu contraseña ha sido actualizada</p>
        <Button class="mx-auto px-6"> Ingresar </Button>
    </article>
</template>

<script>
    import { CheckCircleIcon } from '@heroicons/vue/solid';
    import Button from '@/components/ui/buttons/BaseBtn.vue';
    export default {
        components: {
            CheckCircleIcon,
            Button,
        },
    };
</script>

<style lang="scss" scoped>
    .success {
        &-box {
            @apply py-8 px-4 sm:px-8 flex-1 flex flex-col justify-center max-w-xs mx-auto text-center space-y-8;
            & > h2 {
                @apply text-center text-3xl font-extrabold text-gray-900;
            }
        }
        &-logo {
            @apply mx-auto h-28 w-auto text-green-600;
        }
    }
</style>
