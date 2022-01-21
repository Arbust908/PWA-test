<template>
    <div :class="sharedClasses">
        <FieldSelect
            v-if="clients.length > 0"
            field-name="client"
            placeholder="Seleccionar cliente"
            title="Cliente"
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
    <div :class="sharedClasses">
        <FieldSelect
            v-if="pits.length > 0"
            field-name="pit"
            placeholder="Seleccionar pozo"
            title="Pozo"
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
</template>

<script lang="ts">
    import { defineComponent, ref, watch } from 'vue';
    import { useVModels } from '@vueuse/core';
    import { Pit, Company } from '@/interfaces/sandflow';
    import { useApi } from '@/helpers/useApi';

    import FieldSelect from '@/components/ui/form/FieldSelect.vue';
    import FieldLoading from '@/components/ui/form/FieldLoading.vue';
    import InvalidInputLabel from '@/components/ui/InvalidInputLabel.vue';

    export default defineComponent({
        name: 'ClientPitCombo',
        components: {
            FieldSelect,
            FieldLoading,
            InvalidInputLabel,
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
        },
        setup(props, { emit }) {
            const { clientId, pitId } = useVModels(props, emit);
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
