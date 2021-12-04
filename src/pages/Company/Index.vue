<template>
    <Layout>
        <header class="flex justify-start space-x-4 items-center mb-4">
            <h2 class="text-2xl font-semibold text-gray-900">Clientes</h2>
            <router-link to="/clientes/nuevo">
                <PrimaryBtn size="sm">
                    <span>Crear</span>
                    <Icon icon="PlusCircle" class="ml-1 w-4 h-4" />
                </PrimaryBtn>
            </router-link>
        </header>
        <hr />
        <div class="relative grid grid-cols-12 col-span-full gap-4 mt-2">
            <FieldSelect
                title="Filtro"
                class="col-span-full sm:col-span-5 md:col-span-3 lg:col-span-4 xl:col-span-3"
                field-name="name"
                placeholder="Seleccionar cliente"
                endpoint="/company"
                :data="clientId"
                @update:data="clientId = $event"
            />
            <div class="col-span-full sm:mt-7 sm:col-span-5">
                <GhostBtn size="sm" @click="clearFilters()"> Borrar filtros </GhostBtn>
            </div>
        </div>

        <VTable
            class="mt-5"
            :columns="columns"
            :items="filteredClients"
            :actions="actions"
            empty-text="No hay clientes cargados"
        >
            <template #item="{ item }">
                <!-- Desktop -->
                <td :class="item.name ? null : 'empty'">
                    {{ item.name || 'Sin definir' }}
                </td>

                <td :class="item.legalId ? null : 'empty'">
                    {{ item.legalId || 'Sin definir' }}
                </td>

                <td :class="item.companyRepresentative ? null : 'empty'">
                    {{ item.companyRepresentative.name || 'Sin definir' }}
                </td>

                <td :class="item.companyRepresentative ? null : 'empty'">
                    {{ item.companyRepresentative.phone || 'Sin definir' }}
                </td>

                <td class="text-center" :class="item ? null : 'empty'">
                    <Badge v-if="item.isOperator" text="SI" classes="bg-gray-500 text-white px-5" />
                    <Badge v-else text="NO" classes="bg-gray-300 text-gray-600" />
                </td>
            </template>

            <!-- Mobile -->
            <template #mobileTitle="{ item }">
                {{ item.name }}
            </template>

            <template #mobileSubtitle="{ item }">
                <span class="font-bold">Domicilio: </span>{{ item.address }}
            </template>
        </VTable>

        <Modal title="¿Desea inhabilitar este cliente?" type="error" :open="showModal" class="sm:w-[440px] !py-8">
            <template #body>
                <div class="m-4">
                    Una vez inhabilitado, no podrá utilizar este cliente en ninguna otra sección de la aplicación
                </div>
            </template>
            <template #btn>
                <div class="flex justify-center gap-5 btn">
                    <GhostBtn btn="!text-gray-500" @click="showModal = false"> Volver </GhostBtn>
                    <PrimaryBtn btn="!px-10 !bg-red-700" @click="confirmModal">Inhabilitar </PrimaryBtn>
                </div>
            </template>
        </Modal>
        <Backdrop :open="showBackdrop" title="Ver más" @close="showBackdrop = false">
            <template #body>
                <p class="!text-lg !text-black">{{ selectedClient.name }}</p>
                <p class="mt-2">
                    <strong>CUIT: </strong>
                    {{ selectedClient.legalId }}
                </p>
                <p class="mt-2">
                    <strong>Representante: </strong>
                    {{ selectedClient.companyRepresentative?.name }}
                </p>
                <p class="mt-2">
                    <strong>Teléfono: </strong>
                    {{ selectedClient.companyRepresentative?.phone }}
                </p>
                <p class="mt-2">
                    <strong>Operadora: </strong>
                    {{ selectedClient.isOperator ? 'SI' : 'NO' }}
                </p>
            </template>
        </Backdrop>
    </Layout>
</template>

<script>
    import { onMounted, ref, computed } from 'vue';
    import { useTitle } from '@vueuse/core';
    import { useRouter } from 'vue-router';
    import { useStore } from 'vuex';
    import Layout from '@/layouts/Main.vue';
    import PrimaryBtn from '@/components/ui/buttons/PrimaryBtn.vue';
    import GhostBtn from '@/components/ui/buttons/GhostBtn.vue';
    import Icon from '@/components/icon/TheAllIcon.vue';
    import Modal from '@/components/modal/General.vue';
    import FieldSelect from '@/components/ui/form/FieldSelect.vue';
    import VTable from '@/components/ui/table/VTable.vue';
    import Badge from '@/components/ui/Badge.vue';
    import axios from 'axios';
    const apiUrl = import.meta.env.VITE_API_URL || '/api';
    import Backdrop from '@/components/modal/Backdrop.vue';

    export default {
        components: {
            Layout,
            PrimaryBtn,
            GhostBtn,
            Icon,
            FieldSelect,
            Badge,
            Modal,
            VTable,
            Backdrop,
        },
        setup() {
            useTitle('Clientes <> Sandflow');
            const store = useStore();
            const clDB = ref([]);
            const loading = ref(false);
            const clientId = ref(-1);
            const selectedClient = ref(null);
            const showModal = ref(false);
            const router = useRouter();
            const showBackdrop = ref(false);

            const columns = [
                { title: 'Cliente', key: 'name', sortable: true },
                { title: 'CUIT', key: 'legalId', sortable: true },
                { title: 'Representante', key: 'companyRepresentative.name', sortable: true },
                { title: 'Teléfono', key: 'companyRepresentative.phone', sortable: true },
                { title: 'Operadora', key: 'operadora' },
                { title: 'Acciones', key: 'name' },
            ];

            const actions = [
                {
                    label: 'Ver más',
                    onlyMobile: true,
                    callback: (item) => {
                        selectedClient.value = item;
                        showBackdrop.value = true;
                    },
                },
                {
                    label: 'Editar',
                    callback: (item) => {
                        router.push(`/clientes/${item.id}`);
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

            const headers = {
                'Content-Type': 'Application/JSON',
            };

            const total = computed(() => {
                return clientId.value;
            });

            const filteredClients = computed(() => {
                if (clientId.value > -1) {
                    return clDB.value.filter((client) => client.id == clientId.value);
                }

                return clDB.value;
            });

            const getClients = async () => {
                loading.value = true;

                const res = await axios.get(`${apiUrl}/company`, headers).catch((err) => {
                    console.log(err);
                });

                if (res.status === 200) {
                    clDB.value = res.data.data;
                }
                store.dispatch('setClients', clDB.value);

                loading.value = false;
            };

            const openModalVisibility = async (client) => {
                selectedClient.value = client;

                if (client.visible) {
                    showModal.value = true;

                    return;
                }
                await update(selectedClient.value);
            };

            const confirmModal = async () => {
                await update(selectedClient.value);
                showModal.value = false;
            };

            const update = async (client) => {
                const payload = {
                    ...client,
                    visible: !client.visible,
                };
                await store.dispatch('updateVisibilityClient', payload);
                await getClients();
            };

            onMounted(async () => {
                await getClients();
            });

            const clearFilters = () => {
                clientId.value = -1;
            };

            return {
                clDB,
                loading,
                filteredClients,
                clientId,
                clearFilters,
                total,
                update,
                openModalVisibility,
                confirmModal,
                showModal,
                columns,
                actions,
                showBackdrop,
                selectedClient,
            };
        },
    };
</script>

<style lang="scss" scoped>
    @import '@/assets/table.scss';
    .outline-none {
        outline: 0;
    }
</style>
