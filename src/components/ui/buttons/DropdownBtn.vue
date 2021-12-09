<template>
    <div class="group relative">
        <!-- btn slot -->
        <button @click="change">
            <slot></slot>
        </button>
        <nav tabindex="0" class="dropwdown-menu" :class="getClass">
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
        setup() {
            const show = ref(true);
            const getClass = computed(() => {
                if (show.value) {
                    return 'invisible opacity-0';
                }
                return 'visible opacity-100 translate-y-1';
            });
            const change = () => {
                show.value = !show.value;
            };
            return {
                change,
                show,
                getClass,
            };
        },
    });
    // invisible opacity-0    group-focus-within:visible  group-focus-within:opacity-100 group-focus-within:translate-y-1
</script>
<style lang="scss" scoped>
    .dropwdown-menu {
        @apply shadow-lg border border-gray-200 bg-white text-gray-700 rounded w-auto absolute right-0 top-full transition-all z-10;
    }
</style>
