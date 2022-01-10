<template>
    <div class="group relative">
        <!-- btn slot -->
        <button @click.prevent="toggleShow">
            <slot></slot>
        </button>
        <OnClickOutside @trigger="closeIfOpen">
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
        </OnClickOutside>
    </div>
</template>
<script>
    import { defineComponent } from 'vue';
    import { OnClickOutside } from '@vueuse/components';

    export default defineComponent({
        name: 'DropdownBtn',
        components: {
            OnClickOutside,
        },
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
            const show = ref(false);
            const getClass = computed(() => {
                return show.value ? 'visible opacity-100 translate-y-1' : 'invisible opacity-0';
            });
            const toggleShow = useToggle(show);
            const closeIfOpen = () => {
                if (show.value) {
                    toggleShow();
                }
            };

            return {
                getClass,
                show,
                toggleShow,
                closeIfOpen,
            };
        },
    });
</script>
<style lang="scss" scoped>
    .dropwdown-menu {
        @apply shadow-lg border border-gray-200 bg-white text-gray-700 rounded w-auto absolute right-0 top-full transition-all z-10;
    }
</style>
