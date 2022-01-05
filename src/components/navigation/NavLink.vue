<template>
    <router-link :to="to" :class="dynamicClasses" class="nav-link group">
        <Icon :icon="icon" type="outline" class="icon" />
        <span :class="mode === 'desk' ? 'hidden lg:inline' : null">{{ name }}</span>
    </router-link>
</template>

<script setup lang="ts">
    import Icon from '@/components/icon/TheAllIcon.vue';

    const props = defineProps({
        to: {
            type: String,
            required: true,
        },
        icon: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        mode: {
            type: String,
            default: '',
        },
        isSubNav: {
            type: Boolean,
            default: false,
        },
    });

    const route = useRoute();

    const dynamicClasses = computed(() => {
        return {
            selected: props.to === route.fullPath,
            'sub-nav': props.isSubNav,
        };
    });
</script>

<style lang="scss" scoped>
    .nav-link {
        @apply flex items-center px-2 py-2 text-base font-medium rounded-md cursor-pointer space-x-4;
        &.selected {
            @apply bg-gray-100 text-gray-800;
            & > .icon {
                @apply text-gray-700;
            }
        }
        &:not(.selected) {
            @apply text-gray-600 hover:bg-gray-50 hover:text-gray-900;
            & > .icon {
                @apply text-gray-400 group-hover:text-gray-500;
            }
        }
        & > .icon {
            @apply flex-shrink-0 h-8 lg:h-6 w-8 lg:w-6;
        }
    }
    .nav-link.sub-nav.selected {
        @apply bg-white;
    }
</style>
