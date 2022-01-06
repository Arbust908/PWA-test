<template>
    <div class="flex items-center justify-center space-x-1 mt-5 sm:justify-end">
        <a
            v-if="localPagination.prevPage"
            role="button"
            tab-index="0"
            class="nav-button"
            @click="changePage(localPagination.currentPage - 1)"
        >
            Anterior
        </a>

        <a v-if="hasFirst()" href="#" class="nav-page" @click.prevent="changePage(1)"> 1 </a>

        <a v-if="hasFirst()" class="px-4 py-2 text-gray-700">...</a>
        <a
            v-for="page in pages"
            :key="page"
            href="#"
            class="nav-button"
            :class="{ '!bg-blue-400 !text-white': localPagination.currentPage == page }"
            @click="changePage(page)"
        >
            {{ page }}
        </a>

        <a v-if="hasLast()" class="px-4 py-2 text-gray-700">...</a>

        <a v-if="hasLast()" href="#" class="nav-page" @click="changePage(totalPages)">
            {{ totalPages }}
        </a>

        <a
            v-if="localPagination.nextPage"
            role="button"
            tab-index="0"
            class="nav-button"
            @click="changePage(localPagination.currentPage + 1)"
        >
            Siguiente
        </a>
    </div>
</template>

<script>
    import { defineComponent, computed, ref } from 'vue';

    export default defineComponent({
        props: {
            type: {
                type: String,
                default: 'button',
            },
            size: {
                type: String,
                default: 'md',
            },
            btn: {
                type: String,
                default: 'main',
            },
            disabled: {
                type: String,
                default: '',
            },
            isLoading: {
                type: Boolean,
                default: false,
            },
            pagination: {
                type: Object,
                default: () => {
                    return {};
                },
            },
            total: {
                type: Number,
                default: 0,
            },
        },

        setup(props, { emit }) {
            const show = ref(false);

            const localPagination = computed({
                get: () => props.pagination,
                set: (value) => emit('update:pagination', value),
            });

            const changePage = (page) => {
                localPagination.value.currentPage = page;
            };

            const pages = computed(() => {
                const p = [];
                for (var i = rangeStart.value; i <= rangeEnd.value; i++) {
                    p.push(i);
                }

                return p;
            });

            const totalPages = computed(() => {
                return Math.ceil(props.total / localPagination.value.perPage);
            });

            const rangeStart = computed(() => {
                const start = localPagination.value.currentPage - 1;

                return start > 0 ? start : 1;
            });

            const rangeEnd = computed(() => {
                const end = localPagination.value.currentPage + 1;

                return end < totalPages.value ? end : totalPages.value;
            });

            const hasFirst = () => {
                return rangeStart.value !== 1;
            };

            const hasLast = () => {
                return rangeEnd.value < totalPages.value;
            };

            const hasPrev = () => {
                return localPagination.value.currentPage > 1;
            };

            const hasNext = () => {
                return localPagination.value.currentPage < totalPages.value;
            };

            return {
                show,
                localPagination,
                pages,
                changePage,
                rangeStart,
                rangeEnd,
                totalPages,
                hasFirst,
                hasLast,
                hasPrev,
                hasNext,
            };
        },
    });
</script>

<style lang="scss" scoped>
    .nav-button {
        @apply px-4 py-2 font-bold text-gray-500 bg-gray-300 rounded-md hover:bg-blue-400 hover:text-white;
    }

    .nav-page {
        @apply px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-blue-400 hover:text-white;
    }

    .nav-dots {
        @apply px-4 py-2 text-gray-700 rounded-md;
    }

    .dropdown:hover .dropdown-menu {
        display: block;
    }
</style>
