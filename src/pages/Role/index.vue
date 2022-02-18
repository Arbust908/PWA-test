<template>
    <Layout>
        <ABMHeader title="Roles" link="/rol/nuevo" />
        <div class="relative grid grid-cols-12 col-span-full gap-4 mt-2">
            <FieldSelect
                v-model:data="selectedId"
                title="Filtro"
                class="col-span-full sm:col-span-5 md:col-span-3 lg:col-span-4 xl:col-span-3"
                field-name="name"
                placeholder="Seleccionar rol"
                :endpoint-data="roles"
            />
        </div>

        <VTable
            class="mt-5 min-w-full lg:min-w-min"
            :columns="columns"
            :pagination="pagination"
            :items="getFiltered"
            :actions="actions"
            disable-key="visible"
            empty-text="No hay Roles"
        >
            <template #item="{ item }" class="asddaads">
                <!-- Desktop -->
                <td :class="item.name ? null : 'empty'">
                    {{ item.name || 'Sin nombre' }}
                </td>

                <td :class="item.permissions?.view ? null : 'empty'">
                    {{ item.permissions?.view.length || 'Sin permisos' }}
                </td>
            </template>

            <!-- Mobile -->
            <template #mobileTitle="{ item }">
                {{ item.name }}
            </template>

            <template #mobileSubtitle="{ item }">
                <div v-if="item.permissions?.view">
                    <span class="font-bold">Observaciones: </span>{{ item.permissions?.view.length }}
                </div>
                <div v-else>Sin permisos</div>
            </template>
        </VTable>
        <button @click="loadingPack">loading</button>
    </Layout>
</template>

<script setup lang="ts">
    import ABMHeader from '@/components/ui/ABMHeader.vue';
    import FieldSelect from '@/components/ui/form/FieldSelect.vue';
    import Layout from '@/layouts/Main.vue';
    import VTable from '@/components/ui/table/VTable.vue';
    import { useRoleStore } from '@/store/role.pinia';
    import { storeToRefs } from 'pinia';
    import { useGlobalStore } from '@/store/global.pinia';
    import axios from 'axios';
    import { Role } from '@/interfaces/sandflow';
    const api = import.meta.env.VITE_API_URL || '/api';

    useTitle('<> Roles');
    const roleStore = useRoleStore();
    const globalStore = useGlobalStore();
    const { isLoading } = storeToRefs(globalStore);
    const store = useStore();
    const router = useRouter();

    const { roles, permissions, selectedId, getSelected, getFiltered } = storeToRefs(roleStore);

    // Table config
    const pagination = ref({
        sortKey: 'id',
        sortDir: 'asc',
    });

    const columns = [
        { title: 'Nombre', key: 'name', sortable: true },
        { title: 'Permisos', key: 'permissions', sortable: false },
        { title: '', style: 'actions' },
    ];

    const actions = [
        {
            label: 'Editar',
            callback: (item: Role) => {
                router.push(`/rol/${item.id}`);
            },
        },
    ];
    const loadingPack = () => {
        isLoading.value = true;

        setTimeout(() => {
            isLoading.value = false;
        }, 2000);
    };

    onMounted(async () => {
        await axios
            .get(`${api}/role`)
            .then((res) => {
                if (res.status == 200) {
                    roles.value = res.data?.data;
                    isLoading.value = false;

                    return res.data.data;
                }
            })
            .catch((err) => {
                console.error(err);
            });
    });
</script>

<style scoped lang="scss">
    @import '@/assets/table.scss';
</style>
