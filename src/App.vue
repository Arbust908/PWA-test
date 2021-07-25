<template>
  <div
    :class="isDark ? 'dark' : null"
    class="h-screen w-full flex overflow-hidden font-body"
  >
    <!-- <aside
      :class="isOnline ? 'bg-green-500' : 'bg-red-500'"
      class="
        block
        absolute
        left-[57px]
        rounded-br-lg
        md:rounded-none md:bottom-0 md:left-0
        pl-1
        pr-2
        py-1
        md:rounded-tr-lg
        z-20
      "
    >
      <StatusOnlineIcon v-if="isOnline" class="h-5 w-5 text-second-50" />
      <StatusOfflineIcon v-else class="h-5 w-5 text-second-50" />
    </aside> -->
    <NotificationInfo v-if="false" />
    <ModalGeneral v-if="false" />
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
      StatusOnlineIcon,
      StatusOfflineIcon,
    },
    setup() {
      console.log(import.meta.env);
      const isDark = useDark();
      const isOnline = useOnline();
      const toggleDark = useToggle(isDark);
      const router = useRouter();
      console.log(localStorage.getItem('user'));
      if (localStorage.getItem('user')) {
        console.log('Guardo el Usuario');
        const user = JSON.parse(localStorage.getItem('user'));
        const { setUser } = useActions(['setUser']);
        setUser(user);
      }

      return {
        isDark,
        isOnline,
        toggleDark,
      };
    },
  });
</script>
