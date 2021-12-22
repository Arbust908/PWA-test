<template>
    <div :class="isSectionOpen ? 'opened' : null" class="section">
        <button class="nav-link group" @click.prevent="toggleSection()">
            <Icon :icon="icon" type="outline" class="icon" />
            <span :class="mode === 'desk' ? 'hidden lg:inline' : null">{{ name }}</span>
        </button>
        <transition-group
            v-if="isSectionOpen"
            appear
            :class="mode === 'desk' ? 'small' : null"
            class="sub-section"
            tag="div"
            @before-enter="beforeEnter"
            @enter="enter"
        >
            <MobileNavLink
                v-for="(item, index) in subNav"
                :key="item.to"
                v-bind="item"
                :data-stagger-index="index"
                :mode="mode"
                is-sub-nav
            />
        </transition-group>
    </div>
</template>

<script setup lang="ts">
    import gsap from 'gsap';

    import MobileNavLink from '@/components/navigation/NavLink.vue';
    import Icon from '@/components/icon/TheAllIcon.vue';

    const props = defineProps({
        icon: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        subNav: {
            type: Array,
            required: true,
        },
        mode: {
            type: String,
            default: '',
        },
    });
    const route = useRoute();
    const isSectionOpen: Ref<boolean> = ref(false);
    const toggleSection = useToggle(isSectionOpen);

    onMounted(() => {
        if (props.subNav.some((item) => item.to === route.path)) {
            isSectionOpen.value = true;
        }
    });

    const beforeEnter = (el) => {
        el.style.opacity = 0;
        el.style.transform = 'translateX(50%)';
    };
    const enter = (el, done) => {
        const staggerIndex = el.dataset.staggerIndex;
        gsap.to(el, {
            opacity: 1,
            x: 0,
            duration: 0.1,
            delay: 0.05 * staggerIndex,
            onComplete: done,
        });
    };
</script>

<style lang="scss" scoped>
    .section {
        @apply rounded-md overflow-hidden;
        &.opened {
            @apply bg-gray-100;
            & .icon {
                @apply rotate-90;
            }
        }
    }
    button {
        @apply w-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-main-600;
    }
    .nav-link {
        @apply flex items-center px-2 py-2 text-base font-medium rounded-md cursor-pointer space-x-4;
        &.selected {
            @apply bg-gray-100 text-gray-900;
            & > .icon {
                @apply text-gray-500;
            }
        }
        &:not(.selected) {
            @apply text-gray-600 hover:bg-gray-50 hover:text-gray-900;
            & > .icon {
                @apply text-gray-400 group-hover:text-gray-500;
            }
        }
    }
    .icon {
        @apply flex-shrink-0 h-8 lg:h-6 w-8 lg:w-6 transition transform duration-200 ease-in-out;
    }
    .sub-section {
        @apply lg:ml-3 lg:pr-1 space-y-1 pb-2;
    }
    .sub-section:not(.small) {
        @apply ml-3;
    }
</style>
