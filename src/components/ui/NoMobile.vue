<template>
    <section>
        <NoMobileIcon class="w-64 mb-9" />
        <h1>La experiencia móvil no está disponible para esta sección.</h1>
        <p>Para continuar, te sugerimos acceder desde una computadora o tablet.</p>
        <PrimaryBtn @click="goBack()"> Volver a donde estaba </PrimaryBtn>
    </section>
</template>

<script lang="ts">
    import { defineComponent } from 'vue';
    import NoMobileIcon from '@/components/icon/NoMobileIcon.vue';
    import PrimaryBtn from '@/components/ui/buttons/PrimaryBtn.vue';
    import { useRouter } from 'vue-router';
    export default defineComponent({
        components: {
            NoMobileIcon,
            PrimaryBtn,
        },
        setup() {
            const router = useRouter();
            const goBack = () => {
                if (window?.history?.length && window?.history?.state?.back) {
                    router.back();
                } else {
                    router.push('/');
                }
            };

            return {
                goBack,
            };
        },
    });
</script>

<style lang="scss" scoped>
    section {
        @apply bg-white rounded-lg shadow border m-3 flex flex-col items-center text-center px-5 py-10 font-bold;
        & > h1 {
            @apply text-xl text-gray-800 mb-3 max-w-xs;
        }
        & > p {
            @apply mb-9 text-gray-400 max-w-xs text-sm;
        }
    }
</style>
