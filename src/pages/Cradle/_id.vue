<template>
    <Layout>
        <header class="flex flex-col md:flex-row md:justify-between items-center md:mb-4">
            <h1 class="font-bold text-gray-900 text-2xl self-start mb-3 md:mb-0">Cradle - {{ id }}</h1>
        </header>
        <section class="bg-white rounded-md shadow-sm max-w-2xl">
            <form method="POST" action="/" class="p-4 flex flex-col gap-4">
                <FieldGroup>
                    <FieldInput
                        class="col-span-full"
                        field-name="name"
                        placeholder=""
                        title="Nombre"
                        :data="name"
                        require-validation
                        entity="cradle"
                        @update:data="name = $event"
                    />
                    <FieldTextArea
                        class="col-span-full"
                        field-name="observations"
                        placeholder=""
                        title="Observaciones"
                        :rows="5"
                        is-optional
                        :data="observations"
                        @update:data="observations = $event"
                    />
                </FieldGroup>
            </form>
        </section>
        <!-- *** -->
        <footer class="mt-8 gap-3 flex justify-end max-w-2xl">
            <section class="space-x-3 flex items-center justify-end">
                <SecondaryBtn btn="wide" @click="goToIndex">Cancelar</SecondaryBtn>
                <PrimaryBtn
                    btn="wide"
                    :disabled="!isValidated"
                    @click="isValidated && getCradlesAndCheckIfNameExists()"
                >
                    Finalizar
                </PrimaryBtn>
            </section>
        </footer>

        <ErrorModal
            :open="showErrorModal"
            class="max-w-[480px]"
            title="Ya existe este cradle"
            text="El cradle que intentas guardar fue creado anteriormente."
            @close="toggleErrorModal()"
            @main="toggleErrorModal()"
        />
        <ErrorModal
            :open="showApiErrorModal"
            title="¡Ups! Hubo un problema y no pudimos guardar el cradle."
            text="Por favor, intentá nuevamente en unos minutos."
            @close="toggleApiErrorModal()"
            @main="toggleApiErrorModal()"
        />
        <SuccessModal
            :open="showModal"
            class="max-w-[480px]"
            title="¡El cradle fue guardado con éxito!"
            @close="$router.push('/cradle')"
            @main="$router.push('/cradle')"
        />
    </Layout>
</template>

<script lang="ts">
    import Layout from '@/layouts/Main.vue';
    import { reactive, ref, toRefs, computed, defineAsyncComponent, watchEffect } from 'vue';
    import { useRouter, useRoute } from 'vue-router';
    import { useStore } from 'vuex';
    import { useTitle, useToggle } from '@vueuse/core';
    import { Cradle } from '@/interfaces/sandflow';
    import Icon from '@/components/icon/TheAllIcon.vue';
    import PrimaryBtn from '@/components/ui/buttons/PrimaryBtn.vue';
    import SecondaryBtn from '@/components/ui/buttons/SecondaryBtn.vue';
    import WarningBtn from '@/components/ui/buttons/WarningBtn.vue';
    import FieldGroup from '@/components/ui/form/FieldGroup.vue';
    import FieldInput from '@/components/ui/form/FieldInput.vue';
    import FieldTextArea from '@/components/ui/form/FieldTextArea.vue';
    import { useValidator } from '@/helpers/useValidator';
    import axios from 'axios';
    import SuccessModal from '@/components/modal/SuccessModal.vue';
    import ErrorModal from '@/components/modal/ErrorModal.vue';

    const apiUrl = import.meta.env.VITE_API_URL || '/api';
    const Modal = defineAsyncComponent(() => import('@/components/modal/General.vue'));

    export default {
        components: {
            FieldGroup,
            FieldInput,
            FieldTextArea,
            Layout,
            PrimaryBtn,
            SecondaryBtn,
            WarningBtn,
            Icon,
            Modal,
            SuccessModal,
            ErrorModal,
        },
        setup() {
            const route = useRoute();
            const store = useStore();
            const router = useRouter();

            const cradles: Array<Cradle> = JSON.parse(JSON.stringify(store.state.cradle.all));
            const currentCradle: Cradle = cradles.find((cradle) => {
                return cradle.id == route.params.id;
            });
            useTitle(`Cradle ${currentCradle.name} <> Sandflow`);

            const cradleToUpdate = reactive({
                id: currentCradle.id,
                name: currentCradle.name,
                observations: currentCradle.observations,
            });

            const currentCradleName = cradleToUpdate.name;
            const createdCradles = ref([]);

            const isValidated = ref(false);

            watchEffect(async () => {
                isValidated.value = (await useValidator(store, 'cradle')) ? true : false;
            });

            // MODALS
            const showModal = ref(false);
            const toggleModal = useToggle(showModal);

            const showErrorModal = ref(false);
            const toggleErrorModal = useToggle(showErrorModal);

            const showApiErrorModal = ref(false);
            const toggleApiErrorModal = useToggle(showApiErrorModal);

            const update = async () => {
                const loading = ref(true);
                let sandDB = await axios
                    .put(`${apiUrl}/cradle/${currentCradle.id}`, cradleToUpdate)
                    .catch((err) => {
                        console.log(err);
                        toggleApiErrorModal();
                    })
                    .then((res) => {
                        if (res.status === 200) {
                            return res.data;
                        } else {
                            toggleApiErrorModal();
                        }

                        return {};
                    })
                    .finally(() => {
                        loading.value = false;
                    });
                store.dispatch('updateCradle', cradleToUpdate);
                toggleModal();
            };

            const getCradlesAndCheckIfNameExists = async () => {
                try {
                    const cradlesFromApi = await axios.get(`${apiUrl}/cradle`);

                    createdCradles.value = cradlesFromApi.data.data;

                    let names = createdCradles.value.map((cradle) => cradle.name.toLowerCase());

                    if (currentCradleName == cradleToUpdate.name) {
                        update();
                    } else if (names.includes(cradleToUpdate.name.toLowerCase())) {
                        toggleErrorModal();
                    } else {
                        update();
                    }
                } catch (error) {
                    console.log(error);
                }
            };

            const goToIndex = () => {
                router.push('/cradle');
            };

            return {
                update,
                goToIndex,
                isValidated,
                ...toRefs(cradleToUpdate),
                getCradlesAndCheckIfNameExists,
                showModal,
                showErrorModal,
                showApiErrorModal,
                toggleModal,
                toggleErrorModal,
                toggleApiErrorModal,
            };
        },
    };
</script>

<style lang="scss" scoped>
    .input {
        @apply w-full px-3 py-2 rounded focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-second-300 mt-1 flex shadow-sm;
    }
    input:read-only {
        @apply bg-second-200 border cursor-not-allowed;
    }
    fieldset:not(:last-of-type) {
        @apply border-b pb-6;
    }
    label:not(.toggle) {
        @apply flex flex-col;
        span {
            @apply text-sm;
        }
    }
    .toggle {
        @apply flex space-x-3 items-center;
    }
    .btn {
        &__draft {
            @apply border-main-400 text-main-500 bg-transparent hover:bg-main-50 hover:shadow-lg;
        }
        &__delete {
            @apply border-transparent text-second-800 bg-transparent hover:bg-red-600 hover:text-second-50 mx-2 p-2 transition duration-150 ease-out;
        }
        &__options {
            @apply border-transparent text-second-800 bg-transparent hover:bg-second-300 hover:text-indigo-800 mx-2 p-2 transition duration-150 ease-out;
        }
        &__add {
            @apply border-transparent text-second-50 bg-green-500 hover:bg-green-600 mr-2;
        }
        &__add--special {
            @apply border-2 border-second-400 text-second-400 bg-transparent group-hover:bg-second-200 group-hover:text-second-600 group-hover:border-second-600;
        }
        &__mobile-only {
            @apply lg:hidden;
        }
        &__desktop-only {
            @apply hidden lg:inline-flex;
        }
    }
</style>
