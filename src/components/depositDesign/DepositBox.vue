<template>
    <button :class="[boxClassess]" class="box" @click.prevent="selectBox">
        <span class="text-sm">{{ sandInfo?.boxId }}</span>
    </button>
</template>

<script setup lang="ts">
    import { Box } from '@/interfaces/sandflow';
    import { getBoxClasses } from '@/helpers/useWarehouse';

    const props = defineProps({
        selectedBox: {
            type: Object,
            required: true,
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
    });
    const emits = defineEmits(['select-box']);
    let { floor, row, col, selectedBox, boxData, isDesign } = toRefs(props);

    const category = computed(() => {
        return boxData && boxData.value ? boxData.value.category : 'empty';
    });

    const boxClassess = computed(() => {
        let bC = '';

        if (props.sandInfo?.sandTypeId) {
            bC += getBoxClasses(String(props.sandInfo?.sandTypeId));
        } else {
            bC += getBoxClasses(category.value);
        }

        if (isDesign.value && bC.length < 2) {
            bC += ' design';
        }

        if (!isDesign.value && (category.value == 'aisle' || category.value == 'cradle')) {
            bC += ' cursor-not-allowed';
        }

        if (isBlocked()) {
            bC += ' not-shown';
        }

        if (isTheSelected.value) {
            bC += ' selected';
        }

        if (beenSet.value) {
            bC += ' been-set';
        }

        return bC;
    });

    const id = computed(() => {
        return boxData?.value?.id || '';
    });

    const selectBox = () => {
        if ((category.value == 'aisle' || category.value == 'cradle' || isBlocked()) && !isDesign.value) {
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

        if (category.value == 'aisle' || category.value == 'cradle') {
            return false;
        }

        if (!visibleCategories.value.includes(Number(category.value))) {
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
        @apply cursor-not-allowed border;
    }
</style>
