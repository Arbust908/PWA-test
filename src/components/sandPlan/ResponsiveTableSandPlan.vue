<template>
    <table>
        <tr>
            <th class="text-left px-6 py-4 w-3/6">
                <span>Etapa </span>
                <span>{{ pos }} - {{ stagesAmount }}</span>
            </th>
            <td class="w-3/6">
                <div class="flex justify-end w-28 ml-auto my-0">
                    <DropdownBtn :actions="actions" :item="stage">
                        <CircularBtn size="sm" class="even">
                            <Icon icon="DotsVertical" type="outlined" class="w-6 h-6 icon text-gray-800" />
                        </CircularBtn>
                    </DropdownBtn>
                </div>
            </td>
        </tr>

        <tr v-if="editing === Number(stage.id)">
            <th class="head">Arena A</th>
            <td class="typeWrap">
                <FieldSelect
                    field-name="sandType1"
                    placeholder="Seleccionar"
                    :endpoint-data="sandTypes1"
                    endpoint-key="type"
                    :data="stage.sandId1"
                    @update:data="stage.sandId1 = $event"
                />
            </td>
        </tr>
        <tr v-else>
            <th class="head">Arena A</th>
            <td v-if="stage.sandId1 > 0 || stage.quantity1 > 0" class="td">
                {{ getSand(Number(stage.sandId1))?.type }} / {{ stage.quantity1 }}t
            </td>
            <td v-else class="td">No hay arena</td>
        </tr>
        <tr v-if="editing === Number(stage.id)">
            <th class="head">Cantidad</th>
            <td>
                <FieldWithSides
                    field-name="sandQuantity1"
                    placeholder="0 t"
                    type="number"
                    :post="{ title: '0', value: 't' }"
                    :data="stage.quantity1"
                    @update:data="stage.quantity1 = $event"
                />
            </td>
        </tr>

        <div v-if="editing === Number(stage.id)" class="separador ml-6 mt-6 mb-6" />
        <tr v-if="editing === Number(stage.id)">
            <th class="head">Arena B</th>
            <td>
                <FieldSelect
                    field-name="sandType2"
                    placeholder="Seleccionar"
                    :endpoint-data="sandTypes2"
                    endpoint-key="type"
                    :data="stage.sandId2"
                    @update:data="stage.sandId2 = $event"
                />
            </td>
        </tr>
        <tr v-else>
            <th class="head">Arena B</th>
            <td v-if="stage.sandId2 > 0 || stage.quantity2 > 0" class="td">
                {{ getSand(Number(stage.sandId2))?.type }} / {{ stage.quantity2 }}t
            </td>
            <td v-else class="td">No hay arena</td>
        </tr>
        <tr v-if="editing === Number(stage.id)">
            <th class="head">Cantidad</th>
            <td>
                <FieldWithSides
                    field-name="sandQuantity2"
                    placeholder="0 t"
                    type="number"
                    :post="{ title: '0', value: 't' }"
                    :data="stage.quantity2"
                    @update:data="stage.quantity2 = $event"
                />
            </td>
        </tr>

        <div v-if="editing === Number(stage.id)" class="separador ml-6 mt-6 mb-6" />
        <tr v-if="editing === Number(stage.id)">
            <th class="head">Arena C</th>
            <td>
                <FieldSelect
                    field-name="sandType3"
                    placeholder="Seleccionar"
                    :endpoint-data="sandTypes3"
                    endpoint-key="type"
                    :data="stage.sandId3"
                    @update:data="stage.sandId3 = $event"
                />
            </td>
        </tr>
        <tr v-else>
            <th class="head">Arena C</th>
            <td v-if="stage.sandId3 > 0 || stage.quantity3 > 0" class="td">
                {{ getSand(Number(stage.sandId3))?.type }} / {{ stage.quantity3 }}t
            </td>
            <td v-else class="td">No hay arena</td>
        </tr>
        <tr v-if="editing === Number(stage.id)">
            <th class="head">Cantidad</th>
            <td>
                <FieldWithSides
                    field-name="sandQuantity3"
                    placeholder="0 t"
                    type="number"
                    :post="{ title: '0', value: 't' }"
                    :data="stage.quantity3"
                    @update:data="stage.quantity3 = $event"
                />
            </td>
        </tr>

        <div v-if="editing === Number(stage.id)" class="separador ml-6 mt-6 mb-6" />
        <tr v-if="editing === Number(stage.id)">
            <th class="head">Arena D</th>
            <td>
                <FieldSelect
                    field-name="sandType4"
                    placeholder="Seleccionar"
                    :endpoint-data="sandTypes4"
                    endpoint-key="type"
                    :data="stage.sandId4"
                    @update:data="stage.sandId4 = $event"
                />
            </td>
        </tr>
        <tr v-else>
            <th class="head">Arena D</th>
            <td v-if="stage.sandId4 > 0 || stage.quantity4 > 0" class="td">
                {{ getSand(Number(stage.sandId4))?.type }} / {{ stage.quantity4 }}t
            </td>
            <td v-else class="td">No hay arena</td>
        </tr>
        <tr v-if="editing === Number(stage.id)">
            <th class="head">Cantidad</th>
            <td>
                <FieldWithSides
                    field-name="sandQuantity4"
                    placeholder="0 t"
                    type="number"
                    :post="{ title: '0', value: 't' }"
                    :data="stage.quantity4"
                    @update:data="stage.quantity4 = $event"
                />
            </td>
        </tr>

        <div v-if="editing === Number(stage.id)" class="separador ml-6 mt-6 mb-6" />
        <tr>
            <th scope="col" class="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider flex-1">
                Cantidad Total
            </th>
            <td class="text-gray-500 pl-3 py-4 whitespace-nowrap text-right text-sm">{{ totalWheight }}t</td>
        </tr>
        <div class="separador-final ml-6 mt-6 mb-6" />
    </table>
</template>

<script setup lang="ts">
    import FieldSelect from '@/components/ui/form/FieldSelect.vue';
    import FieldWithSides from '@/components/ui/form/FieldWithSides.vue';
    import Icon from '@/components/icon/TheAllIcon.vue';
    import { Sand } from '@/interfaces/sandflow';
    import CircularBtn from '@/components/ui/buttons/CircularBtn.vue';
    import DropdownBtn from '@/components/ui/buttons/DropdownBtn.vue';
    import { useApi } from '@/helpers/useApi';

    const props = defineProps({
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
        editingKey: {
            type: String,
            default: 'id',
        },
        stagesAmount: {
            type: Number,
            default: 0,
        },
    });

    const emits = defineEmits(['editStage', 'saveStage', 'duplicateStage', 'deleteStage']);

    const { stage, editing, sands, pos, editingKey } = toRefs(props);
    stage.value.stage = pos.value;

    const { read: getSands } = useApi('/sand?visible=1');

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
        return Number(stage.value.quantity1) + Number(stage.value.quantity2) + Number(stage.value.quantity3) || 0;
    });
    const getSand = (sandId: number) => {
        return (
            sands.value.find((sand: Sand) => {
                return Number(sand.id) === sandId;
            }) || { tpye: '' }
        );
    };

    const editStage = () => {
        emits('editStage', stage.value);
    };
    const saveStage = () => {
        emits('saveStage', stage.value);
    };
    const duplicateStage = () => {
        emits('duplicateStage', stage.value);
    };
    const deleteStage = () => {
        emits('deleteStage', stage.value);
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
            callback: () => {
                deleteStage();
            },
        },
    ];
</script>

<style lang="scss" scoped>
    .head {
        @apply px-6 py-3 text-left text-sm font-medium text-black uppercase tracking-wider flex-1;
    }

    .td {
        @apply pl-6 py-3 text-right text-sm font-medium text-gray-500 tracking-wider flex-1;
    }

    .separador {
        width: 80%;
        height: 1px;
        @apply bg-gray-200;
    }

    .separador-final {
        width: 180%;
        height: 1px;
        @apply bg-gray-200;
    }
</style>
