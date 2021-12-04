<template>
    <Layout>
        <ABMTitle title="Nuevo tipo de arena" />
        <section class="bg-white rounded-md shadow-sm max-w-2xl pb-5">
            <SandForm
                :type="type"
                :description="observations"
                @update:type="type = $event"
                @update:description="observations = $event"
            />
        </section>
        <!-- *** -->
        <footer>
            <SecondaryBtn btn="wide" @click.prevent="$router.push('/tipos-de-arena')"> Cancelar </SecondaryBtn>
            <PrimaryBtn
                btn="wide"
                :is-loading="isLoading"
                :disabled="!isValidated ? 'yes' : null"
                @click="isValidated && getSandsAndCheckIfTypeExists()"
            >
                Finalizar
            </PrimaryBtn>
        </footer>
        <Modal type="off" :open="showModal" @close="toggleModal">
            <template #body>
                <div class="text-center flex flex-col justify-center items-center">
                    <Icon icon="CheckCircle" class="h-[60px] w-[60px] mb-5 text-green-400" />
                    <span class="text-center text-base border-none text-gray-900"
                        >¡El tipo de arena fue guardado con éxito!</span
                    >
                </div>
            </template>
            <template #btn>
                <div class="flex justify-center">
                    <PrimaryBtn @click.prevent="$router.push('/tipos-de-arena')">Continuar</PrimaryBtn>
                </div>
            </template>
        </Modal>
        <Modal type="off" :open="showErrorModal" @close="toggleErrorModal">
            <template #body>
                <div class="text-center flex flex-col justify-center items-center">
                    <Icon icon="ExclamationCircle" class="h-[54px] w-[54px] mb-4 text-red-700" />
                    <span class="text-center text-base border-none text-gray-900"> Ya existe este tipo de malla </span>
                    <span class="text-center text-sm border-none m-2">
                        El tipo de arena que intentas guardar fue creado anteriormente.
                    </span>
                </div>
            </template>
            <template #btn>
                <div class="flex justify-center">
                    <WarningBtn @click.prevent="toggleErrorModal()">Volver</WarningBtn>
                </div>
            </template>
        </Modal>
        <Modal type="off" :open="showApiErrorModal" @close="toggleApiErrorModal">
            <template #body>
                <div class="text-center flex flex-col justify-center items-center">
                    <Icon icon="ExclamationCircle" class="h-[54px] w-[54px] mb-4 text-red-400" />
                    <span class="text-center text-base border-none text-gray-900">
                        ¡Ups! Hubo un problema y no pudimos guardar el tipo de arena.
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
    import Layout from '@/layouts/Main.vue';
    import Icon from '@/components/icon/TheAllIcon.vue';
    import SecondaryBtn from '@/components/ui/buttons/SecondaryBtn.vue';
    import PrimaryBtn from '@/components/ui/buttons/PrimaryBtn.vue';
    import WarningBtn from '@/components/ui/buttons/WarningBtn.vue';
    import ABMTitle from '@/components/ui/ABMTitle.vue';
    import { useValidator } from '@/helpers/useValidator';
    import axios from 'axios';
    const api = import.meta.env.VITE_API_URL || '/api';
    const Modal = defineAsyncComponent(() => import('@/components/modal/General.vue'));

    import SandForm from '@/components/sand/SandForm.vue';

    export default {
        components: {
            ABMTitle,
            Icon,
            Layout,
            Modal,
            PrimaryBtn,
            SandForm,
            SecondaryBtn,
            WarningBtn,
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
                observations: '',
            });

            const isValidated = ref(false);
            const isLoading = ref(false);

            const createdSands = ref([]);

            // TODO: Pasar a un useExist o algo asi
            const checkIfExists = async (model: string, field: string, value: string) => {
                const baseApiUrl = import.meta.env.VITE_API_URL || '/api';
                const apiResponse = await axios.get(`${baseApiUrl}/${model}?${field}=${value}`);
                const modelArray = apiResponse.data.data;

                return modelArray.length > 0;
            };

            // MODALS
            const showModal = ref(false);
            const toggleModal = useToggle(showModal);

            const showErrorModal = ref(false);
            const toggleErrorModal = useToggle(showErrorModal);

            const showApiErrorModal = ref(false);
            const toggleApiErrorModal = useToggle(showApiErrorModal);

            watchEffect(async () => {
                isValidated.value = (await useValidator(store, 'sand')) ? true : false;
            });

            const save = async () => {
                isLoading.value = true;

                const response = await axios.post(`${api}/sand`, newSand).catch((err) => {
                    console.log(err);
                    toggleApiErrorModal;
                });

                isLoading.value = false;

                if (response.status === 200) {
                    toggleModal();
                } else {
                    toggleApiErrorModal;
                }
            };

            const getSandsAndCheckIfTypeExists = async () => {
                try {
                    if (await checkIfExists('sand', 'type', newSand.type)) {
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
                ...toRefs(newSand),
                isValidated,
                isLoading,
                showModal,
                showErrorModal,
                showApiErrorModal,
                toggleModal,
                toggleErrorModal,
                toggleApiErrorModal,
                getSandsAndCheckIfTypeExists,
            };
        },
    };
</script>

<style lang="scss" scoped>
    section {
        @apply bg-white rounded-md shadow-sm max-w-2xl pb-5;
    }
    footer {
        @apply mt-[32px] gap-3 flex flex-row max-w-2xl w-full space-x-3 items-center justify-end;
    }
</style>
