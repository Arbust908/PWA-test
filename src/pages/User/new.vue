<template>
    <Layout>
        <ABMFormTitle title="Nuevo usuario" />
        <section class="bg-white rounded-md shadow-sm max-w-2xl pb-5">
            panciiad
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
            :open="showErrorModal"
            title="Ya existe un usuario con este mail"
            text="El usuario que intentas guardar fue creado anteriormente"
            @close="showErrorModal = false"
            @main="showErrorModal = false"
        />
        <SuccessModal
            :open="showSuccessModal"
            title="¡El usuario fue guardado con éxito!"
            @close="$router.push('/usuarios')"
            @main="$router.push('/usuarios')"
        />
    </Layout>
</template>

<script lang="ts">
    import Layout from '@/layouts/Main.vue';
    import PrimaryBtn from '@/components/ui/buttons/PrimaryBtn.vue';
    import SecondaryBtn from '@/components/ui/buttons/SecondaryBtn.vue';
    import axios from 'axios';
    import ErrorModal from '@/components/modal/ErrorModal.vue';
    import SuccessModal from '@/components/modal/SuccessModal.vue';
    import { useStoreLogic } from '@/helpers/useStoreLogic';
    import { useValidator } from '@/helpers/useValidator';

    import UserForm from '@/components/user/Form.vue';
    import ABMFormTitle from '@/components/ui/ABMFormTitle.vue';

    export default {
        components: {
            PrimaryBtn,
            SecondaryBtn,
            Layout,
            UserForm,
            ErrorModal,
            SuccessModal,
            ABMFormTitle,
        },
        setup() {
            useTitle('Nuevo usuario <> Sandflow');
            const apiUrl = import.meta.env.VITE_API_URL || '/api';
            const router = useRouter();
            const store = useStore();

            const goToIndex = () => {
                router.push('/usuarios');
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

                if (response.status === 200) {
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
