<template>
    <Layout>
        <header class="flex flex-col md:flex-row md:justify-between items-center md:mb-4">
            <h1 class="font-bold text-gray-900 text-2xl self-start mb-3 md:mb-0">Nuevo usuario</h1>
        </header>
        <section class="bg-white rounded-md shadow-sm max-w-2xl pb-5">
            <UserForm v-model="currentUser" />
        </section>
        <footer class="mt-[32px] gap-3 flex flex-col md:flex-row justify-end max-w-2xl m">
            <section class="w-full space-x-3 flex items-center justify-end">
                <SecondaryBtn btn="wide" @click.prevent="$router.push('/usuarios')"> Cancelar </SecondaryBtn>
                <PrimaryBtn
                    btn="wide"
                    :is-loading="isLoading"
                    :disabled="!isValidated"
                    @click="isValidated && update()"
                >
                    Finalizar
                </PrimaryBtn>
            </section>
        </footer>

        <ErrorModal
            class="sm:w-[440px] sm:h-[248] !py-8"
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
    import { onMounted, ref, watchEffect } from 'vue';
    import { useRouter, useRoute } from 'vue-router';
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
            useTitle(`Usuario ${2} <> Sandflow`);
            const apiUrl = import.meta.env.VITE_API_URL || '/api';

            const router = useRouter();
            const route = useRoute();
            const store = useStore();

            const showErrorModal = ref(false);
            const showSuccessModal = ref(false);

            const isValidated = ref(false);
            const isLoading = ref(false);

            const currentUser = ref({});

            watchEffect(async () => {
                isValidated.value = (await useValidator(store, 'user')) ? true : false;
            });

            const update = async () => {
                const exists = await checkIfExists('email', currentUser.value.email);

                if (exists) {
                    showErrorModal.value = true;

                    return;
                }

                isLoading.value = true;

                const response = await useStoreLogic(router, store, 'user', 'update', currentUser);

                if (response.type === 'success') {
                    showSuccessModal.value = true;
                }

                isLoading.value = false;
            };

            const checkIfExists = async (field: string, value: string) => {
                const response = await axios.get(`${apiUrl}/user?${field}=${value}`);

                const users = response.data.data;

                return users.filter((user) => user.id !== currentUser.value.id).length > 0;
            };

            const getUser = async () => {
                const userId = route.params.id;

                const response = await useStoreLogic(router, store, 'user', 'get', userId);

                if (response.type == 'success') {
                    currentUser.value = response.res;
                }
            };

            onMounted(() => {
                getUser();
            });

            return {
                update,
                isValidated,
                isLoading,
                showErrorModal,
                showSuccessModal,
                currentUser,
            };
        },
    };
</script>
