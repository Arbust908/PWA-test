<template>
    <div :class="sharedClasses">
        <FieldSelect
            v-if="clients.length > 0"
            field-name="client"
            placeholder="Seleccionar cliente"
            title="Cliente"
            require-validation
            :endpoint-data="clients"
            :data="clientId"
            :is-disabled="isDisabled"
            :select-class="useFirstClient"
            @update:data="clientId = $event"
            @click="useFirstClient = true"
        />
        <FieldLoading v-else />
        <InvalidInputLabel v-if="clientId == -1 && useFirstClient === true" validation-type="empty" />
    </div>
    <div v-if="!pads" :class="sharedClasses">
        <FieldSelect
            v-if="pits.length > 0"
            field-name="pit"
            placeholder="Seleccionar pozo"
            title="Pozo"
            require-validation
            :endpoint-data="pits"
            :data="pitId"
            :is-disabled="isDisabled"
            :select-class="useFirstPit"
            @update:data="pitId = $event"
            @click="useFirstPit = true"
        />
        <FieldLoading v-else />
        <InvalidInputLabel v-if="pitId == -1 && useFirstPit === true" validation-type="empty" />
    </div>
    <div v-if="pads" :class="sharedClasses">
        <PadSelector
            :client-id="clientId"
            require-validation
            v-model:woId="woId"
            v-model:work-orders="workOrders"
            v-model:first-filter="firstFilter"
            :is-disabled="isDisabled"
        />
    </div>
</template>

<script lang="ts">
    import { defineComponent, ref, watch } from 'vue';
    import { useVModels } from '@vueuse/core';
    import { Pit, Company } from '@/interfaces/sandflow';
    import { useApi } from '@/helpers/useApi';
    import { getWorkOrders } from '@/helpers/useGetEntities';

    import FieldSelect from '@/components/ui/form/FieldSelect.vue';
    import FieldLoading from '@/components/ui/form/FieldLoading.vue';
    import InvalidInputLabel from '@/components/ui/InvalidInputLabel.vue';
    import PadSelector from '@/components/util/PadSelector.vue';

    export default defineComponent({
        name: 'ClientPitCombo',
        components: {
            FieldSelect,
            FieldLoading,
            InvalidInputLabel,
            PadSelector,
        },
        props: {
            clientId: {
                type: Number,
                required: true,
            },
            pitId: {
                type: Number,
                required: true,
            },
            isDisabled: {
                type: Boolean,
                default: false,
            },
            sharedClasses: {
                type: String,
                default: 'col-span-full md:col-span-6',
            },
            validationType: {
                type: String,
                required: false,
            },
            pads: {
                type: Boolean,
                default: false,
            },
            woId: {
                type: Number,
                required: false,
            },
            workOrders: {
                type: Array,
                default: [],
            },
            firstFilter: {
                type: Boolean,
                default: false,
            },
            fromId: {
                type: Boolean,
                default: false,
            },
        },
        setup(props, { emit }) {
            const { clientId, pitId, woId } = useVModels(props, emit);
            const { read: getClients } = useApi('/company');
            const backupClients = getClients();
            const clients = ref([] as Array<Company>);
            watch(backupClients, (newVal) => {
                if (newVal) {
                    clients.value = newVal;
                }
            });

            const { read: getPits } = useApi('/pit');
            const backupPits = getPits();
            const pits = ref([] as Array<Pit>);
            watch(backupPits, (newVal) => {
                if (newVal) {
                    pits.value = newVal;
                }
            });

            const filterPitsByClient = (idOfClient: number) => {
                if (firstFilter.value) {
                    pitId.value = -1;
                }
                firstFilter.value = true;
                pits.value = [];
                setTimeout(() => {
                    const proxyPitId = pitId.value ? pitId.value : 0;
                    const waiter = setInterval(() => {
                        if (backupPits.value) {
                            pits.value = backupPits.value.filter((pit: Pit) => {
                                return pit.companyId == idOfClient;
                            });

                            if (pits.value.length === 1) {
                                pitId.value = pits.value[0].id || -1;
                            } else if (pits.value.length <= 0) {
                                pits.value = [{ name: 'No hay pozos', id: -1 }];
                                pitId.value = -1;
                            } else {
                                pitId.value = proxyPitId;
                            }
                            clearInterval(waiter);
                        }
                    }, 1000);
                }, 100);
            };
            const selectClientByPit = (idOfPit: number) => {
                const curPit = backupPits.value?.find((pit: Pit) => {
                    return pit.id == idOfPit;
                });

                if (curPit) {
                    setTimeout(() => {
                        const selectedClientId =
                            backupClients.value.find((client: Company) => {
                                return client.id == curPit.companyId;
                            }).id || -1;

                        if (selectedClientId >= 0) {
                            clientId.value = Number(selectedClientId) || -1;
                        } else {
                            clientId.value = -1;
                        }
                    }, 100);
                }
            };
            watch(pitId, (newVal) => {
                if (newVal >= 0) {
                    selectClientByPit(newVal);
                }
            });
            watch(clientId, (newVal) => {
                if (newVal >= 0) {
                    filterPitsByClient(newVal);
                }
            });
            const workOrders = ref([]);
            const firstFilter = ref(false);

            const padFilter = async (filterValue: number) => {
                workOrders.value = await getWorkOrders();

                if (filterValue !== -1) {
                    const filterClientByPad = workOrders.value.filter((workOrder) => workOrder.id === filterValue);
                    console.log(workOrders.value);
                    clientId.value = Number(filterClientByPad[0].client);

                    if (props.fromId) {
                        firstFilter.value = true;
                    }
                }
            };

            watch(woId, async (newVal) => {
                await padFilter(newVal);
            });

            onMounted(async () => {
                await padFilter(woId.value);

                if (props.fromId === true) {
                    firstFilter.value = true;
                }
            });

            const useFirstClient = ref(false);
            watch(useFirstClient, (newVal) => {
                useFirstClient.value = newVal;
            });
            const useFirstPit = ref(false);

            return {
                clientId,
                pitId,
                clients,
                backupClients,
                pits,
                backupPits,
                InvalidInputLabel,
                useFirstClient,
                useFirstPit,
                woId,
                workOrders,
                firstFilter,
            };
        },
    });
</script>

<style lang="scss" scoped>
    .unselected {
        @apply border-red-500;
    }
    .unselected option {
        @apply border-red-500;
    }
    .unselected option:first-child {
        @apply border-red-500;
    }
    .client {
        @apply border-red-500;
    }
</style>
