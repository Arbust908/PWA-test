<template>
  <div
    :class="isDark ? 'dark' : null"
    class="h-screen flex overflow-hidden bg-second-100 font-body"
  >
    <ModeToggle @click="toggleMode" />
    <router-view></router-view>
  </div>
</template>

<script lang="ts">
export default {
  setup() {
    let isDark = false;
    const toggleMode = () => {
      isDark = !isDark;
    };

    return {
      toggleMode,
      isDark,
    };
  },
};
</script>
