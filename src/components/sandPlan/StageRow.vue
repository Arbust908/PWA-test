<template>
    <tr>
        <td class="text-gray-500 px-3 text-center py-4 text-lg">{{ pos }} - {{ stagesAmount }}</td>
        <template v-if="editing === Number(stage[editingKey])">
            <td :id="`sandType${stage.id}`" class="typeWrap">
                <FieldSelect
                    v-model:data="stage.sandId1"
                    field-name="sandType1"
                    placeholder="Seleccionar"
                    :endpoint-data="sandTypes1"
                    endpoint-key="type"
                />
                <FieldWithSides
                    v-model:data="stage.quantity1"
                    class="mt-2"
                    field-name="sandQuantity1"
                    placeholder="0 t"
                    type="number"
                    :max-number-amount="9999"
                    :post="{ title: '0', value: 't' }"
                />
            </td>
            <td class="typeWrap">
                <FieldSelect
                    v-model:data="stage.sandId2"
                    field-name="sandType2"
                    placeholder="Seleccionar"
                    :endpoint-data="sandTypes2"
                    endpoint-key="type"
                />
                <FieldWithSides
                    v-model:data="stage.quantity2"
                    class="mt-2"
                    field-name="sandQuantity2"
                    placeholder="0 t"
                    type="number"
                    :max-number-amount="9999"
                    :post="{ title: '0', value: 't' }"
                />
            </td>
            <td class="typeWrap">
                <FieldSelect
                    v-model:data="stage.sandId3"
                    field-name="sandType3"
                    placeholder="Seleccionar"
                    :endpoint-data="sandTypes3"
                    endpoint-key="type"
                />
                <FieldWithSides
                    v-model:data="stage.quantity3"
                    class="mt-2"
                    field-name="sandQuantity3"
                    placeholder="0 t"
                    type="number"
                    :max-number-amount="9999"
                    :post="{ title: '0', value: 't' }"
                />
            </td>
            <td class="typeWrap">
                <FieldSelect
                    v-model:data="stage.sandId4"
                    field-name="sandType4"
                    placeholder="Seleccionar"
                    :endpoint-data="sandTypes4"
                    endpoint-key="type"
                />
                <FieldWithSides
                    v-model:data="stage.quantity4"
                    class="mt-2"
                    field-name="sandQuantity4"
                    placeholder="0 t"
                    type="number"
                    :max-number-amount="9999"
                    :post="{ title: '0', value: 't' }"
                />
            </td>
        </template>
        <template v-else>
            <td class="text-gray-500 px-3 py-4 whitespace-nowrap text-sm text-center">
                <template v-if="stage.sandId1 > 0 || stage.quantity1 > 0">
                    <p v-if="stage.sandId1 > 0">
                        {{ getSand(Number(stage.sandId1))?.type }}
                    </p>
                    <p v-else>Tipo sin seleccionar</p>
                    <p v-if="stage.quantity1 > 0">{{ stage.quantity1 }}t</p>
                    <p v-else>0 t</p>
                </template>
                <template v-else>
                    <p>No hay arena</p>
                </template>
            </td>
            <td class="text-gray-500 px-3 py-4 whitespace-nowrap text-sm text-center">
                <template v-if="stage.sandId2 > 0 || stage.quantity2 > 0">
                    <p v-if="stage.sandId2 > 0">
                        {{ getSand(Number(stage.sandId2))?.type }}
                    </p>
                    <p v-else>Tipo sin seleccionar</p>
                    <p v-if="stage.quantity2 > 0">{{ stage.quantity2 }}t</p>
                    <p v-else>0 t</p>
                </template>
                <template v-else>
                    <p>No hay arena</p>
                </template>
            </td>
            <td class="text-gray-500 px-3 py-4 whitespace-nowrap text-sm text-center">
                <template v-if="stage.sandId3 > 0 || stage.quantity3 > 0">
                    <p v-if="stage.sandId3 > 0">
                        {{ getSand(Number(stage.sandId3))?.type }}
                    </p>
                    <p v-else>Tipo sin seleccionar</p>
                    <p v-if="stage.quantity3 > 0">{{ stage.quantity3 }}t</p>
                    <p v-else>0 t</p>
                </template>
                <template v-else>
                    <p>No hay arena</p>
                </template>
            </td>
            <td class="text-gray-500 px-3 py-4 whitespace-nowrap text-sm text-center">
                <template v-if="stage.sandId4 > 0 || stage.quantity4 > 0">
                    <p v-if="stage.sandId4 > 0">
                        {{ getSand(Number(stage.sandId4))?.type }}
                    </p>
                    <p v-else>Tipo sin seleccionar</p>
                    <p v-if="stage.quantity4 > 0">{{ stage.quantity4 }}t</p>
                    <p v-else>0 t</p>
                </template>
                <template v-else>
                    <p>No hay arena</p>
                </template>
            </td>
        </template>
        <td class="text-gray-500 px-3 py-4 whitespace-nowrap font-bold text-center">
            {{ totalWheight }}t
            <!-- Mecanica de x/total para ir agregando / descontando -->
        </td>

        <td class="p-0 table--action z-50">
            <DropdownBtn :actions="actions" :item="stage">
                <CircularBtn size="xs" class="even">
                    <Icon icon="DotsVertical" type="outlined" class="w-6 h-6 icon text-gray-800" />
                </CircularBtn>
            </DropdownBtn>
        </td>
    </tr>
</template>

<script setup lang="ts">
    import Icon from '@/components/icon/TheAllIcon.vue';
    import FieldSelect from '@/components/ui/form/FieldSelect.vue';
    import FieldWithSides from '@/components/ui/form/FieldWithSides.vue';
    import { Sand } from '@/interfaces/sandflow';
    import CircularBtn from '@/components/ui/buttons/CircularBtn.vue';
    import DropdownBtn from '@/components/ui/buttons/DropdownBtn.vue';
    import { useApi } from '@/helpers/useApi';

    const props = defineProps({
        actions: {
            type: Array,
            default: () => [],
        },
        stage: {
            type: Object,
            required: true,
        },
        editing: {
            type: Number,
            required: true,
        },
        sands: {
            type: Array,
            required: true,
        },
        pos: {
            type: Number,
            required: true,
        },
        // ESTO ES TEMPÖRAL
        // ESTO PASARIA A SER InnerID
        editingKey: {
            type: String,
            default: 'id',
        },
        stagesAmount: {
            type: Number,
            default: 0,
        },
    });
    const emit = defineEmits(['editStage', 'saveStage', 'duplicateStage', 'deleteStage']);
    const { stage, editing, sands, pos, editingKey, stagesAmount } = toRefs(props);
    stage.value.stage = pos.value;

    const { read: getSands } = useApi('/sand');

    const backupSandTypes = getSands();

    const sandTypes1 = computed(() => {
        return backupSandTypes?.value?.filter((sand) => {
            return (
                sand.id !== stage.value.sandId2 && sand.id !== stage.value.sandId3 && sand.id !== stage.value.sandId4
            );
        });
    });

    const sandTypes2 = computed(() => {
        return backupSandTypes?.value?.filter((sand) => {
            return (
                sand.id !== stage.value.sandId1 && sand.id !== stage.value.sandId3 && sand.id !== stage.value.sandId4
            );
        });
    });

    const sandTypes3 = computed(() => {
        return backupSandTypes?.value?.filter((sand) => {
            return (
                sand.id !== stage.value.sandId1 && sand.id !== stage.value.sandId2 && sand.id !== stage.value.sandId4
            );
        });
    });

    const sandTypes4 = computed(() => {
        return backupSandTypes?.value?.filter((sand) => {
            return (
                sand.id !== stage.value.sandId1 && sand.id !== stage.value.sandId2 && sand.id !== stage.value.sandId3
            );
        });
    });

    const totalWheight = computed(() => {
        return (
            Number(stage.value.quantity1) +
                Number(stage.value.quantity2) +
                Number(stage.value.quantity3) +
                Number(stage.value.quantity4) || 0
        );
    });
    const getSand = (sandId: number) => {
        return (
            sands.value.find((sand: Sand) => {
                return Number(sand.id) === sandId;
            }) || { type: '' }
        );
    };

    const editStage = () => {
        emit('editStage', stage.value);
    };
    const saveStage = () => {
        emit('saveStage', stage.value);
    };
    const duplicateStage = () => {
        emit('duplicateStage', stage.value);
    };
    const deleteStage = () => {
        emit('deleteStage', stage.value);
    };

    const actions = [
        {
            label: 'Editar',
            hide: () => {
                return !(editing.value === Number(stage.value[editingKey.value]));
            },
            callback: () => {
                editStage();
            },
        },
        {
            label: 'Guardar',
            hide: () => {
                return editing.value === Number(stage.value[editingKey.value]);
            },
            callback: () => {
                saveStage();
            },
        },
        {
            label: 'Clonar',
            callback: () => {
                duplicateStage();
            },
        },
        {
            label: 'Eliminar',
            hide: () => {
                return !(stagesAmount.value < 2);
            },
            callback: () => {
                deleteStage();
            },
        },
    ];
</script>

<style lang="scss" scoped>
    .typeWrap {
        @apply text-gray-500 px-3 py-4 whitespace-nowrap text-sm max-w-[10rem];
    }
    .action {
        @apply text-gray-600 p-2;
    }
    .action.duplicate:not(:disabled):hover {
        @apply text-green-700;
    }
    .action.edit:not(:disabled):hover {
        @apply text-blue-700;
    }
    .action.delete:not(:disabled):hover {
        @apply text-red-700;
    }
    .action:disabled {
        @apply text-gray-400;
    }

    @import '@/assets/table.scss';
</style>
