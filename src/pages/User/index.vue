<template>
    <Layout>
        <ABMHeader title="Usuarios" link="/usuarios/nuevo" />
        <div class="relative grid grid-cols-12 col-span-full gap-4 mt-2">
            <FieldSelect
                v-model:data="userId"
                title="Filtro"
                placeholder="Seleccionar usuario"
                class="col-span-full sm:col-span-5 md:col-span-3 lg:col-span-4 xl:col-span-3"
                field-name="name"
                endpoint="/user"
                endpoint-key="firstName"
                :only-visible="false"
            />
        </div>

        <VTable
            class="mt-5 lg:w-7/12 min-w-min"
            :columns="columns"
            :pagination="pagination"
            :items="filteredUsers"
            :actions="actions"
            empty-text="No hay users cargados"
        >
            <template #item="{ item: user }">
                <!-- Desktop -->
                <td>
                    {{ user.fullName }}
                </td>
                <td>{{ user.Role?.name }}</td>
                <td>
                    {{ user.email }}
                </td>
            </template>

            <!-- Mobile -->
            <template #mobileTitle="{ item }">
                {{ item.fullName || 'Sin nombre' }}
            </template>

            <template #mobileSubtitle="{ item }">
                <p><span class="font-bold">Rol: </span> {{ item.Role?.name }}</p>
                <p>
                    <span class="font-bold">Usuario {{ item.active ? 'Activo' : 'Inactivo' }}</span>
                </p>
            </template>
        </VTable>

        <DisableModal
            :open="showModal"
            title="¿Desea inhabilitar este usuario?"
            text="Una vez inhabilitado, no podrá utilizar este cliente en ninguna otra sección de la aplicación"
            @close="showModal = false"
            @main="confirmModal"
        />

        <Backdrop :open="showBackdrop" title="Ver más" @close="showBackdrop = false">
            <template #body>
                <p class="!text-lg !text-black">{{ selectedUser.fullName }}</p>
                <p class="mt-2">
                    <strong>Rol: </strong>
                    {{ selectedUser.Role?.name }}
                </p>
                <p class="mt-2">
                    <strong>Email: </strong>
                    {{ selectedUser.email }}
                </p>
            </template>
        </Backdrop>
    </Layout>
</template>

<script>
    import { useStoreLogic } from '@/helpers/useStoreLogic';

    import Layout from '@/layouts/Main.vue';
    import VTable from '@/components/ui/table/VTable.vue';
    import FieldSelect from '@/components/ui/form/FieldSelect.vue';
    import Backdrop from '@/components/modal/Backdrop.vue';
    import DisableModal from '@/components/modal/DisableModal.vue';
    import ABMHeader from '@/components/ui/ABMHeader.vue';

    export default {
        components: {
            Layout,
            VTable,
            FieldSelect,
            Backdrop,
            DisableModal,
            ABMHeader,
        },
        setup() {
            useTitle('Usuarios <> Sandflow');
            const store = useStore();
            const router = useRouter();
            const loading = ref(false);
            const userId = ref(-1);
            const selectedUser = ref(null);
            const showModal = ref(false);
            const showBackdrop = ref(false);

            const users = ref([]);

            const pagination = ref({
                sortKey: 'id',
                sortDir: 'asc',
            });

            const columns = [
                { title: 'Nombre', key: 'fullName', sortable: true },
                { title: 'Rol', key: 'Role.name', sortable: true },
                { title: 'Mail', key: 'email', sortable: true },
                { title: '', key: 'actions' },
            ];

            const actions = [
                {
                    label: 'Ver más',
                    onlyMobile: true,
                    callback: (item) => {
                        selectedUser.value = item;
                        showBackdrop.value = true;
                    },
                },
                {
                    label: 'Editar',
                    callback: (item) => {
                        router.push(`/usuarios/${item.id}`);
                    },
                },
                {
                    label: 'Inhabilitar',
                    hide: (item) => {
                        return item.visible;
                    },
                    callback: (item) => {
                        openModalVisibility(item);
                    },
                },
                {
                    label: 'Habilitar',
                    hide: (item) => {
                        return !item.visible;
                    },
                    callback: (item) => {
                        openModalVisibility(item);
                    },
                },
            ];

            const filteredUsers = computed(() => {
                if (userId.value > -1) {
                    return users.value.filter((user) => user.id == userId.value);
                }

                return users.value;
            });

            const getUsers = async () => {
                loading.value = true;

                const result = await useStoreLogic(router, store, 'user', 'getAll');

                if (result.type == 'success') {
                    users.value = result.res.map((user) => {
                        return {
                            ...user,
                            fullName: `${user.firstName || ''} ${user.midName || ''} ${user.lastName || ''} `,
                        };
                    });
                }

                // store.dispatch('setUsers', users.value);
                loading.value = false;
            };

            const openModalVisibility = async (user) => {
                selectedUser.value = user;

                if (user.visible) {
                    // Si es visible le disparamos el modal
                    showModal.value = true;

                    return;
                }
                // Si no es visible actualizamos la visibilidad
                await updateVisibility(selectedUser.value);
            };

            const confirmModal = async () => {
                await updateVisibility(selectedUser.value);
                showModal.value = false;
            };

            const updateVisibility = async (user) => {
                const payload = {
                    ...user,
                    visible: !user.visible,
                };

                const data = ref(payload);

                await store.dispatch('user_update', data);
                await getUsers();
            };

            onMounted(async () => {
                await getUsers();
            });

            return {
                users,
                userId,
                filteredUsers,
                showModal,
                openModalVisibility,
                confirmModal,
                pagination,
                columns,
                actions,
                selectedUser,
                showBackdrop,
            };
        },
    };
</script>

<style lang="scss" scoped>
    @import '@/assets/table.scss';
</style>
