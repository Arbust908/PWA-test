<template>
  <Layout>
    <h2 class="text-2xl font-semibold text-gray-900 mb-4">Panel de Control</h2>
    <section class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <PanelControlCard
        v-for="link in navigation"
        :key="link.to"
        v-bind="link"
      />
    </section>
  </Layout>
</template>

<script lang="ts">
  import { computed } from 'vue';
  import { useStore } from 'vuex';
  import Layout from '@/layouts/Main.vue';
  import PanelControlCard from '@/components/panel/ControlCard.vue';
  export default {
    components: {
      Layout,
      PanelControlCard,
    },
    setup() {
      const store = useStore();
      const navigation = computed(() => {
        return store.state.global.navigation;
      });
      return {
        navigation,
      };
    },
  };
</script>
