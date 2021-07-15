<template>
  <div :class="isDark ? 'dark' : null" class="h-screen w-full flex overflow-hidden font-body">
    <NotificationInfo v-if="false" />
    <ModalGeneral v-if="false" />
    <router-view class="w-full"></router-view>
  </div>
</template>

<script lang="ts">
import { ref } from 'vue';
import NotificationInfo from '@/components/notifications/Info.vue';
import ModalGeneral from '@/components/modal/General.vue';
import { useActions } from 'vuex-composition-helpers';
// import { useRouter } from 'vue-router';

export default {
  components: {
    NotificationInfo,
    ModalGeneral,
  },
  setup() {
    let isDark = ref(false);
    // const router = useRouter();
    if (localStorage.getItem('user')) {
      const user = JSON.parse(localStorage.getItem('user'));
      const { setUser } = useActions(['setUser']);
      setUser(user);
    }

    return {
      isDark,
    };
  },
};
</script>
