<template>
    <article :class="cardClass" class="card">
        <div class="box-card-and-id flex flex-col items-center">
            <BoxCardIcon class="icon" :category="category" />
            <p v-if="choosedBox && !difRender" class="text-sm font-bold mt-1">ID {{ choosedBox.boxId }}</p>
        </div>
        <div class="flex flex-col justify-between">
            <div>
                <p class="text-sm font-bold leading-tight">Nivel: {{ floor ? floor : '-' }}</p>
                <p class="text-sm font-bold leading-tight">Columna: {{ col ? col : '-' }}</p>
                <p class="text-sm font-bold leading-tight">Fila: {{ row ? row : '-' }}</p>
            </div>
            <p v-if="difRender" class="text-sm">{{ makeValue != null ? makeValue : 'Arena ' + sandName }}</p>
            <div v-if="choosedBox && !difRender" class="extra-data mt-4">
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
                default: 0,
            },
            row: {
                type: Number,
                default: 0,
            },
            col: {
                type: Number,
                default: 0,
            },
            category: {
                type: String,
                default: '',
            },
            choosedBox: {
                type: Object,
                required: false,
                default: () => {
                    return {};
                },
            },
            depositRender: {
                type: Boolean,
                default: false,
            },
            sandName: {
                type: String,
                default: '',
            },
        },

        setup(props) {
            const { category } = toRefs(props);
            const difRender = computed(() => {
                return props.depositRender;
            });
            const sandName = computed(() => {
                return props.sandName;
            });
            const makeValue = computed(() => {
                return BoxCategory[category.value];
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

            return {
                makeValue,
                cardClass,
                difRender,
                sandName,
            };
        },
    });
</script>

<style lang="scss" scoped>
    @import '@/assets/box.scss';
    .card {
        @apply p-4 rounded-2xl flex gap-6 bg-second-400 text-second-0 mt-12;
        & .icon {
            @apply w-20 h-20;
        }
    }
</style>
