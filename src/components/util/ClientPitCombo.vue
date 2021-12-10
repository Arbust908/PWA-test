<template class="gap-2">
    <FieldSelect
        v-if="clients.length > 0"
        :class="sharedClasses"
        field-name="client"
        placeholder="Seleccionar cliente"
        title="Cliente"
        :endpoint-data="clients"
        :data="clientId"
        :is-disabled="isDisabled"
        @update:data="clientId = $event"
    />
    <FieldLoading v-else :class="sharedClasses" />
    <FieldSelect
        v-if="pits.length > 0"
        :class="sharedClasses"
        field-name="pit"
        placeholder="Seleccionar pozo"
        title="Pozo"
        :endpoint-data="pits"
        :data="pitId"
        :is-disabled="isDisabled"
        @update:data="pitId = $event"
    />
    <FieldLoading v-else :class="sharedClasses" />
</template>

<script lang="ts">
    import { defineComponent, ref, watch } from 'vue';
    import { Pit, Company } from '@/interfaces/sandflow';
    import { useApi } from '@/helpers/useApi';
    import { useVModels } from '@vueuse/core';

    import FieldSelect from '@/components/ui/form/FieldSelect.vue';
    import FieldLoading from '@/components/ui/form/FieldLoading.vue';

    export default defineComponent({
        name: 'ClientPitCombo',
        components: {
            FieldSelect,
            FieldLoading,
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
                const curPit = backupPits.value.find((pit: Pit) => {
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

            return {
                clientId,
                pitId,
                clients,
                backupClients,
                pits,
                backupPits,
            };
        },
    });
</script>
