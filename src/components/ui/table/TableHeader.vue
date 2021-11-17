<template>
    <tr>
        <th v-for="column in columns" :key="column.key" scope="col">
            <div class="flex justify-center">
                {{ column.title }}

                <template v-if="column.sortable">
                    <a
                        role="button"
                        tab-index="0"
                        class="text-gray-400"
                        :class="getSortClass(column.key, 'asc')"
                        @click="sortBy(column.key)"
                    >
                        <Icon icon="ArrowUp" class="w-4 h-4 ml-1 mr-1 active:bg-gray-300" />
                    </a>
                    <a
                        role="button"
                        tab-index="0"
                        class="text-gray-400"
                        :class="getSortClass(column.key, 'desc')"
                        @click="sortBy(column.key, 'desc')"
                    >
                        <Icon icon="ArrowDown" class="w-4 h-4 active:bg-gray-300" />
                    </a>
                </template>
            </div>
        </th>
    </tr>
</template>

<script lang="ts">
    import { defineComponent, computed } from 'vue';
    import Icon from '@/components/icon/TheAllIcon.vue';

    export default defineComponent({
        name: 'TableHeader',
        components: {
            Icon,
        },
        props: {
            columns: {
                type: Array,
                default: () => [],
            },
            pagination: {
                type: Object,
                default: () => {
                    return {
                        sortDir: 'asc',
                        sortKey: 'id',
                    };
                },
            },
        },
        setup(props, { emit }) {
            const localPagination = computed({
                get: () => props.pagination,
                set: (value) => emit('update:pagination', value),
            });

            const getSortClass = (key: string, dir: string) => {
                if (localPagination.value.sortKey == key && localPagination.value.sortDir == dir) {
                    return 'selected';
                }
            };

            const sortBy = (key: string, sortDir = 'asc') => {
                localPagination.value.sortDir = sortDir;
                localPagination.value.sortKey = key;
            };

            return {
                sortBy,
                localPagination,
                getSortClass,
            };
        },
    });
</script>

<style lang="scss" scoped>
    section {
        @apply flex flex-col;
        & > div {
            @apply overflow-x-auto;
            & > div {
                @apply align-middle inline-block min-w-full;
                & > article {
                    @apply shadow overflow-hidden border-b border-second-200 sm:rounded-lg;
                }
            }
        }
    }
    table {
        @apply min-w-full divide-y divide-second-200;
        thead {
            @apply bg-second-50;
        }
    }

    .selected {
        @apply text-black;
    }

    @import '@/assets/table.scss';
</style>
