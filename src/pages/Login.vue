<template>
  <main class="relative">
    <aside class="space-x-4 absolute top-0 right-0 m-8">
      <button class="px-4 py-1 rounded bg-second-500 text-second-100" @click="selectedCard('login')">login</button>
      <button class="px-4 py-1 rounded bg-second-500 text-second-100" @click="selectedCard('recover')">recover</button>
      <button class="px-4 py-1 rounded bg-second-500 text-second-100" @click="selectedCard('success')">success</button>
      <button class="px-4 py-1 rounded bg-second-500 text-second-100" @click="selectedCard('error')">error</button>
    </aside>
    <LoginCard v-if="selected_card === 'login'" />
    <PassRecover v-else-if="selected_card === 'recover'" />
    <Success v-else-if="selected_card === 'success'" />
    <Error v-else-if="selected_card === 'error'" />
  </main>
</template>

<script>
import LoginCard from '@/components/auth/LoginCard.vue';
import PassRecover from '@/components/auth/PassRecover.vue';
import Success from '@/components/auth/Success.vue';
import Error from '@/components/auth/Error.vue';
export default {
  components: {
    LoginCard,
    PassRecover,
    Success,
    Error,
  },
  data() {
    return {
      selected_card: 'login',
    };
  },
  methods: {
    selectedCard(card) {
      this.selected_card = card;
    },
  },
};
</script>

<style lang="scss" scoped>
main {
  @apply min-h-screen bg-white flex flex-col justify-center items-center py-12 sm:px-6 lg:px-8;
}
</style>
