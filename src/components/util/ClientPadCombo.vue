<template>
    <div :class="sharedClasses">
        <FieldSelect
            v-if="clients.length > 0"
            v-model:data="idOfClient"
            field-name="client"
            placeholder="Seleccionar cliente"
            title="Cliente"
            require-validation
            :endpoint-data="clients"
            :is-disabled="isDisabled"
            :select-class="useFirstClient"
            @click="useFirstClient = true"
        />
        <FieldLoading v-else />
        <InvalidInputLabel v-if="idOfClient == -1 && useFirstClient === true" validation-type="empty" />
    </div>
    <div :class="sharedClasses">
        <FieldSelect
            v-if="pads@apply ;.length > 0"
            v-model:data="idOfPit"
            field-name="pad"
            placeholder="Seleccionar PAD"
            title="PAD"
            require-validation
            :endpoint-data="pads"
            :is-disabled="isDisabled"
            :select-class="useFirstPad"
            @click="useFirstPad = true"
        />
        <FieldLoading v-else />
        <InvalidInputLabel v-if="idOfPad == -1 && useFirstPad === true" validation-type="empty" />
    </div>
</template>

<script setup lang="ts">
    import { Ref } from 'vue';
    import { Pit, Company, WorkOrder } from '@/interfaces/sandflow';
    import { useApi } from '@/helpers/useApi';
    import { getWorkOrders } from '@/helpers/useGetEntities';

    import FieldSelect from '@/components/ui/form/FieldSelect.vue';
    import FieldLoading from '@/components/ui/form/FieldLoading.vue';
    import InvalidInputLabel from '@/components/ui/InvalidInputLabel.vue';

    const props = defineProps({
        clientId: {
            type: Number,
            required: true,
        },
        padId: {
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
            default: null,
        },
        firstFilter: {
            type: Boolean,
            default: false,
        },
        fromId: {
            type: Boolean,
            default: false,
        },
    });
    const emit = defineEmits([
        'update:pitId',
        'update:woId',
        'update:workOrders',
        'update:firstFilter',
        'update:clientId',
    ]);
    const { clientId: idOfClient, padId: idOfPad, firstFilter: isFirstTime } = useVModels(props, emit);
    const { read: getClients } = useApi('/company');
    const backupClients = getClients() as Ref<Array<Company>>;
    const clients = ref([] as Array<Company>);
    watch(backupClients, (newVal) => {
        if (newVal) {
            clients.value = newVal;
        }
    });

    const { read: getWorkorder } = useApi('/workOrder');
    const backupWorkorder = getWorkorder() as Ref<Array<WorkOrder>>;
    const workOrders = ref([] as Array<WorkOrder>);
    watch(backupWorkorder, (newVal) => {
        if (newVal) {
            pits.value = newVal;
        }
    });

    const filterWorkordersByClient = (theClientId: number) => {
        if (firstFilter.value) {
            idOfPit.value = -1;
        }
        firstFilter.value = true;
        pits.value = [];
        setTimeout(() => {
            const proxyPitId = idOfPit.value ? idOfPit.value : 0;
            const waiter = setInterval(() => {
                if (backupPits.value) {
                    pits.value = backupPits.value.filter((pit: Pit) => {
                        return pit.companyId == theClientId;
                    });

                    if (pits.value.length === 1) {
                        idOfPit.value = pits.value[0].id || -1;
                    } else if (pits.value.length <= 0) {
                        pits.value = [{ name: 'No hay pozos', id: -1 }];
                        idOfPit.value = -1;
                    } else {
                        idOfPit.value = proxyPitId;
                    }
                    clearInterval(waiter);
                }
            }, 1000);
        }, 100);
    };
    const selectClientByPit = (thePitId: number) => {
        const curPit = backupPits.value?.find((pit: Pit) => {
            return pit.id == thePitId;
        });

        if (curPit) {
            setTimeout(() => {
                const selectedClientId =
                    backupClients.value?.find((client: Company) => {
                        return client.id == curPit.companyId;
                    }).id || -1;

                if (selectedClientId >= 0) {
                    idOfClient.value = Number(selectedClientId) || -1;
                } else {
                    idOfClient.value = -1;
                }
            }, 100);
        }
    };
    watch(idOfPit, (newVal) => {
        if (newVal >= 0) {
            selectClientByPit(newVal);
        }
    });
    watch(idOfClient, (newVal) => {
        if (newVal >= 0) {
            filterPitsByClient(newVal);
        }
    });
    const firstFilter = ref(false);

    const padFilter = async (filterValue: number) => {
        workOrders.value = await getWorkOrders();

        if (filterValue !== -1) {
            const filterClientByPad = workOrders.value.filter((workOrder) => workOrder.id === filterValue);
            console.log(workOrders.value);
            idOfClient.value = Number(filterClientByPad[0].client);

            if (props.fromId) {
                firstFilter.value = true;
            }
        }
    };

    watch(idOfWorkOrder, async (newVal) => {
        props.pads && (await padFilter(newVal));
    });

    onMounted(async () => {
        props.pads && (await padFilter(idOfWorkOrder.value));

        if (props.fromId === true) {
            firstFilter.value = true;
        }
    });

    const useFirstClient = ref(false);
    watch(useFirstClient, (newVal) => {
        useFirstClient.value = newVal;
    });
    const useFirstPit = ref(false);
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
