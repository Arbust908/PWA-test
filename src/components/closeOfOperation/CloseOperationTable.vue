<template>
    <table>
        <tr>
            <th class="head">Etapas</th>
            <td class="text-right text-gray-400">{{ currentStage }} / {{ stageTotal }}</td>
        </tr>
        <tr>
            <th class="head">Toneladas</th>
            <td class="text-right font-bold">{{ stageSandAmmount }}t</td>
        </tr>
        <tr>
            <th class="head">Estado</th>
            <td class="text-right">
                <Badge v-if="sandPlan.stages[0]?.status === 0" class="bg-blue-600 rounded-lg" text="EN PROGRESO" />
                <Badge v-else text="COMPLETA" />
            </td>
        </tr>
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
    import Badge from '@/components/ui/Badge.vue';

    const props = defineProps({
        sandPlan: {
            type: Object,
            required: true,
        },
    });

    const emits = defineEmits(['editStage', 'saveStage', 'duplicateStage', 'deleteStage']);

    const { sandPlan } = toRefs(props);

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
        return Number(stage.value.quantity1) + Number(stage.value.quantity2) + Number(stage.value.quantity3) || 0;
    });

    const currentStage = ref(0);
    const stageTotal = ref(0);
    const stageSandAmmount = ref(0);

    onMounted(() => {
        currentStage.value = 0;
        stageTotal.value = 0;
        stageSandAmmount.value = 0;
        const stageQuantities = [];

        if (sandPlan.value.stages.length > 0) {
            const currentStageFull = sandPlan.value.stages.find((stage: any) => stage.status === 0);

            if (currentStageFull) {
                currentStage.value = currentStageFull?.stage;
                stageTotal.value = sandPlan.value.stages.length;
                stageQuantities.push(
                    currentStageFull.quantity1,
                    currentStageFull.quantity2,
                    currentStageFull.quantity3,
                    currentStageFull.quantity4
                );
                stageQuantities.map((quantity) => {
                    if (quantity >= 0) {
                        stageSandAmmount.value += quantity;
                    }
                });
            }
        }
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
        @apply bg-gray-200;
    }

    .separador-final {
        width: 180%;
        height: 1px;
        @apply bg-gray-200;
    }
</style>
