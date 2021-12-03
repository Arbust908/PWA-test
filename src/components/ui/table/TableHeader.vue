<template>
    <tr>
        <th v-for="column in columns" :key="column.key" scope="col">
            <div class="flex justify-center items-center gap-2">
                {{ column.title }}

                <template v-if="column.sortable">
                    <div class="flex flex-col gap-1">
                        <button
                            role="button"
                            tab-index="0"
                            class="text-gray-400 px-0.5"
                            :class="getSortClass(column.key, 'asc')"
                            @click="sortBy(column.key)"
                        >
                            <svg
                                width="10"
                                height="6"
                                viewBox="0 0 10 6"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    fill-rule="evenodd"
                                    clip-rule="evenodd"
                                    d="M9.70711 5.70711C9.31658 6.09763 8.68342 6.09763 8.29289 5.70711L5 2.41421L1.70711 5.70711C1.31658 6.09763 0.683417 6.09763 0.292894 5.70711C-0.0976312 5.31658 -0.0976312 4.68342 0.292894 4.29289L4.29289 0.292893C4.68342 -0.0976311 5.31658 -0.0976311 5.70711 0.292893L9.70711 4.29289C10.0976 4.68342 10.0976 5.31658 9.70711 5.70711Z"
                                    fill="currentColor"
                                />
                            </svg>
                        </button>
                        <button
                            role="button"
                            tab-index="0"
                            class="text-gray-400 px-0.5"
                            :class="getSortClass(column.key, 'desc')"
                            @click="sortBy(column.key, 'desc')"
                        >
                            <svg
                                width="10"
                                height="6"
                                viewBox="0 0 10 6"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    fill-rule="evenodd"
                                    clip-rule="evenodd"
                                    d="M0.293015 0.292893C0.683538 -0.097631 1.3167 -0.097631 1.70723 0.292893L5.00011 3.58579L8.293 0.292893C8.68353 -0.0976311 9.31669 -0.0976311 9.70721 0.292893C10.0977 0.683417 10.0977 1.31658 9.70721 1.70711L5.70722 5.70711C5.3167 6.09763 4.68353 6.09763 4.29301 5.70711L0.293015 1.70711C-0.0975089 1.31658 -0.0975089 0.683417 0.293015 0.292893Z"
                                    fill="currentColor"
                                />
                            </svg>

                            <!-- <Icon icon="ArrowDown" class="w-4 h-4 active:bg-gray-300" /> -->
                        </button>
                    </div>
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
