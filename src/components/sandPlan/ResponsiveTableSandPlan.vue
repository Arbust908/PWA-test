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
                    endpoint="/sand"
                    endpoint-key="type"
                    :data="stage.sandId1"
                    @update:data="stage.sandId1 = $event"
                />
            </td>
        </tr>
        <tr v-else>
            <th class="head">Arena A</th>
            <td v-if="(sands.length > 0 && stage.sandId1 >= 0) || stage.quantity1 > 0" class="td">
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
                    endpoint="/sand"
                    endpoint-key="type"
                    :data="stage.sandId2"
                    @update:data="stage.sandId2 = $event"
                />
            </td>
        </tr>
        <tr v-else>
            <th class="head">Arena B</th>
            <td v-if="(sands.length > 0 && stage.sandId2 >= 0) || stage.quantity2 > 0" class="td">
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
                    endpoint="/sand"
                    endpoint-key="type"
                    :data="stage.sandId3"
                    @update:data="stage.sandId3 = $event"
                />
            </td>
        </tr>
        <tr v-else>
            <th class="head">Arena C</th>
            <td v-if="(sands.length > 0 && stage.sandId3 >= 0) || stage.quantity3 > 0" class="td">
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
                    field-name="sandType3"
                    placeholder="Seleccionar"
                    endpoint="/sand"
                    endpoint-key="type"
                    :data="stage.sandId4"
                    @update:data="stage.sandId4 = $event"
                />
            </td>
        </tr>
        <tr v-else>
            <th class="head">Arena D</th>
            <td v-if="(sands.length > 0 && stage.sandId4 >= 0) || stage.quantity4 > 0" class="td">
                {{ getSand(Number(stage.sandId4))?.type }} / {{ stage.quantity4 }}t
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
                    :data="stage.quantity4"
                    @update:data="stage.quantity4 = $event"
                />
            </td>
        </tr>

        <div v-if="editing === Number(stage.id)" class="separador ml-6 mt-6 mb-6" />

        <tr>
            <th
                scope="col"
                class="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider flex-1"
            >
                Cantidad Total
            </th>
            <td class="text-gray-500 pl-3 py-4 whitespace-nowrap font-bold text-right">{{ totalWheight }}t</td>
        </tr>
        <tr>
            <th
                scope="col"
                class="px-6 py-3 text-sm font-medium text-gray-500 uppercase tracking-wider flex-1 text-left"
            >
                Estado
            </th>
            <td>
                <Pill :type="pill.status" class="uppercase p-1 float-right"> {{ pill.name }} </Pill>
            </td>
        </tr>
        <div class="separador-final ml-6 mt-6 mb-6" />
    </table>
</template>

<script lang="ts">
    import { defineComponent, toRefs, reactive, computed } from 'vue';
    import FieldSelect from '@/components/ui/form/FieldSelect.vue';
    import FieldWithSides from '@/components/ui/form/FieldWithSides.vue';
    import Pill from '@/components/ui/Pill.vue';
    import Icon from '@/components/icon/TheAllIcon.vue';
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
        },
        props: {
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
        },
        setup(props, { emit }) {
            const { stage, editing, sands, pos, editingKey } = toRefs(props);
            stage.value.stage = pos.value;

            const totalWheight = computed(() => {
                return (
                    Number(stage.value.quantity1) + Number(stage.value.quantity2) + Number(stage.value.quantity3) || 0
                );
            });
            const getSand = (sandId: number) => {
                return (
                    sands.value.find((sand: Sand) => {
                        return Number(sand.id) === sandId;
                    }) || { tpye: '' }
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
    .head {
        @apply px-6 py-3 text-left text-sm font-medium text-black uppercase tracking-wider flex-1;
    }

    .td {
        @apply pl-6 py-3 text-right text-sm font-medium text-gray-500 tracking-wider flex-1;
    }

    .separador {
        width: 80%;
        height: 1px;
        background-color: gray;
    }

    .separador-final {
        width: 160%;
        height: 1px;
        background-color: gray;
    }
</style>
