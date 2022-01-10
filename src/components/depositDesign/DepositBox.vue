<template>
    <button
        :class="['box', cardClass, isTheSelected ? 'selected' : null, isBlocked() ? 'blocked' : null]"
        @click.prevent="selectBox"
    >
        <span class="text-sm">{{ id }}</span>
    </button>
</template>

<script lang="ts">
    import { defineComponent, ref, toRefs, computed } from 'vue';
    import { Box } from '@/interfaces/sandflow';

    export default defineComponent({
        name: 'DepositBox',
        props: {
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
        },
        emits: ['select-box'],
        setup(props, { emit }) {
            let { floor, row, col, selectedBox, boxData } = toRefs(props);

            const category = computed(() => {
                return boxData && boxData.value ? boxData.value.category : 'empty';
            });

            const cardClass = computed(() => {
                switch (category.value) {
                    case '1':
                        return 'mesh-type__1 boxCard';
                    case '2':
                        return 'mesh-type__2 boxCard';
                    case '3':
                        return 'mesh-type__3 boxCard';
                    case '4':
                        return 'mesh-type__4 boxCard';
                    case '5':
                        return 'mesh-type__5 boxCard';
                    case 'empty':
                        return 'mesh-type__empty boxCard';
                    case 'aisle':
                        return 'mesh-type__taken aisle';
                    case 'cradle':
                        return 'mesh-type__taken cradle';
                }
            });

            const id = computed(() => {
                return boxData && boxData.value ? boxData.value.id : '';
            });

            const selectBox = () => {
                const box: Box = {
                    floor: floor.value,
                    row: row.value,
                    col: col.value,
                    category: category.value || '',
                    id: id.value || '',
                };
                emit('select-box', box);
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
                if (!visibleCategories.value) {
                    return false;
                }

                if (!visibleCategories.value.includes(category.value)) {
                    return true;
                }

                if (category.value == 'aisle') {
                    return true;
                } else {
                    return false;
                }
            };

            return {
                category,
                cardClass,
                selectBox,
                isTheSelected,
                isBlocked,
                id,
            };
        },
    });
</script>

<style lang="scss" scoped>
    @import '@/assets/box.scss';
    .box {
        @apply h-[58px] w-[58px] rounded bg-second-300;

        &.blocked {
            @apply relative z-10;
            &:after {
                content: '';
                @apply absolute z-40 inset-0 border-none opacity-75 border bg-slate-700 m-1 rounded;
            }
        }
        &.selected {
            @apply ring-2 ring-offset-second-0 ring-offset-2 ring-main-500;
        }
    }
</style>
