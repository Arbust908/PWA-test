<template>
  <Switch
    v-model="enabled"
    class="
      flex-shrink-0
      relative
      rounded-full
      inline-flex
      items-center
      justify-center
      h-5
      w-10
      cursor-pointer
      focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
      switch
      group
    "
  >
    <span class="sr-only">Use setting</span>
    <span aria-hidden="true" class="switch__bg" />
    <span aria-hidden="true" :class="enabled ? 'on' : 'off'" class="switch__pipe" />
    <span aria-hidden="true" :class="enabled ? 'on' : 'off'" class="switch__dot" />
  </Switch>
</template>

<script lang="ts">
import { ref, Ref, defineComponent } from 'vue';
import { Switch } from '@headlessui/vue';

export default defineComponent({
  components: {
    Switch,
  },
  setup(props) {
    const enabled: Ref<boolean> = ref(props.on);

    return {
      enabled,
    };
  },
});
</script>

<style lang="scss" scoped>
.switch {
  @apply flex-shrink-0 relative rounded-full inline-flex items-center justify-center h-5 w-10 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500;
  &__bg {
    @apply pointer-events-none absolute bg-second-50 w-full h-full rounded-md;
  }
  &__pipe {
    @apply pointer-events-none absolute h-4 w-9 mx-auto rounded-full transition-colors ease-in-out duration-200;
    &.on {
      @apply bg-indigo-600;
    }
    &.off {
      @apply bg-second-200;
    }
  }
  &__dot {
    @apply pointer-events-none absolute left-0 inline-block h-5 w-5 border border-second-200 rounded-full bg-second-50 shadow transform ring-0 transition-transform ease-in-out duration-200;
    &.on {
      @apply translate-x-5;
    }
    &.off {
      @apply translate-x-0;
    }
  }
}
</style>
