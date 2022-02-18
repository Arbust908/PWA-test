<template>
    <form method="POST" action="/" class="p-4 w-full flex flex-col lg:flex-row" @submit.prevent>
        <FieldGroup>
            <FieldInput
                v-model:data="newRole.name"
                class="col-span-10 md:col-span-6"
                field-name="name"
                placeholder="Nombre de Forklift"
                title="Nombre"
                require-validation
                entity="role"
            />
            <div class="md:col-span-6 opacity-50">
                <p class="text-xs">Ultima actualización</p>
                <p class="uppercase">
                    {{ formatGoodDate(newRole.updatedAt) }}
                </p>
            </div>
            <section class="col-span-full grid gap-2 grid-routes">
                <!-- <article v-for="route" class="rounded shadow p-2"></article> -->
                <article
                    v-for="route in newRole.permissions.view"
                    :key="route.name"
                    class="rounded shadow p-2 h-24 relative"
                >
                    <h2 class="font-bold">{{ route.name }}</h2>
                    <p class="text-sm opacity-50">{{ route.path }}</p>
                    <FieldToggle
                        class="!absolute bottom-2 right-2"
                        :field-name="`toggle-${route.name}`"
                        :data="route.isActive"
                        @toggle="togglePermition($event, route)"
                    />
                </article>
            </section>
        </FieldGroup>
    </form>
</template>

<script setup lang="ts">
    import { defineProps } from 'vue';
    import { Role } from '@/interfaces/sandflow';
    import FieldGroup from '@/components/ui/form/FieldGroup.vue';
    import FieldInput from '@/components/ui/form/FieldInput.vue';
    import FieldToggle from '@/components/ui/form/FieldToggle.vue';
    const props = defineProps({
        role: {
            type: Object,
            required: true,
        },
    });
    const emits = defineEmits(['update:role']);
    const data = useVModel(props, 'role', emits);
    const router = useRouter();
    const routes = router.options.routes
        .filter((route) => !route?.isGeneric)
        .map((route) => {
            const { path, name } = route;

            return { path, name: String(name) };
        });
    const newRole = ref({
        ...data.value,
    });

    const formatGoodDate = (date: string) => {
        if (!date) {
            return '-';
        }
        const newDate = new Date(date);
        const day = new Intl.DateTimeFormat('es', { dateStyle: 'medium' });

        return day.format(newDate);
    };
    const hasPermitionToUse = (routeName: string) => {
        const { permissions } = data.value as Role;

        if (!permissions) {
            return false;
        }
        const { view } = permissions;

        return view.includes(routeName);
    };
    const togglePermition = (event, name) => {
        const { permissions } = data.value as Role;

        if (!permissions) {
            return false;
        }
        const { view } = permissions;

        if (!view) {
            return false;
        }

        console.log(name.isActive, event);
        name.isActive = !event;
        console.log(name.isActive);
    };
    onBeforeMount(() => {
        const routePermissions = routes.map((route) => {
            const isActive = hasPermitionToUse(route.name);

            return {
                ...route,
                isActive,
            };
        });
        console.log(newRole.value);
        console.log(newRole.value.permissions);
        newRole.value.permissions.view = routePermissions;
    });
</script>

<style scoped lang="scss">
    .grid-routes {
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    }
</style>
