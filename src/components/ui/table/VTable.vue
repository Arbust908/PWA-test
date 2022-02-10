<template>
    <section class="max-w-fit">
        <!-- Desktop Table -->
        <div class="hidden sm:block">
            <div>
                <article>
                    <table>
                        <thead>
                            <slot name="header">
                                <TableHeader v-model:pagination="localPagination" :columns="columns" />
                            </slot>
                        </thead>
                        <tbody v-if="loading || paginatedItems.length === 0">
                            <tr>
                                <td :colspan="columns.length" class="emptyState">
                                    <p v-if="loading">Cargando...</p>
                                    <p v-else>{{ emptyText }}</p>
                                </td>
                            </tr>
                        </tbody>
                        <transition-group
                            v-else
                            appear
                            tag="tbody"
                            class="divide-y divide-gray-200"
                            @before-enter="beforeEnter"
                            @enter="enter"
                            @leave="leave"
                            @before-leave="beforeLeave"
                        >
                            <tr
                                v-for="(item, index) in paginatedItems"
                                :key="item.id"
                                :data-stagger-index="index"
                                class="body-row"
                                :class="index % 2 === 0 ? 'odd' : 'odd'"
                                :disabled="!item[disableKey]"
                            >
                                <slot name="item" :item="item" />
                                <td v-if="desktopActions && desktopActions.length" class="p-0 table--action">
                                    <DropdownBtn :actions="desktopActions" :item="item">
                                        <CircularBtn size="xs" class="even">
                                            <Icon
                                                icon="DotsVertical"
                                                type="outlined"
                                                class="w-6 h-6 icon text-gray-800"
                                            />
                                        </CircularBtn>
                                    </DropdownBtn>
                                </td>
                            </tr>
                        </transition-group>
                    </table>
                </article>
            </div>
        </div>

        <!-- Mobile Table -->
        <!-- TODO: Podría ir en un componente aparte  -->
        <div class="flex items-start lg:items-center justify-center mt-2 sm:hidden">
            <div class="mx-auto h-full">
                <div class="shadow-md bg-gray-100 overflow-none rounded-lg sm:shadow-lg text-sm sm:text-base">
                    <div v-for="item in paginatedItems" :key="item.id" class="bg-white border-gray-400">
                        <div class="divide-y divide-black border-t-2">
                            <div
                                class="grid grid-cols-12 p-6 pl-2 pr-2 items-center"
                                :class="!item[disableKey] ? 'disabled-mobile' : null"
                            >
                                <div class="col-span-10 rounded truncate pl-2">
                                    <span class="text-sm font-semibold">
                                        <slot name="mobileTitle" :item="item"></slot>
                                    </span>

                                    <p class="text-xs text-gray-500">
                                        <slot name="mobileSubtitle" :item="item"></slot>
                                    </p>
                                </div>

                                <div class="col-span-2 rounded flex flex-col justify-center items-center">
                                    <DropdownBtn :actions="actions" :item="item">
                                        <CircularBtn size="xs">
                                            <Icon
                                                icon="DotsVertical"
                                                type="outlined"
                                                class="w-6 h-6 icon text-gray-800"
                                            />
                                        </CircularBtn>
                                    </DropdownBtn>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Pagination -->
        <TablePagination
            v-if="localPagination.perPage"
            :pagination="localPagination"
            :total="filteredItems.length"
        ></TablePagination>
    </section>
</template>

<script lang="ts">
    import gsap from 'gsap';
    import { defineComponent, computed, ref } from 'vue';
    import TableHeader from '@/components/ui/table/TableHeader.vue';
    import CircularBtn from '@/components/ui/buttons/CircularBtn.vue';
    import DropdownBtn from '@/components/ui/buttons/DropdownBtn.vue';
    import TablePagination from '@/components/ui/table/TablePagination.vue';

    import Icon from '@/components/icon/TheAllIcon.vue';

    export default defineComponent({
        name: 'VTable',
        components: {
            TableHeader,
            CircularBtn,
            Icon,
            DropdownBtn,
            TablePagination,
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
                        sortKey: 'id',
                        sortDir: 'asc',
                        // currentPage: 1,
                        // perPage: 10,
                    };
                },
            },
            items: {
                type: Array,
                default: () => [],
            },
            loading: {
                type: Boolean,
                default: false,
            },
            actions: {
                type: Array,
                default: () => [],
            },
            showPagination: {
                type: Boolean,
                default: false,
            },
            disableKey: {
                type: String,
                default: 'visible',
            },
            emptyText: {
                type: String,
                default: 'No hay datos cargados',
            },
        },
        setup(props, { emit }) {
            const show = ref(false);
            const localPagination = computed({
                get: () => props.pagination,
                set: (value) => emit('update:pagination', value),
            });
            const dropdown = ref(0);

            const getDescendantProp = (obj, desc: string) => {
                var arr = desc.split('.');

                while (arr.length && (obj = obj[arr.shift()])) {}

                return obj;
            };

            const filteredItems = computed(() => {
                let items = [...(props.items || [])];

                if (items.length < 1) {
                    return [];
                }

                items = sortData(items);

                return items;
            });

            const sortData = (data) => {
                const { sortKey, sortDir } = props.pagination;

                return data.slice().sort((a, b) => {
                    let modifier = 1;

                    if (sortDir === 'desc') {
                        modifier = -1;
                    }

                    let propA = getDescendantProp(a, sortKey);
                    let propB = getDescendantProp(b, sortKey);

                    if (propA === null) {
                        propA = 'zzzzz';
                    }

                    if (propB === null) {
                        propB = 'zzzzz';
                    }

                    if (!isNaN(Number(propA))) {
                        propA = Number(propA);
                    }

                    if (!isNaN(Number(propB))) {
                        propB = Number(propB);
                    }

                    if (propA < propB) {
                        return -1 * modifier;
                    }

                    if (propA > propB) {
                        return 1 * modifier;
                    }

                    return 0;
                });
            };

            const paginatedItems = computed(() => {
                if (!localPagination.value.perPage) {
                    return filteredItems.value;
                }

                const perPage = localPagination.value.perPage || 10;

                if (filteredItems.value) {
                    return paginate(filteredItems.value, perPage, localPagination.value.currentPage);
                }

                return [];
            });
            const paginatedItemsCount = ref(0);
            watch(paginatedItems, (val) => {
                const count = val.length;
                const lastCount = paginatedItemsCount.value;
                paginatedItemsCount.value = Math.max(count, lastCount);
            });

            const paginate = (array: Array<any>, length: number, pageNumber: number) => {
                localPagination.value.from = array.length ? (pageNumber - 1) * length + 1 : ' ';
                localPagination.value.to = pageNumber * length > array.length ? array.length : pageNumber * length;
                localPagination.value.prevPage = pageNumber > 1 ? pageNumber : '';
                localPagination.value.nextPage = array.length > localPagination.value.to ? pageNumber + 1 : '';

                return array.slice((pageNumber - 1) * length, pageNumber * length);
            };

            const desktopActions = computed(() => props.actions.filter((action: any) => !action.onlyMobile));

            const beforeEnter = (el: any) => {
                el.style.opacity = 0;
                el.style.transform = 'translateY(50%)';
            };
            const enter = (el: any, done: any) => {
                const staggerIndex = el.dataset.staggerIndex;
                const delay = paginatedItemsCount.value > 10 ? 0.05 : 0.15;
                const duration = paginatedItemsCount.value > 10 ? 0.25 : 0.5;
                gsap.to(el, {
                    opacity: 1,
                    y: 0,
                    duration: duration,
                    delay: delay * staggerIndex,
                    onComplete: () => {
                        el.style.transform = '';
                        el.style.opacity = '';
                        done();
                    },
                });
            };
            const beforeLeave = (el: any) => {
                el.style.opacity = 1;
                el.style.transform = 'translateY(0)';
            };
            const leave = (el: any, done: any) => {
                const staggerIndex = el.dataset.staggerIndex;
                const delay = paginatedItemsCount.value > 10 ? 0.05 : 0.15;
                const duration = paginatedItemsCount.value > 10 ? 0.25 : 0.5;
                gsap.to(el, {
                    opacity: 0,
                    y: '-50%',
                    duration: duration,
                    delay: delay * staggerIndex,
                    onComplete: done,
                });
            };

            return {
                localPagination,
                filteredItems,
                dropdown,
                show,
                paginatedItems,
                desktopActions,
                beforeEnter,
                enter,
                leave,
                beforeLeave,
            };
        },
    });
</script>

<style lang="scss" scoped>
    section {
        @apply flex flex-col;
        & > div {
            & > div {
                @apply align-middle inline-block min-w-full;
                & > article {
                    @apply shadow border-b border-second-200 sm:rounded-lg;
                }
            }
        }
    }
    table {
        @apply min-w-full divide-y divide-second-200 rounded-lg;
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

    .dropdown:hover .dropdown-menu {
        display: block;
    }

    @import '@/assets/table.scss';
</style>
