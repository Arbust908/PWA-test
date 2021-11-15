<template>
    <div class="p-4">
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
                            class="block pl-4 pr-16 py-2 hover:bg-gray-100 font-medium"
                            @click="action.callback(item)"
                        >
                            {{ action.label }}
                        </a>
                    </li>
                </ul>
            </nav>
        </div>
    </div>
</template>

<script>
    import { defineComponent } from 'vue';

    export default defineComponent({
        name: 'VTable',

        props: {
            icon: {
                type: String,
                default: '',
            },
            btnText: {
                type: String,
                default: '',
            },
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
    .success {
        &-box {
            @apply py-8 px-4 sm:px-8 flex-1 flex flex-col justify-center max-w-xs mx-auto text-center space-y-8;
            & > h2 {
                @apply text-center text-3xl font-extrabold text-gray-900;
            }
        }
        &-logo {
            @apply mx-auto h-28 w-auto text-green-600;
        }
    }
</style>
