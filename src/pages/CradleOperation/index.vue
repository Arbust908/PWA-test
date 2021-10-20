<template>
    <Layout>
        <header class="flex flex-col md:flex-row md:justify-between items-center md:mb-4">
            <h1 class="font-bold text-second-900 text-2xl self-start mb-3 md:mb-0">Operación en cradle</h1>
        </header>
        <section class="bg-second-0 rounded-md shadow-sm">
            <form method="POST" action="/" class="p-12 flex flex-col gap-4">
                <FieldGroup class="grid grid-cols-12 gap-4 max-w-4xl">
                    <span class="col-span-12 md:col-span-8 grid grid-cols-12 gap-4">
                        <ClientPitCombo
                            :clientId="Number(clientId)"
                            :pitId="Number(pitId)"
                            @update:clientId="
                                clientId = Number($event);
                                cradleId = -1;
                            "
                            @update:pitId="
                                pitId = Number($event);
                                cradleId = -1;
                            "
                        />
                    </span>
                </FieldGroup>
                <fieldset class="py-2 col-span-6 flex flex-col gap-x-10 2xl:gap-x-40">
                    <h2 class="text-xl font-bold mb-4">Estaciones</h2>
                    <FieldSelect
                        class="cradle-col"
                        title="Cradle"
                        fieldName="cradle"
                        placeholder="Seleccionar cradle"
                        endpointKey="id"
                        :endpointData="filteredCradles"
                        :data="cradleId"
                        @update:data="cradleId = $event"
                    />
                </fieldset>
            </form>
            <section v-if="cradleId < 0" class="cradle-slots">
                <div v-for="(slot, index) in cradleSlots" :key="index">
                    <div class="slot empty">
                        <span class="station-title">Estación {{ index + 1 }}</span>
                        <span class="copy">Seleccione cliente, etapa y cradle.</span>
                    </div>
                    <button class="calibrate">Calibrar E{{ index + 1 }}</button>
                </div>
            </section>
            <section v-else class="cradle-slots">
                <div v-for="(slot, index) in cradleSlots" :key="index">
                    <div class="slot" v-if="slot.boxId">
                        <span class="station-title">Estación {{ index + 1 }} - {{ slot.boxId }}</span>
                        <div class="cradle-status-wrapper">
                            <span class="cradle-status" @click.prevent="changeCradleSlotStatus(index, '1')">
                                <div class="icon-wrapper check" :class="[slot.status == '1' ? 'active' : '']">
                                    <Icon icon="Check" class="icon" v-if="slot.status == '1'" />
                                </div>
                                En ejecución
                            </span>
                            <span class="cradle-status" @click.prevent="changeCradleSlotStatus(index, '2')">
                                <div class="icon-wrapper pause" :class="[slot.status == '2' ? 'active' : '']">
                                    <Icon icon="Pause" type="outline" class="icon" v-if="slot.status == '2'" />
                                </div>
                                Pausa
                            </span>
                            <span class="cradle-status" @click.prevent="changeCradleSlotStatus(index, '3')">
                                <div class="icon-wrapper empty" :class="[slot.status == '3' ? 'active' : '']">
                                    <Icon icon="Minus" class="icon" v-if="slot.status == '3'" />
                                </div>
                                Vacía
                            </span>
                            <span class="cradle-status" @click.prevent="changeCradleSlotStatus(index, '0')">
                                <div class="icon-wrapper unavailable" :class="[slot.status == '0' ? 'active' : '']">
                                    <Icon icon="X" class="icon" v-if="slot.status == '0'" />
                                </div>
                                No disponible
                            </span>
                        </div>
                        <hr />
                        <div class="cradle-data-wrapper">
                            <span class="cradle-data">
                                <Icon icon="InformationCircle" class="icon" />
                                {{ slot.amount }}T peso remito
                            </span>
                            <!-- <span class="cradle-data">
                <Icon icon="InformationCircle" class="icon"/>
                15T peso actual
              </span> -->
                            <span class="cradle-data">
                                <Icon icon="InformationCircle" class="icon" />
                                Arena: {{ slot.sandType }}
                            </span>
                        </div>
                    </div>
                    <div class="slot without-box" v-else>
                        <span class="station-title">Estación {{ index + 1 }} - Sin caja</span>
                    </div>
                    <button class="calibrate">Calibrar E{{ index + 1 }}</button>
                </div>
            </section>
        </section>
        <footer class="p-4 space-x-8 flex justify-end items-center">
            <span class="mr-2 cursor-pointer" @click.prevent="requestEmptyBoxHandle">Solicitar retiro vacía</span>
            <PrimaryBtn type="submit" @click.prevent="completeStageHandle"> Finalizar </PrimaryBtn>
        </footer>
        <Modal type="off" :open="isModalVisible" @close="toggleModal" class="modal">
            <template #body>
                <Icon icon="check" class="mx-auto mb-4 w-16 h-16 text-green-400" />
                <p class="mb-4 text-lg text-gray-600">{{ modalMessage }}</p>
                <button @click.prevent="toggleModal" class="confirm-button mt-4 px-4 py-2 rounded-sm">
                    {{ modalButtonText }}
                </button>
            </template>
        </Modal>
    </Layout>
</template>

<script lang="ts">
    import { ref, computed, defineComponent, onMounted, watchEffect } from 'vue';
    import { useStore } from 'vuex';
    import { useRouter } from 'vue-router';
    import { useTitle } from '@vueuse/core';
    import Layout from '@/layouts/Main.vue';
    import GhostBtn from '@/components/ui/buttons/GhostBtn.vue';
    import CircularBtn from '@/components/ui/buttons/CircularBtn.vue';
    import PrimaryBtn from '@/components/ui/buttons/PrimaryBtn.vue';
    import Counter from '@/components/ui/Counter.vue';
    import DepositGrid from '@/components/depositDesign/Deposit.vue';
    import BoxCard from '@/components/depositDesign/DepositBoxCard.vue';
    import Modal from '@/components/modal/General.vue';
    import Icon from '@/components/icon/TheAllIcon.vue';

    import { Company, Pit, Warehouse, Box } from '@/interfaces/sandflow';
    import ClientPitCombo from '@/components/util/ClientPitCombo.vue';
    import FieldGroup from '@/components/ui/form/FieldGroup.vue';
    import FieldSelect from '@/components/ui/form/FieldSelect.vue';
    import FieldInput from '@/components/ui/form/FieldInput.vue';

    import axios from 'axios';
    const apiUrl = import.meta.env.VITE_API_URL || '/api';

    export default defineComponent({
        components: {
            CircularBtn,
            Counter,
            GhostBtn,
            Layout,
            PrimaryBtn,
            DepositGrid,
            BoxCard,
            ClientPitCombo,
            FieldGroup,
            FieldSelect,
            FieldInput,
            Modal,
            Icon,
        },
        setup() {
            useTitle('Operación en cradle <> Sandflow');
            const router = useRouter();
            const store = useStore();
            const instance = axios.create({
                baseURL: apiUrl,
            });

            const workOrders = ref([]);
            const clients = ref([] as Array<Company>);
            const pits = ref([] as Array<Pit>);
            const clientId = ref(-1);
            const pitId = ref(-1);
            const cradles = ref([]);
            const cradleId = ref(-1);
            const filteredCradles = ref([]);
            const cradleSlots = ref([{}, {}, {}, {}]);
            const modalMessage = ref('');
            const modalButtonText = ref('');
            const isModalVisible = ref(false);
            const selectedCradle = ref({});
            const sandTypes = ref([]);

            const changeCradleSlotStatus = async (slotIndex: Number, newStatus: String) => {
                await axios
                    .put(`${apiUrl}/cradle/${selectedCradle.value.id}`, selectedCradle.value)
                    .catch((err) => console.error(err));

                return (cradleSlots.value[slotIndex].status = newStatus);
            };

            const toggleModal = () => {
                return (isModalVisible.value = !isModalVisible.value);
            };

            const getWorkOrders = async () => {
                await axios
                    .get(`${apiUrl}/workOrder`)
                    .then((res) => {
                        workOrders.value = res.data.data;
                    })
                    .catch((err) => console.error(err));
            };

            const getCradles = async () => {
                await axios
                    .get(`${apiUrl}/cradle`)
                    .then((res) => {
                        cradles.value = res.data.data;
                    })
                    .catch((err) => console.error(err));
            };

            const getSandTypes = async () => {
                await axios
                    .get(`${apiUrl}/sand`)
                    .then((res) => {
                        sandTypes.value = res.data.data;
                    })
                    .catch((err) => {
                        console.error(err);
                    });
            };

            onMounted(async () => {
                await getWorkOrders();
                await getCradles();
                await getSandTypes();
            });

            const selectionsAreDone = computed(() => {
                if (clientId.value >= 0 && pitId.value >= 0) {
                    return true;
                }
            });

            const getFilteredCradles = () => {
                let cradlesToFilter = [];

                workOrders.value.forEach((workOrder) => {
                    workOrder.pits.forEach((pit) => {
                        if (pit.id == pitId.value) {
                            if (workOrder.operativeCradle !== '-1') cradlesToFilter.push(workOrder.operativeCradle);
                            if (workOrder.backupCradle !== '-1') cradlesToFilter.push(workOrder.backupCradle);
                        }
                    });
                });

                filteredCradles.value = cradles.value.filter((cradle) => {
                    if (cradlesToFilter.includes(cradle.id.toString())) return cradle;
                });
            };

            watchEffect(async () => {
                if (cradleId.value !== -1) {
                    selectedCradle.value = cradles.value.filter((cradle) => {
                        return cradle.id == cradleId.value;
                    })[0];
                    cradleSlots.value = selectedCradle.value.slots;
                    cradleSlots.value.forEach((slot) => {
                        const { sandTypeId } = slot;
                        let sandType = sandTypes.value.filter((sandType) => {
                            if (sandType.id == sandTypeId) return sandType;
                        })[0].type;
                        slot.sandType = sandType;
                    });
                }
                if (cradles.value.length > 0 && clientId.value >= 0 && pitId.value >= 0) {
                    await getFilteredCradles();
                }
            });

            // :: CLIENT
            const selectedClientName = computed(() => {
                return clientId.value >= 0 ? clients.value.find((pit) => pit.id === clientId.value).name : '';
            });
            // << CLIENT
            // :: PITS
            const selectedPitName = computed(() => {
                return pitId.value >= 0 ? pits.value.find((pit) => pit.id === pitId.value).name : '';
            });
            // << PITS
            const designName = computed(() => {
                return selectedClientName.value !== '' && selectedPitName.value !== ''
                    ? `${selectedPitName.value} - ${selectedClientName.value}`
                    : selectedClientName.value !== ''
                    ? selectedClientName.value
                    : selectedPitName.value !== ''
                    ? selectedPitName.value
                    : '';
            });

            const requestEmptyBoxHandle = () => {
                modalMessage.value = 'La solicitud de retiro de caja vacía fue enviada con éxito.';
                modalButtonText.value = 'Continuar';
                toggleModal();
            };

            const completeStageHandle = async () => {
                await axios
                    .put(`${apiUrl}/cradle/${selectedCradle.value.id}`, selectedCradle.value)
                    .then((res) => {
                        if (res.request.status == 200) {
                            modalMessage.value = '¡Etapa finalizada con éxito!';
                            modalButtonText.value = 'Próximo stage';
                            toggleModal();
                        }
                    })
                    .catch((err) => console.error(err));
            };

            return {
                clients,
                pits,
                clientId,
                cradleId,
                pitId,
                designName,
                requestEmptyBoxHandle,
                completeStageHandle,
                selectionsAreDone,
                cradles,
                workOrders,
                filteredCradles,
                cradleSlots,
                modalButtonText,
                modalMessage,
                toggleModal,
                isModalVisible,
                changeCradleSlotStatus,
            };
        },
    });
</script>

<style lang="scss" scoped>
    .cradle-col {
        @screen lg {
            width: 32%;
            max-width: 18rem;
        }
    }
    .cradle-data-wrapper,
    .cradle-status-wrapper {
        @apply flex flex-col text-left justify-between;
    }
    .cradle-status-wrapper {
        @apply mb-4;
    }
    .cradle-data-wrapper {
        @apply mt-4;
    }
    .cradle-status {
        @apply flex;

        & .icon-wrapper {
            border-radius: 100%;
            @apply mr-1 w-5 h-5 flex items-center justify-center;

            & .icon {
                @apply w-5 h-5;
            }

            &.check {
                @apply text-green-600 border-green-600 border-2;
            }

            &.pause {
                @apply mr-1;

                &.active {
                    transform: translate(-2px, -2px);
                    @apply text-yellow-600 w-6 h-6 mr-0;

                    & .icon {
                        @apply w-6 h-6;
                    }
                }
            }

            &.empty {
                @apply text-gray-600 border-gray-600 border-2;
            }

            &.unavailable {
                @apply text-red-600 border-red-600 border-2;
            }

            &:not(.active) {
                @apply border-gray-600 border-2;
            }
        }

        &:not(:first-child) {
            @apply mt-2;
        }
    }
    .cradle-data {
        @apply text-purple-600 flex items-center;

        & .icon {
            @apply mr-1 w-6 h-6 text-purple-600;
        }

        &:not(:first-child) {
            @apply mt-2;
        }
    }
    .modal {
        @apply bg-blue-500;

        .confirm-button {
            @apply bg-green-600 text-white;
        }
    }
    .cradle-slots {
        @apply pl-12 pr-12 pb-12 grid grid-cols-1 gap-4 justify-between items-center;

        @screen lg {
            @apply grid-cols-4;
        }

        .slot {
            min-height: 400px;
            @apply border-dashed border-2 border-second-300 rounded-lg p-4 cursor-pointer flex flex-col text-center;

            &:not(.empty) {
                @apply justify-between bg-gray-100 border-none;
            }

            &.without-box {
                @apply text-gray-100 bg-white justify-center items-center border-dashed border-2 border-second-300 cursor-default;

                .station-title {
                    @apply pb-0 pt-0;
                }
            }

            .station-title {
                @apply text-lg font-bold text-gray-400 pb-16 pt-4;
            }

            .copy {
                @apply text-lg;
            }
        }

        button.calibrate {
            @apply rounded-md bg-purple-300 text-white mt-4 w-full p-2;
        }
    }
    .section-tab {
        @apply py-2 border-b-4 w-full font-bold text-gray-400 flex justify-center items-center gap-2;
    }
    .section-tab.active {
        @apply border-main-500 text-main-500;
    }
    .input {
        @apply w-full px-3 py-2 rounded focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-second-300 mt-1 flex shadow-sm;
    }
    span.select-category {
        @apply flex items-center;

        & .icon {
            @apply w-5 h-5 mr-2;
        }

        &:not(.full):not(.aisle) {
            cursor: pointer;
        }

        &.aisle {
            @apply text-second-300 text-second-300;
        }
        &.fina {
            @apply text-orange-600 text-orange-600;
        }
        &.gruesa {
            @apply text-green-600 text-green-600;
        }
        &.cortada {
            @apply text-blue-600 text-blue-600;
        }
        &.blocked {
            @apply text-second-800 text-second-800;
        }
        &.empty {
            @apply text-second-200 text-second-200;
        }
    }
    // input:read-only {
    //   @apply bg-second-200 border cursor-not-allowed;
    // }
    fieldset:not(:last-of-type) {
        @apply border-b pb-6;
    }
    label:not(.type-select) {
        @apply flex flex-col;
        span {
            @apply text-sm;
        }
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
    .type-select {
        @apply flex items-center gap-2;
    }

    .available-box {
        @apply flex items-center mb-2;

        .radio-button {
            @apply border border-gray-800 w-5 h-5 cursor-pointer rounded-full;
            &.active {
                @apply relative;
                &::after {
                    content: '';
                    @apply absolute inset-0 w-3 h-3 rounded-full m-auto bg-gray-900;
                    animation: pop_in 150ms ease-out;
                }
            }
        }
        .box-id {
            @apply mx-2 flex items-center;
            & > input {
                @apply border-none inline p-0.5 rounded w-20 hover:bg-gray-200 focus:ring-main-500 focus:border-main-500;
            }
        }
    }
    @keyframes pop_in {
        from {
            @apply transform scale-0;
        }
        90% {
            @apply transform scale-110;
        }
        to {
            @apply transform scale-100;
        }
    }
</style>
