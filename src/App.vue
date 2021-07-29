<template>
  <div
    :class="isDark ? 'dark' : null"
    class="h-screen w-full flex overflow-hidden font-body"
  >
    <router-view class="w-full"></router-view>
  </div>
</template>

<script lang="ts">
import { ref } from 'vue';
import { useActions, useGetters } from 'vuex-composition-helpers';
import { useRouter } from 'vue-router';

export default {
  setup() {
    let isDark = ref(false);
    const router = useRouter();
    const { getUserToken: loggedUser } = useGetters(['getUserToken']);
    if (localStorage.getItem('user') && !loggedUser.value) {
      const user = JSON.parse(localStorage.getItem('user'));
      const { setUser } = useActions(['setUser']);
      setUser(user);
      router.push('/');
    }

    return {
      isDark,
    };
  },
};
</script>
