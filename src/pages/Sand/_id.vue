<template>
    <Layout>
        <header class="flex flex-col md:flex-row md:justify-between items-center md:mb-4">
            <h1 class="font-bold text-gray-900 text-2xl self-start mb-3 md:mb-0">Arena - {{ type }}</h1>
        </header>
        <section class="bg-white rounded-md shadow-sm max-w-2xl pb-5">
            <SandForm
                :type="type"
                :description="observations"
                @update:type="type = $event"
                @update:description="observations = $event"
            />
        </section>
        <footer class="mt-5 gap-3 flex flex-col md:flex-row justify-end max-w-2xl">
            <section class="w-full space-x-3 flex items-center justify-end">
                <SecondaryBtn btn="wide" @click.prevent="$router.push('/tipos-de-arena')"> Cancelar </SecondaryBtn>
                <PrimaryBtn
                    btn="wide"
                    :is-loading="loading"
                    :disabled="!isFull ? 'yes' : null"
                    @click="isFull && save()"
                >
                    Finalizar
                </PrimaryBtn>
            </section>
        </footer>
    </Layout>
</template>

<script lang="ts">
    import { reactive, ref, toRefs, computed } from 'vue';
    import { useStore } from 'vuex';
    import { useTitle } from '@vueuse/core';
    import Layout from '@/layouts/Main.vue';
    import { useRouter, useRoute } from 'vue-router';
    import SecondaryBtn from '@/components/ui/buttons/SecondaryBtn.vue';
    import PrimaryBtn from '@/components/ui/buttons/PrimaryBtn.vue';
    import { Sand } from '@/interfaces/SandType';
    import axios from 'axios';

    const api = import.meta.env.VITE_API_URL || '/api';

    import SandForm from '@/components/sand/SandForm.vue';

    export default {
        components: {
            PrimaryBtn,
            SecondaryBtn,
            Layout,
            SandForm,
        },
        setup() {
            const route = useRoute();
            const store = useStore();

            const sands: Array<Sand> = JSON.parse(JSON.stringify(store.state.sand.all));
            const currentSand: Sand = sands.find((sand) => {
                return sand.id == route.params.id;
            });
            useTitle(`Arena ${currentSand.type} <> Sandflow`);
            const router = useRouter();
            const loading = ref(false);

            const sandToUpdate = reactive({
                id: currentSand.id,
                type: currentSand.type,
                observations: currentSand.observations,
            });

            const isFull = computed(() => {
                return !!(sandToUpdate.type.length > 0);
            });

            const save = async () => {
                loading.value = true;
                const response = await axios.put(`${api}/sand/${currentSand.id}`, sandToUpdate).catch((err) => {
                    console.log(err);
                });
                loading.value = false;

                if (response.status === 200) {
                }

                store.dispatch('updateSand', sandToUpdate);
                router.push('/tipos-de-arena');
            };

            return {
                sands,
                save,
                sandToUpdate,
                isFull,
                loading,
                ...toRefs(sandToUpdate),
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
