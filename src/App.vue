<template>
    <div :class="isDark ? 'dark' : null" class="h-screen w-full flex flex-col overflow-hidden font-body">
        <aside
            :class="isOnline ? 'bg-green-500' : 'bg-red-500'"
            class="block absolute left-14 rounded-br-lg md:rounded-none md:bottom-0 md:left-0 pl-1 pr-2 py-1 md:rounded-tr-lg z-20"
        >
            <StatusOnlineIcon v-if="isOnline" class="h-5 w-5 text-second-50" />
            <StatusOfflineIcon v-else class="h-5 w-5 text-second-50" />
        </aside>
        <Suspense>
            <router-view class="w-full"></router-view>
        </Suspense>
    </div>
    <SuccessModal
        :open="isSuccessOpened"
        :title="title"
        :text="content"
        @close="closeAndRefresh"
        @main="closeAndRefresh"
    />
    <ErrorModal :open="isErrorOpened" :title="title" :text="content" @close="closeAndRefresh" @main="closeAndRefresh" />
    <Cover />
    <PWArefresh />
</template>

<script setup lang="ts">
    import { storeToRefs } from 'pinia';
    import { useActions } from 'vuex-composition-helpers';
    import { useModalState } from './store/modals.pinia';
    import Cover from '@/components/overall/Cover.vue';
    import ErrorModal from '@/components/modal/ErrorModal.vue';
    import PWArefresh from '@/components/PWArefresh.vue';
    import SuccessModal from '@/components/modal/SuccessModal.vue';

    import { FUNES } from './helpers/funes';

    console.log(FUNES);
    FUNES.greet();

    const isDark = useDark();
    const toggleDark = useToggle(isDark);

    if (isDark.value) {
        toggleDark();
    }

    const router = useRouter();
    const store = useModalState();
    const { isOpened, modalType, title, content } = storeToRefs(store);
    const { closeModal } = store;

    const isErrorOpened = computed(() => modalType.value === 'error' && isOpened.value);
    const isSuccessOpened = computed(() => modalType.value === 'success' && isOpened.value);

    const closeAndRefresh = () => {
        closeModal();
        router.go(0);
    };

    const isOnline = useOnline();

    if (localStorage.getItem('user')) {
        const user = JSON.parse(localStorage.getItem('user'));

        const { setUser } = useActions(['setUser']);
        setUser(user);
    }
</script>
