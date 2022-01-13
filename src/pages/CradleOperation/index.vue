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
                            :client-id="Number(clientId)"
                            :pit-id="Number(pitId)"
                            validation-type="empty"
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
                        v-model:data="cradleId"
                        class="cradle-col"
                        title="Cradle"
                        field-name="cradle"
                        placeholder="Seleccionar cradle"
                        endpoint-key="name"
                        :endpoint-data="filteredCradles"
                    />
                </fieldset>
            </form>
            <section class="cradle-slots">
                <CradleSlot
                    v-for="(slot, index) in cradleSlots"
                    :key="index"
                    :cradles="cradles"
                    :index="index"
                    :cradle-slots="cradleSlots"
                    :box="slot"
                    @selected-slots="SelectSlot(slot)"
                    @change-cradle-slot-status="changeCradleSlotStatus($event[0], $event[1])"
                />
            </section>
        </section>
        <!-- *** -->
        <footer class="mt-8 space-x-3 flex justify-end items-center">
            <PrimaryBtn btn="wide" type="submit" @click.prevent="requestEmptyBoxHandle"> Solicitar retiro </PrimaryBtn>
        </footer>
        <SuccessModal :open="isModalVisible" :title="ModalText" @main="confirmModal" @close="confirmModal" />
    </Layout>
</template>

<script lang="ts">
    import { ref, computed, defineComponent, onMounted, watchEffect } from 'vue';
    import { useTitle } from '@vueuse/core';
    import Layout from '@/layouts/Main.vue';
    import PrimaryBtn from '@/components/ui/buttons/PrimaryBtn.vue';
    import SecondaryBtn from '@/components/ui/buttons/SecondaryBtn.vue';
    import Modal from '@/components/modal/General.vue';
    import SuccessModal from '@/components/modal/SuccessModal.vue';
    import Icon from '@/components/icon/TheAllIcon.vue';

    import { Company, Pit, QueueItem } from '@/interfaces/sandflow';
    import ClientPitCombo from '@/components/util/ClientPitCombo.vue';
    import FieldGroup from '@/components/ui/form/FieldGroup.vue';
    import FieldSelect from '@/components/ui/form/FieldSelect.vue';
    import CradleSlot from '@/components/Cradle/cradleSlot.vue';
    import { getOrder, QueueTransactions } from '@/helpers/useQueueItem';

    import axios from 'axios';
    import router from '@/router';

    const apiUrl = import.meta.env.VITE_API_URL || '/api';

    export default defineComponent({
        components: {
            SecondaryBtn,
            Layout,
            PrimaryBtn,
            ClientPitCombo,
            FieldGroup,
            FieldSelect,
            Modal,
            SuccessModal,
            Icon,
            CradleSlot,
        },
        setup() {
            useTitle('Operación en cradle <> Sandflow');

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
            const openSuccess = ref(false);
            const ModalText = 'La solicitud de retiro de cajas fue enviada con éxito';
            const selectedSlots = ref([]);

            const changeCradleSlotStatus = async (slotIndex: number, newStatus: string) => {
                await axios
                    .put(`${apiUrl}/cradle/${selectedCradle.value.id}`, selectedCradle.value)
                    .catch((err) => console.error(err));
                console.log('selectedCradleCheckbox', selectedCradle.value);

                return (cradleSlots.value[slotIndex].status = newStatus);
            };

            const SelectSlot = (slot: any) => {
                let hasSlots = selectedSlots.value.find((insideSlot) => {
                    return insideSlot.id === slot.id;
                });

                if (hasSlots) {
                    selectedSlots.value = selectedSlots.value.filter((insideSlot) => {
                        return insideSlot.id !== slot.id;
                    });
                } else {
                    selectedSlots.value.push(slot);
                }
            };
            const routerGo = () => {
                router.go(0);
            };

            const confirmModal = () => {
                return toggleModal() && setTimeout(routerGo, 2000);
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

                return false;
            });

            const getFilteredCradles = () => {
                let cradlesToFilter = [];

                workOrders.value.forEach((workOrder) => {
                    workOrder.pits.forEach((pit) => {
                        if (pit.id == pitId.value) {
                            if (workOrder.operativeCradle !== '-1') {
                                cradlesToFilter.push(workOrder.operativeCradle);
                            }

                            if (workOrder.backupCradle !== '-1') {
                                cradlesToFilter.push(workOrder.backupCradle);
                            }
                        }
                    });
                });

                filteredCradles.value = cradles.value.filter((cradle) => {
                    if (cradlesToFilter.includes(cradle.id.toString())) {
                        return cradle;
                    }
                });
            };

            watchEffect(async () => {
                if (cradleId.value !== -1) {
                    console.log('cradleId', cradleId.value);

                    selectedCradle.value = cradles.value.filter((cradle) => {
                        console.log('cradle', cradle);

                        return cradle.id == cradleId.value;
                    })[0];

                    cradleSlots.value = selectedCradle.value.slots;

                    cradleSlots.value.forEach((slot) => {
                        const { sandTypeId } = slot;
                        console.log('sandTypeId', { sandTypeId });
                        console.log('slot', slot);
                        let sandType = sandTypes.value.find((sandType) => {
                            console.log('sandType', sandType);

                            return sandType.id == sandTypeId;
                        });

                        if (sandType) {
                            sandType = sandType.type;
                        }
                        console.log('sandType', sandType);

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

            const defaultQueueItem: QueueItem = {
                sandOrderId: -1,
                pitId: -1,
                origin: '',
                destination: '',
                status: 0,
                order: -1,
            };

            const requestEmptyBoxHandle = () => {
                selectedSlots.value.forEach((selectedSlot) => {
                    const newQI = { ...defaultQueueItem };
                    newQI.status = 10;
                    newQI.origin = selectedSlot?.location?.where_origin;
                    newQI.pitId = pitId.value;
                    newQI.sandOrderId = selectedSlot.id;
                    console.log('selectedSlot', selectedSlot);
                    createQueueItem(newQI);
                });
            };

            const createQueueItem = async (queueItem: QueueItem) => {
                await axios
                    .post(`${apiUrl}/queueItem/`, queueItem)
                    .then((response) => {
                        if (response.request.status == 200) {
                            console.log(queueItem, 'se guardo bien');
                            confirmModal();
                        }
                    })
                    .catch((err) => console.error(err));
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
                SuccessModal,
                openSuccess,
                ModalText,
                selectedCradle,
                SelectSlot,
                confirmModal,
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
    .ring {
        @apply ring-inset ring-green-600;
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
            &.test {
                @apply border-8 border-green-600;
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
