<template>
    <div></div>
</template>

<script lang="ts">
    import { ref, Ref, computed, ComputedRef, defineComponent } from 'vue';
    import { useStore } from 'vuex';
    import { useRouter } from 'vue-router';
    import { useActions } from 'vuex-composition-helpers';

    export default defineComponent({
        setup() {
            const store = useStore();
            const router = useRouter();

            const user = computed(() => {
                return store.state.loggedUser;
            });

            if (user.value) {
                if (localStorage.getItem('user')) {
                    localStorage.removeItem('user');
                }
                const { logOutUser } = useActions(['logOutUser']);
                logOutUser();
            }
            router.push('/login');
        },
    });
</script>
