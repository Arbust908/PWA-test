<template>
    <Layout>
        <header class="flex flex-col md:flex-row md:justify-between items-center md:mb-4">
            <h1 class="font-bold text-gray-900 text-2xl self-start mb-3 md:mb-0">Nuevo Cradle</h1>
        </header>
        <section class="bg-white rounded-md shadow-sm max-w-2xl">
            <form method="POST" action="/" class="p-4 flex flex-col gap-4" @submit.prevent>
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
        <footer class="mt-[32px] gap-3 flex justify-end max-w-2xl">
            <section class="space-x-3 flex items-center justify-end">
                <SecondaryBtn btn="wide" @click="goToIndex()">Cancelar</SecondaryBtn>
                <PrimaryBtn
                    btn="wide"
                    :disabled="!isValidated ? 'yes' : null"
                    @click="isValidated && getCradlesAndCheckIfNameExists()"
                >
                    Finalizar
                </PrimaryBtn>
            </section>
        </footer>
        <Modal type="off" :open="showModal" @close="togglemodal">
            <template #body>
                <div class="text-center flex flex-col justify-center items-center">
                    <Icon icon="CheckCircle" class="h-[60px] w-[60px] mb-5 text-green-400" />
                    <span class="text-center text-base border-none text-gray-900"
                        >¡El cradle fue guardado con éxito!</span
                    >
                </div>
            </template>
            <template #btn>
                <div class="flex justify-center">
                    <PrimaryBtn @click.prevent="$router.push('/cradle')">Continuar</PrimaryBtn>
                </div>
            </template>
        </Modal>
        <Modal type="off" :open="showErrorModal" @close="togglemodal">
            <template #body>
                <div class="text-center flex flex-col justify-center items-center">
                    <Icon icon="ExclamationCircle" class="h-[54px] w-[54px] mb-4 text-red-700" />
                    <span class="text-center text-base border-none text-gray-900"> Ya existe este cradle </span>
                    <span class="text-center text-sm border-none m-2">
                        El cradle que intentas guardar fue creado anteriormente.
                    </span>
                </div>
            </template>
            <template #btn>
                <div class="flex justify-center">
                    <WarningBtn @click.prevent="toggleErrorModal()">Volver</WarningBtn>
                </div>
            </template>
        </Modal>
        <Modal type="off" :open="showApiErrorModal" @close="togglemodal">
            <template #body>
                <div class="text-center flex flex-col justify-center items-center">
                    <Icon icon="ExclamationCircle" class="h-[54px] w-[54px] mb-4 text-red-400" />
                    <span class="text-center text-base border-none text-gray-900">
                        ¡Ups! Hubo un problema y no pudimos guardar el cradle.
                    </span>
                    <span class="text-center text-sm border-none m-2">
                        Por favor, intentá nuevamente en unos minutos.
                    </span>
                </div>
            </template>
            <template #btn>
                <div class="flex justify-center">
                    <WarningBtn @click.prevent="toggleApiErrorModal()">Volver</WarningBtn>
                </div>
            </template>
        </Modal>
    </Layout>
</template>

<script lang="ts">
    import { reactive, toRefs, ref, defineAsyncComponent, watchEffect } from 'vue';
    import { useRouter } from 'vue-router';
    import { useStore } from 'vuex';
    import { useTitle, useToggle } from '@vueuse/core';
    import Layout from '@/layouts/Main.vue';
    import Icon from '@/components/icon/TheAllIcon.vue';
    import SecondaryBtn from '@/components/ui/buttons/SecondaryBtn.vue';
    import PrimaryBtn from '@/components/ui/buttons/PrimaryBtn.vue';
    import WarningBtn from '@/components/ui/buttons/WarningBtn.vue';
    import FieldGroup from '@/components/ui/form/FieldGroup.vue';
    import FieldInput from '@/components/ui/form/FieldInput.vue';
    import FieldTextArea from '@/components/ui/form/FieldTextArea.vue';
    import { useValidator } from '@/helpers/useValidator';
    import axios from 'axios';
    const apiUrl = import.meta.env.VITE_API_URL || '/api';
    const Modal = defineAsyncComponent(() => import('@/components/modal/General.vue'));

    export default {
        components: {
            FieldGroup,
            FieldInput,
            FieldTextArea,
            PrimaryBtn,
            SecondaryBtn,
            WarningBtn,
            Layout,
            Icon,
            Modal,
        },
        setup() {
            useTitle('Nuevo Cradle <> Sandflow');
            const router = useRouter();
            const store = useStore();

            const goToIndex = () => {
                router.push('/cradle');
            };

            const newCradle = reactive({
                name: '',
                observations: '',
                slots: [
                    {
                        boxId: null,
                    },
                    {
                        boxId: null,
                    },
                    {
                        boxId: null,
                    },
                    {
                        boxId: null,
                    },
                ],
            });
            const createdCradles = ref([]);
            // console.log(store.state.cradle.all)

            const isValidated = ref(false);

            // MODALS
            const showModal = ref(false);
            const toggleModal = useToggle(showModal);

            const showErrorModal = ref(false);
            const toggleErrorModal = useToggle(showErrorModal);

            const showApiErrorModal = ref(false);
            const toggleApiErrorModal = useToggle(showApiErrorModal);

            watchEffect(async () => {
                isValidated.value = (await useValidator(store, 'cradle')) ? true : false;
            });

            const save = async () => {
                let sandDB = await axios
                    .post(`${apiUrl}/cradle`, newCradle)
                    .catch((err) => {
                        console.log(err);
                        toggleApiErrorModal;
                    })
                    .then((res) => {
                        console.log(res);

                        if (res.status === 200) {
                            return res.data.data;
                        } else {
                            toggleApiErrorModal;
                        }

                        return {};
                    })
                    .finally(() => {});

                store.dispatch('saveCradle', newCradle);
                toggleModal();
            };

            const getCradlesAndCheckIfNameExists = async () => {
                try {
                    const cradlesFromApi = await axios.get(`${apiUrl}/cradle`);

                    createdCradles.value = cradlesFromApi.data.data;

                    let names = createdCradles.value.map((cradle) => cradle.name.toLowerCase());

                    if (names.includes(newCradle.name.toLowerCase())) {
                        toggleErrorModal();
                    } else {
                        save();
                    }
                } catch (error) {
                    console.log(error);
                }
            };

            return {
                goToIndex,
                save,
                newCradle,
                ...toRefs(newCradle),
                isValidated,
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
