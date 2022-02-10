<template>
    <Layout>
        <h2 class="text-2xl font-semibold text-gray-900 mb-4">Panel de control</h2>
        <section class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <PanelControlCard v-for="link in navigation" :key="link.to" v-bind="link" />
        </section>
    </Layout>
</template>

<script setup lang="ts">
    import Layout from '@/layouts/Main.vue';
    import PanelControlCard from '@/components/panel/ControlCard.vue';

    useTitle('Home <> Sandflow');
    const store = useStore();
    const navigation = computed(() => {
        const navigationItems = JSON.parse(JSON.stringify(store.state.global.navigation));
        const storePermissions = store.getters.getUserPermissions;
        const permissions = JSON.parse(JSON.stringify(storePermissions));

        return navigationItems.filter((nav) => {
            const isLine = nav.name === 'LINE';
            const hasDestination = nav.to !== undefined;
            const permitedRoutes = permissions.view;
            const hasPermission = permitedRoutes.includes(nav.title);

            return !isLine && hasDestination && hasPermission;
        });
    });
</script>
