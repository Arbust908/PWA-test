<template>
    <div :class="isDark ? 'dark' : null">
        <router-view></router-view>
    </div>
</template>

<script setup lang="ts">
    let isDark = false;
    const toggleMode = () => {
        isDark = !isDark;
    };
</script>

<style lang="scss" scoped>
    div {
        @apply h-screen flex overflow-hidden bg-second-100 font-body;
    }
</style>
