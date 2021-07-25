<!-- This example requires Tailwind CSS v2.0+ -->
<template>
  <Switch
    v-model="enabled"
    :class="[enabled ? 'bg-main-600' : 'bg-second-200']"
    class="
      relative
      inline-flex
      flex-shrink-0
      h-6
      w-11
      border-2 border-transparent
      rounded-full
      cursor-pointer
      transition-colors
      ease-in-out
      duration-200
      focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-main-500
    "
  >
    <span class="sr-only">Use setting</span>
    <span
      :class="[enabled ? 'translate-x-5' : 'translate-x-0']"
      class="
        pointer-events-none
        relative
        inline-block
        h-5
        w-5
        rounded-full
        bg-second-50
        shadow
        transform
        ring-0
        transition
        ease-in-out
        duration-200
      "
    >
      <span
        :class="[enabled ? 'opacity-0 ease-out duration-100' : 'opacity-100 ease-in duration-200']"
        class="absolute inset-0 h-full w-full flex items-center justify-center transition-opacity"
        aria-hidden="true"
      >
        <MoonIcon />
      </span>
      <span
        :class="[enabled ? 'opacity-100 ease-in duration-200' : 'opacity-0 ease-out duration-100']"
        class="absolute inset-0 h-full w-full flex items-center justify-center transition-opacity"
        aria-hidden="true"
      >
        <SunIcon />
      </span>
    </span>
  </Switch>
</template>

<script>
  import { ref } from 'vue';
  import { Switch } from '@headlessui/vue';
  import { MoonIcon, SunIcon } from '@heroicons/vue/outline';

  export default {
    components: {
      Switch,
      MoonIcon,
      SunIcon,
    },
    setup() {
      const enabled = ref(false);

      return {
        enabled,
      };
    },
  };
</script>
