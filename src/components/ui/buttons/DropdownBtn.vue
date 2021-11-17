<template>
    <div class="group relative">
        <!-- btn slot -->
        <slot></slot>
        <nav tabindex="0" class="dropwdown-menu">
            <ul class="py-1">
                <li v-for="action in actions" :key="action">
                    <a
                        v-if="action.hide ? action.hide(item) : true"
                        role="button"
                        tab-index="0"
                        class="block pl-4 pr-16 py-2 hover:bg-gray-100 font-medium text-left"
                        @click="action.callback(item)"
                    >
                        {{ action.label }}
                    </a>
                </li>
            </ul>
        </nav>
    </div>
</template>

<script>
    import { defineComponent } from 'vue';

    export default defineComponent({
        name: 'DropdownBtn',

        props: {
            actions: {
                type: Array,
                default: () => [],
            },
            item: {
                type: Object,
                default: () => ({}),
            },
        },
    });
</script>

<style lang="scss" scoped>
    .dropwdown-menu {
        @apply shadow-lg border border-gray-200 bg-white text-gray-700 invisible rounded w-auto absolute right-0 top-full transition-all opacity-0 group-focus-within:visible group-focus-within:opacity-100 group-focus-within:translate-y-1 z-20;
    }
</style>
