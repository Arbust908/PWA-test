<template>
    <tr>
        <td class="text-gray-500 px-3 text-center py-4 whitespace-nowrap text-lg">{{ pos }} - {{ stagesAmount }}</td>
        <template v-if="editing === Number(stage[editingKey])">
            <td :id="`sandType${stage.id}`" class="typeWrap">
                <FieldSelect
                    field-name="sandType1"
                    placeholder="Seleccionar"
                    endpoint="/sand"
                    endpoint-key="type"
                    :data="stage.sandId1"
                    @update:data="stage.sandId1 = $event"
                />
                <FieldWithSides
                    class="mt-2"
                    field-name="sandQuantity1"
                    placeholder="0 t"
                    type="number"
                    :post="{ title: '0', value: 't' }"
                    :data="stage.quantity1"
                    @update:data="stage.quantity1 = $event"
                />
            </td>
            <td class="typeWrap">
                <FieldSelect
                    field-name="sandType2"
                    placeholder="Seleccionar"
                    endpoint="/sand"
                    endpoint-key="type"
                    :data="stage.sandId2"
                    @update:data="stage.sandId2 = $event"
                />
                <FieldWithSides
                    class="mt-2"
                    field-name="sandQuantity2"
                    placeholder="0 t"
                    type="number"
                    :post="{ title: '0', value: 't' }"
                    :data="stage.quantity2"
                    @update:data="stage.quantity2 = $event"
                />
            </td>
            <td class="typeWrap">
                <FieldSelect
                    field-name="sandType3"
                    placeholder="Seleccionar"
                    endpoint="/sand"
                    endpoint-key="type"
                    :data="stage.sandId3"
                    @update:data="stage.sandId3 = $event"
                />
                <FieldWithSides
                    class="mt-2"
                    field-name="sandQuantity3"
                    placeholder="0 t"
                    type="number"
                    :post="{ title: '0', value: 't' }"
                    :data="stage.quantity3"
                    @update:data="stage.quantity3 = $event"
                />
            </td>
            <td class="typeWrap">
                <FieldSelect
                    field-name="sandType4"
                    placeholder="Seleccionar"
                    endpoint="/sand"
                    endpoint-key="type"
                    :data="stage.sandId4"
                    @update:data="stage.sandId4 = $event"
                />
                <FieldWithSides
                    class="mt-2"
                    field-name="sandQuantity4"
                    placeholder="0 t"
                    type="number"
                    :post="{ title: '0', value: 't' }"
                    :data="stage.quantity4"
                    @update:data="stage.quantity4 = $event"
                />
            </td>
        </template>
        <template v-else>
            <td class="text-gray-500 px-3 py-4 whitespace-nowrap text-sm text-center">
                <template v-if="(sands.length > 0 && stage.sandId1 > 0) || stage.quantity1 > 0">
                    <p v-if="sands.length > 0 && stage.sandId1 >= 0">
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
                <template v-if="(sands.length > 0 && stage.sandId2 >= 0) || stage.quantity2 > 0">
                    <p v-if="sands.length > 0 && stage.sandId2 >= 0">
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
                <template v-if="(sands.length > 0 && stage.sandId3 >= 0) || stage.quantity3 > 0">
                    <p v-if="sands.length > 0 && stage.sandId3 >= 0">
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
                <template v-if="(sands.length > 0 && stage.sandId3 >= 0) || stage.quantity3 > 0">
                    <p v-if="sands.length > 0 && stage.sandId4 >= 0">
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

<script lang="ts">
    import { defineComponent, toRefs, reactive, computed } from 'vue';
    import Popper from 'vue3-popper';
    import Pill from '@/components/ui/Pill.vue';
    import Icon from '@/components/icon/TheAllIcon.vue';
    import FieldSelect from '@/components/ui/form/FieldSelect.vue';
    import FieldWithSides from '@/components/ui/form/FieldWithSides.vue';
    import { Sand } from '@/interfaces/sandflow';
    import CircularBtn from '@/components/ui/buttons/CircularBtn.vue';
    import DropdownBtn from '@/components/ui/buttons/DropdownBtn.vue';

    export default defineComponent({
        components: {
            Icon,
            Pill,
            FieldSelect,
            FieldWithSides,
            CircularBtn,
            DropdownBtn,
            Popper,
        },
        props: {
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
        },
        setup(props, { emit }) {
            const { stage, editing, sands, pos, editingKey } = toRefs(props);
            stage.value.stage = pos.value;

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
            const upgrade = () => {
                if (stage.value.status >= 2) {
                    console.error('Reset status');
                    stage.value.status = 0;

                    return;
                }
                stage.value.status++;
            };

            const pill = reactive({
                status: stage.value.status === 2 ? 'finished' : stage.value.status === 1 ? 'idle' : 'empty',
                name: stage.value.status === 2 ? 'Finalizada' : stage.value.status === 1 ? 'En Progreso' : 'Creada',
            });

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

            const headers = {
                'Content-Type': 'Application/JSON',
            };

            return {
                stage,
                editing,
                sands,
                totalWheight,
                getSand,
                duplicateStage,
                deleteStage,
                editStage,
                saveStage,
                upgrade,
                pill,
                actions,
            };
        },
    });
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
