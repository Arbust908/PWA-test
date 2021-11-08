<template>
    <section>
        <div>
            <div>
                <article>
                    <table>
                        <thead>
                            <slot name="header">
                                <TableHeader :columns="columns" :pagination="localPagination" />
                            </slot>
                        </thead>
                        <tbody v-if="loading">
                            <td :colspan="[columns.length]" class="emptyState">
                                <p>No hay datos cargados</p>
                            </td>
                        </tbody>
                        <tbody v-else>
                            <template v-for="(item, index) in filteredItems" :key="item.id">
                                <slot name="item" :item="item" :index="index" />
                            </template>
                        </tbody>
                    </table>
                </article>
            </div>
        </div>
        <div class="flex items-center space-x-1 mt-5 justify-end">
            <a href="#" class="flex items-center px-4 py-2 text-gray-500 bg-gray-300 rounded-md"> Anterior </a>

            <a href="#" class="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-blue-400 hover:text-white">
                1
            </a>
            <a href="#" class="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-blue-400 hover:text-white">
                2
            </a>
            <a href="#" class="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-blue-400 hover:text-white">
                3
            </a>

            <a
                href="#"
                class="px-4 py-2 font-bold text-gray-500 bg-gray-300 rounded-md hover:bg-blue-400 hover:text-white"
            >
                Siguiente
            </a>
        </div>
    </section>
</template>

<script lang="ts">
    import { defineComponent, computed } from 'vue';
    import TableHeader from '@/components/ui/table/TableHeader.vue';

    export default defineComponent({
        name: 'VTable',
        components: {
            TableHeader,
        },
        props: {
            columns: {
                type: Array,
                default: () => [],
            },
            pagination: {
                type: Object,
                default: () => {
                    return {};
                },
            },
            data: {
                type: Array,
                default: () => [],
            },
            loading: {
                type: Boolean,
                default: false,
            },
        },
        setup(props, { emit }) {
            const localPagination = computed({
                get: () => props.pagination,
                set: (value) => emit('update:pagination', value),
            });

            const getDescendantProp = (obj, desc: string) => {
                var arr = desc.split('.');

                while (arr.length && (obj = obj[arr.shift()])) {}

                return obj;
            };

            const filteredItems = computed(() => {
                let items = [...props.data];

                if (items.length < 1) {
                    return;
                }

                items = sortData(items);

                //pagination

                return items;
            });

            const sortData = (data) => {
                const { sortKey, sortDir } = props.pagination;

                return data.slice().sort((a, b) => {
                    let modifier = 1;

                    if (sortDir === 'desc') {
                        modifier = -1;
                    }

                    if (getDescendantProp(a, sortKey) < getDescendantProp(b, sortKey)) {
                        return -1 * modifier;
                    }

                    if (getDescendantProp(a, sortKey) > getDescendantProp(b, sortKey)) {
                        return 1 * modifier;
                    }

                    return 0;
                });
            };

            return {
                localPagination,
                filteredItems,
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
    .unselected {
        @apply text-gray-400;
    }

    @import '@/assets/table.scss';
</style>
