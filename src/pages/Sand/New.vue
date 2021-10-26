<template>
    <Layout>
        <header class="flex flex-col md:flex-row md:justify-between items-center md:mb-4">
            <h1 class="font-bold text-gray-900 text-2xl self-start mb-3 md:mb-0">Nuevo tipo de arena</h1>
        </header>
        <section class="bg-white rounded-md shadow-sm max-w-2xl">
            <SandForm
                :type="type"
                :description="observations"
                @update:type="type = $event"
                @update:description="observations = $event"
            />
            <footer class="p-4 mr-5 gap-3 flex md:flex-row-reverse justify-between">
                <section class="space-x-6 flex items-center justify-end">
                    <NoneBtn @click.prevent="goToIndex">Cancelar</NoneBtn>
                    <PrimaryBtn :disabled="!isValidated ? 'yes' : null" @click="isValidated && save()">
                        Finalizar
                    </PrimaryBtn>
                </section>
            </footer>
        </section>
    </Layout>
</template>

<script lang="ts">
    import { reactive, toRefs, ref, watchEffect } from 'vue';
    import { useRouter } from 'vue-router';
    import { useStore } from 'vuex';
    import { useTitle } from '@vueuse/core';
    import Layout from '@/layouts/Main.vue';
    import NoneBtn from '@/components/ui/buttons/NoneBtn.vue';
    import PrimaryBtn from '@/components/ui/buttons/PrimaryBtn.vue';
    import { useValidator } from '@/helpers/useValidator';
    import axios from 'axios';
    const api = import.meta.env.VITE_API_URL || '/api';

    import SandForm from '@/components/sand/SandForm.vue';

    export default {
        components: {
            PrimaryBtn,
            NoneBtn,
            Layout,
            SandForm,
        },
        setup() {
            useTitle('Nuevo tipo de arena <> Sandflow');
            const router = useRouter();
            const store = useStore();

            const goToIndex = () => {
                router.push('/tipos-de-arena');
            };

            const newSand = reactive({
                type: '',
                // description: '',
                // meshType: '',
                // grainType: '',
                observations: '',
            });

            const isValidated = ref(false);

            watchEffect(async () => {
                isValidated.value = (await useValidator(store, 'sand')) ? true : false;
            });

            const save = async () => {
                let sandDB = await axios
                    .post(`${api}/sand`, newSand)
                    .catch((err) => {
                        console.log(err);
                    })
                    .then((res) => {
                        console.log(res);

                        if (res.status === 200) {
                            return res.data;
                        }

                        return {};
                    })
                    .finally(() => {
                        router.push('/tipos-de-arena');
                    });
            };

            return {
                goToIndex,
                save,
                ...toRefs(newSand),
                isValidated,
            };
        },
    };
</script>

<style lang="scss" scoped>
    .btn {
        &__draft {
            @apply border-main-400 text-main-500 bg-transparent hover:bg-main-50 hover:shadow-lg;
        }
        &__delete {
            @apply border-transparent text-gray-800 bg-transparent hover:bg-red-600 hover:text-white mx-2 p-2 transition duration-150 ease-out;
            /* @apply border-transparent text-white bg-red-500 hover:bg-red-600 mx-2 p-2; */
        }
        &__add {
            @apply border-transparent text-white bg-green-500 hover:bg-green-600 mr-2;
        }
        &__add--special {
            @apply border-2 border-gray-400 text-gray-400 bg-transparent group-hover:bg-gray-200 group-hover:text-gray-600 group-hover:border-gray-600;
        }
        &__mobile-only {
            @apply lg:hidden;
        }
        &__desktop-only {
            @apply hidden lg:inline-flex;
        }
    }
    .section-tab {
        @apply py-2 border-b-4 w-full font-bold text-gray-400 flex justify-center items-center gap-2;
    }
    .section-tab[selected='true'] {
        @apply border-main-500 text-main-500;
    }
    .input-block select,
    .input-block input {
        @apply w-full rounded mb-3 p-2;
    }

    .pit-block {
        @apply flex mt-1 items-center w-full mb-3;
        & select,
        & input {
            @apply rounded p-2 max-w-md inline-block w-full;
        }
    }

    fieldset {
        @apply mb-6;
    }
    label {
        @apply text-sm;
    }
    .equip-grid {
        @apply grid gap-4 grid-cols-2 md:grid-cols-3;
    }
</style>
