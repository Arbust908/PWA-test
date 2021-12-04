<template>
    <div :class="isDark ? 'dark' : null" class="h-screen w-full flex overflow-hidden font-body">
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
        <Suspense>
            <router-view class="w-full"></router-view>
        </Suspense>
    </div>
</template>

<script lang="ts">
    import { ref, defineComponent, defineAsyncComponent } from 'vue';
    import { useActions } from 'vuex-composition-helpers';
    // import { useRouter } from 'vue-router';
    import { useDark, useToggle, useOnline } from '@vueuse/core';

    // import { StatusOnlineIcon, StatusOfflineIcon } from '@heroicons/vue/outline';

    export default defineComponent({
        components: {
            // StatusOnlineIcon,
            // StatusOfflineIcon,
        },
        setup() {
            const isDark = useDark();
            const toggleDark = useToggle(isDark);

            if (isDark.value) {
                toggleDark();
            }

            const isOnline = useOnline();

            // const router = useRouter();
            if (localStorage.getItem('user')) {
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
