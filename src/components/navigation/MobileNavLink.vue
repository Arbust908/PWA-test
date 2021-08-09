<template>
  <router-link
    :to="to"
    :class="to === $route.fullPath ? 'selected' : null"
    class="nav-link group"
  >
    <component :is="icon" class="icon" aria-hidden="true" />
    {{ name }}
  </router-link>
</template>

<script lang="ts">
  import {
    AdjustmentsIcon,
    AnnotationIcon,
    ArchiveIcon,
    AtSymbolIcon,
    BellIcon,
    ChipIcon,
    ClipboardListIcon,
    HomeIcon,
    LogoutIcon,
    MenuAlt2Icon,
    UsersIcon,
    XIcon,
    ViewGridAddIcon,
    ClipboardIcon,
  } from '@heroicons/vue/outline';
  import { defineComponent, defineAsyncComponent } from 'vue';

  export default defineComponent({
    components: {
      AdjustmentsIcon,
      AnnotationIcon,
      ArchiveIcon,
      AtSymbolIcon,
      BellIcon,
      ChipIcon,
      ClipboardListIcon,
      HomeIcon,
      LogoutIcon,
      MenuAlt2Icon,
      UsersIcon,
      XIcon,
      ViewGridAddIcon,
      ClipboardIcon,
    },
    props: {
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
    },
  });
</script>

<style lang="scss" scoped>
  .nav-link {
    @apply flex items-center px-2 py-2 text-base font-medium rounded-md cursor-pointer;
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
    & > .icon {
      @apply mr-4 flex-shrink-0 h-6 w-6;
    }
  }
</style>
