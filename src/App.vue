<template>
  <div
    :class="isDark ? 'dark' : null"
    class="h-screen w-full flex overflow-hidden font-body"
  >
    <NotificationInfo v-if="false" />
    <ModalGeneral v-if="false" />
    <router-view class="w-full"></router-view>
  </div>
</template>

<script lang="ts">
import { ref } from "vue";
import { TransitionRoot } from "@headlessui/vue";
import NotificationInfo from "@/components/notifications/Info.vue";
import ModalGeneral from "@/components/modal/General.vue";

export default {
  components: {
    TransitionRoot,
    NotificationInfo,
    ModalGeneral,
  },
  setup() {
    let isDark = ref(false);

    return {
      isDark,
    };
  },
};
</script>
