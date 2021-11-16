<template>
    <article :class="category" class="card">
        <div class="box-card-and-id flex flex-col items-center">
            <BoxCardIcon class="icon" :category="category" />
            <p v-if="choosedBox" class="text-sm font-bold mt-1">ID {{ choosedBox.boxId }}</p>
        </div>
        <div class="flex flex-col justify-between">
            <div>
                <p class="text-sm font-bold leading-tight">Nivel: {{ floor }}</p>
                <p class="text-sm font-bold leading-tight">Columna: {{ col }}</p>
                <p class="text-sm font-bold leading-tight">Fila: {{ row }}</p>
            </div>
            <p class="text-sm">{{ makeValue }}</p>
            <div v-if="choosedBox" class="extra-data mt-4">
                <p class="text-sm">Arena {{ choosedBox.category }}</p>
                <p class="text-sm">Cantidad {{ choosedBox.amount }}t</p>
            </div>
        </div>
    </article>
</template>

<script lang="ts">
    import { defineComponent, toRefs, computed } from 'vue';
    import { BoxCategory } from '@/interfaces/sandflow';
    import BoxCardIcon from '@/components/depositDesign/BoxCardIcon.vue';

    export default defineComponent({
        name: 'BoxCard',
        components: {
            BoxCardIcon,
        },
        props: {
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
            category: {
                type: String,
                required: true,
            },
            choosedBox: {
                type: Object,
                required: false,
                default: () => {
                    return {};
                },
            },
        },

        setup(props) {
            const { category } = toRefs(props);
            const makeValue = computed(() => {
                return BoxCategory[category.value];
            });

            return {
                makeValue,
            };
        },
    });
</script>

<style lang="scss" scoped>
    .card {
        @apply p-4 rounded-2xl flex gap-6 bg-second-400 text-second-0 mt-12;
        & .icon {
            @apply w-20 h-20;
        }

        &.aisle {
            @apply bg-second-300;
            & .icon {
                @apply text-second-400;
            }
        }
        &.fina {
            @apply bg-orange-600;
            & .icon {
                @apply text-orange-700;
            }
        }
        &.gruesa {
            @apply bg-green-600;
            & .icon {
                @apply text-green-700;
            }
        }
        &.cortada {
            @apply bg-blue-600;
            & .icon {
                @apply text-blue-700;
            }
        }
        &.empty {
            @apply bg-second-200 text-second-500;
            & .icon {
                @apply text-second-300;
            }
        }
    }
</style>
