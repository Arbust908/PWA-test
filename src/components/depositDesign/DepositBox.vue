<template>
    <button :class="[boxClassess]" class="box" @click.prevent="selectBox">
        <span v-if="boxClassess.includes('selected') && !isDesign" class="text-sm">
            <Icon
                icon="CheckCircle"
                type="outline"
                :class="`w-10 h-10 m-auto ${sandInfo?.status === 11 ? 'text-neutral-400' : null}`"
            />
        </span>
        <span v-else :class="`text-sm ${sandInfo?.status === 11 ? 'text-stone-500' : null}`">{{ designation }}</span>
    </button>
</template>

<script setup lang="ts">
    import { Box } from '@/interfaces/sandflow';
    import { getBoxClasses } from '@/helpers/useWarehouse';
    import Icon from '@/components/icon/TheAllIcon.vue';

    const props = defineProps({
        selectedBox: {
            type: Object,
            default: () => {
                return {};
            },
        },
        selectedBoxes: {
            type: Array,
            default: () => {
                return [];
            },
        },
        floor: {
            type: Number,
            required: true,
        },
        row: {
            type: Number,
            required: true,
        },
        col: {
            type: Number,
            required: true,
        },
        visibleCategories: {
            type: Array,
            required: false,
            default: () => undefined,
        },
        boxData: {
            type: Object,
            required: false,
            default: ref({}),
        },
        sandInfo: {
            type: Object,
            required: false,
            default: ref({}),
        },
        isDesign: {
            type: Boolean,
            required: false,
            default: false,
        },
        isDestination: {
            type: Boolean,
            required: false,
            default: false,
        },
        isEmptyDeposit: {
            type: Boolean,
            required: false,
            default: false,
        },
    });
    const emits = defineEmits(['select-box']);
    let { floor, row, col, selectedBox, selectedBoxes, boxData, isDesign } = toRefs(props);

    const category = computed(() => {
        return boxData && boxData.value ? boxData.value.category : 'empty';
    });

    const designation = computed(() => {
        if (isDesign.value && ['aisle', 'cradle', 'empty'].includes(category.value)) {
            switch (category.value) {
                case 'aisle':
                    return 'Pasillo';
                case 'cradle':
                    return 'Cradle';
                case 'empty':
                    return 'Vacía';
            }
        } else {
            return props.sandInfo?.boxId;
        }
    });

    props?.sandInfo?.value && console.log(props?.sandInfo.value);

    const boxClassess = computed(() => {
        let bC = '';

        if (props.sandInfo?.sandTypeId) {
            bC += getBoxClasses(String(props.sandInfo?.sandTypeId), props.sandInfo?.status);
        } else {
            bC += getBoxClasses(category.value, props.sandInfo?.status);
        }

        if (isDesign.value && bC.length < 2) {
            bC += ' design';
        }

        if (
            (!isDesign.value &&
                (category.value == 'aisle' ||
                    category.value == 'cradle' ||
                    (category.value == 'empty' && !props.isDestination) ||
                    (props.boxData.category != 'empty' && props.boxData.category != undefined && props.isDestination) ||
                    (props.sandInfo?.id && !props.isEmptyDeposit))) ||
            isEmptyBoxInEmptyDepo.value
        ) {
            bC += ' cursor-not-allowed';
        }

        if (isBlocked()) {
            bC += ' not-shown';
        }

        if (isTheSelected.value) {
            bC += ' selected ring-2 ring-main-500 ring-offset-2 ring-offset-main-0 shadow-lg';
        }

        if (beenSet.value) {
            bC += ' been-set';
        }

        if (category.value === undefined && !isTheSelected.value && !isDesign.value) {
            bC += ' notDesignated';
        }

        return bC;
    });

    const id = computed(() => {
        return boxData?.value?.id || '';
    });

    const isEmptyBoxInEmptyDepo = computed(() => {
        return props.sandInfo?.status !== 11 && props.isEmptyDeposit;
    });

    const selectBox = () => {
        if (
            (category.value == 'aisle' ||
                category.value == 'cradle' ||
                (category.value == 'empty' && !props.isDestination) ||
                (props.boxData.category != 'empty' && props.boxData.category != undefined && props.isDestination) ||
                (props.sandInfo?.id && !props.isEmptyDeposit) ||
                isEmptyBoxInEmptyDepo.value ||
                isBlocked()) &&
            !isDesign.value &&
            props.isDestination
        ) {
            console.log('Bloqueo');

            return;
        }
        const box: Box = {
            floor: floor.value,
            row: row.value,
            col: col.value,
            category: category.value || '',
            id: id.value || '',
        };
        emits('select-box', box);
    };

    const isTheSelected = computed(() => {
        const isInSelectedArray = selectedBoxes.value.some((box) => {
            return box.row === row.value && box.col === col.value && box.floor === floor.value;
        });

        if (isInSelectedArray) {
            return true;
        }

        if (!selectedBox.value) {
            return false;
        }

        return (
            selectedBox.value.row === row.value &&
            selectedBox.value.col === col.value &&
            selectedBox.value.floor === floor.value
        );
    });

    let visibleCategories = ref(props.visibleCategories);

    const isBlocked = () => {
        if (isDesign.value) {
            console.log('isDesign');

            return false;
        }

        if (!visibleCategories.value) {
            return false;
        }

        if (category.value == 'aisle' || category.value == 'cradle' || category.value == 'empty') {
            return false;
        }

        if (!visibleCategories.value.includes(Number(category.value)) && category.value !== undefined) {
            return true;
        }

        return false;
    };
    const beenSet = computed(() => {
        return props.sandInfo?.location?.been_set || false;
    });
</script>

<style lang="scss">
    @import '@/assets/box.scss';
</style>

<style lang="scss" scoped>
    .been-set {
        @apply cursor-not-allowed;
    }
</style>
