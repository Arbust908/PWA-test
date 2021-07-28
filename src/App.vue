<template>
  <div
    :class="isDark ? 'dark' : null"
    class="h-screen w-full flex overflow-hidden font-body"
  >
    <router-view class="w-full"></router-view>
  </div>
</template>

<script lang="ts">
  import { ref, defineComponent } from 'vue';
  import NotificationInfo from '@/components/notifications/Info.vue';
  import ModalGeneral from '@/components/modal/General.vue';
  import { useActions } from 'vuex-composition-helpers';
  export default defineComponent({
    components: {
      NotificationInfo,
      ModalGeneral,
    },
    setup() {
      console.log(import.meta.env);
      let isDark = ref(false);
      // const router = useRouter();
      if (localStorage.getItem('user') !== null) {
        const user = JSON.parse(localStorage.getItem('user'));
        const { setUser } = useActions(['setUser']);
        setUser(user);
      }
      return {
        isDark,
      };
    },
  });
</script>
