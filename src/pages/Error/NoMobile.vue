<template>
    <Layout>
        <section class="bg-white rounded-md shadow-sm h-full pt-20 pb-12 px-4">
            <img src="../../assets/errors/noMobile.png" alt="404 not found" class="w-4/5 sm:w-auto mx-auto" />
            <h1 class="text-center text-xl sm:text-2xl text-black font-bold mt-8">
                La experiencia móvil no está disponible para esta sección.
            </h1>
            <p class="text-center text-sm text-gray-400 mt-3 max-w-[287px] mx-auto px-2">
                Para continuar, te sugerimos acceder desde una computadora o tablet.
            </p>
            <div class="flex justify-center mt-6">
                <PrimaryBtn @click="goBack()">Volver a donde estaba</PrimaryBtn>
            </div>
        </section>
    </Layout>
</template>

<script lang="ts">
    import { useRouter } from 'vue-router';
    import Layout from '@/layouts/Main.vue';
    import PrimaryBtn from '@/components/ui/buttons/PrimaryBtn.vue';

    export default {
        components: {
            Layout,
            PrimaryBtn,
        },
        setup() {
            const router = useRouter();

            const goBack = () => {
                router.go(-1);
            };

            return {
                goBack,
            };
        },
    };
</script>
