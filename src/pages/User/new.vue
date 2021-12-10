<template>
    <Layout>
        <header class="flex flex-col md:flex-row md:justify-between items-center md:mb-4">
            <h1 class="font-bold text-gray-900 text-2xl self-start mb-3 md:mb-0">Nuevo usuario</h1>
        </header>
        <section class="bg-white rounded-md shadow-sm max-w-2xl pb-5">
            <UserForm v-model="user" />
        </section>
        <footer class="mt-[32px] gap-3 flex flex-col md:flex-row justify-end max-w-2xl m">
            <section class="w-full space-x-3 flex items-center justify-end">
                <SecondaryBtn btn="wide" @click.prevent="$router.push('/usuarios')"> Cancelar </SecondaryBtn>
                <PrimaryBtn btn="wide" :is-loading="isLoading" :disabled="!isValidated" @click="isValidated && save()">
                    Finalizar
                </PrimaryBtn>
            </section>
        </footer>

        <ErrorModal
            class="sm:w-[460px] sm:h-[248] !py-8"
            :open="showErrorModal"
            title="Ya existe un usuario con este mail"
            text="El usuario que intentas guardar fue creado anteriormente"
            @close="showErrorModal = false"
            @action="showErrorModal = false"
        />
        <SuccessModal
            class="sm:w-[440px] sm:h-[248] !py-8"
            :open="showSuccessModal"
            title="¡El usuario fue guardado con éxito!"
            @close="$router.push('/usuarios')"
            @action="$router.push('/usuarios')"
        />
    </Layout>
</template>

<script lang="ts">
    import { ref, watchEffect } from 'vue';
    import { useRouter } from 'vue-router';
    import { useStore } from 'vuex';
    import { useTitle } from '@vueuse/core';
    import Layout from '@/layouts/Main.vue';
    import PrimaryBtn from '@/components/ui/buttons/PrimaryBtn.vue';
    import SecondaryBtn from '@/components/ui/buttons/SecondaryBtn.vue';
    import axios from 'axios';
    import ErrorModal from '@/components/modal/ErrorModal.vue';
    import SuccessModal from '@/components/modal/SuccessModal.vue';
    import { useStoreLogic } from '@/helpers/useStoreLogic';
    import { useValidator } from '@/helpers/useValidator';

    import UserForm from '@/components/user/Form.vue';

    export default {
        components: {
            PrimaryBtn,
            SecondaryBtn,
            Layout,
            UserForm,
            ErrorModal,
            SuccessModal,
        },
        setup() {
            useTitle('Nuevo tipo de arena <> Sandflow');
            const apiUrl = import.meta.env.VITE_API_URL || '/api';
            const router = useRouter();
            const store = useStore();

            const goToIndex = () => {
                router.push('/tipos-de-arena');
            };

            const user = ref({});
            const showErrorModal = ref(false);
            const showSuccessModal = ref(false);

            const isValidated = ref(false);
            const isLoading = ref(false);

            watchEffect(async () => {
                isValidated.value = (await useValidator(store, 'user')) ? true : false;
            });

            const save = async () => {
                const exists = await checkIfExists('email', user.value.email);

                if (exists) {
                    showErrorModal.value = true;

                    return;
                }

                isLoading.value = true;

                user.value.password = user.value.email;

                const response = await axios.post(`${apiUrl}/register`, user.value);

                if (response.type === 'success') {
                    showSuccessModal.value = true;
                }

                isLoading.value = false;
            };

            const checkIfExists = async (field: string, value: string) => {
                const apiResponse = await axios.get(`${apiUrl}/user?${field}=${value}`);

                const users = apiResponse.data.data;

                return users.length > 0;
            };

            return {
                goToIndex,
                save,
                isValidated,
                isLoading,
                user,
                showErrorModal,
                showSuccessModal,
            };
        },
    };
</script>
