<template>
    <Layout>
        <header class="flex justify-start space-x-4 items-center mb-4">
            <h2 class="text-2xl font-semibold text-gray-900">Forklift</h2>
            <router-link to="/forklift/nuevo">
                <PrimaryBtn size="sm"
                    >Crear
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
                placeholder="Seleccionar forklift"
                endpoint="/forklift"
                :data="forkliftId"
                @update:data="forkliftId = $event"
            />
            <div class="col-span-full sm:mt-7 sm:col-span-5">
                <GhostBtn size="sm" @click="clearFilters()"> Borrar filtros </GhostBtn>
            </div>
        </div>

        <VTable class="mt-5" :columns="columns" :pagination="pagination" :items="filteredForklifts" :actions="actions">
            <template #item="{ item }" class="asddaads">
                <!-- Desktop -->
                <td :class="[item.name ? null : 'empty', item.visible ? null : 'notallowed']">
                    {{ item.name || 'Sin nombre' }}
                </td>

                <td :class="[item.observations ? null : 'empty', item.visible ? null : 'notallowed observations']">
                    {{ item.observations || 'Sin observaciones' }}
                </td>

                <tr v-if="fDB && fDB.length <= 0">
                    <td colspan="5" class="emptyState">
                        <p>No hay forklifts cargados</p>
                    </td>
                </tr>
            </template>

            <!-- Mobile -->
            <template #mobileTitle="{ item }">
                {{ item.name }}
            </template>

            <template #mobileSubtitle="{ item }">
                <div v-if="item.observations">
                    <span class="font-bold">Observaciones: </span>{{ item.observations }}
                </div>
                <div v-else>Sin observaciones</div>
            </template>
        </VTable>

        <Modal title="¿Desea inhabilitar este forklift?" type="error" :open="showModal">
            <template #body>
                <div>
                    Una vez inhabilitado, no podrá utilizar este forklift en ninguna otra sección de la aplicación
                </div>
            </template>
            <template #btn>
                <div class="flex justify-center gap-5 btn">
                    <GhostBtn class="outline-none" @click="showModal = false"> Volver </GhostBtn>
                    <PrimaryBtn btn="btn__warning" @click="confirmModal">Inhabilitar Forklift </PrimaryBtn>
                </div>
            </template>
        </Modal>
    </Layout>
</template>

<script>
    import { onMounted, ref, computed } from 'vue';
    import { useStore } from 'vuex';
    import { useTitle } from '@vueuse/core';
    import Layout from '@/layouts/Main.vue';
    import PrimaryBtn from '@/components/ui/buttons/PrimaryBtn.vue';
    import CircularBtn from '@/components/ui/buttons/CircularBtn.vue';
    import UiTable from '@/components/ui/TableWrapper.vue';
    import Icon from '@/components/icon/TheAllIcon.vue';
    import { useStoreLogic } from '@/helpers/useStoreLogic';
    import { useRouter } from 'vue-router';
    import Modal from '@/components/modal/General.vue';
    import GhostBtn from '@/components/ui/buttons/GhostBtn.vue';
    import FieldSelect from '@/components/ui/form/FieldSelect.vue';
    import Popper from 'vue3-popper';
    import VTable from '@/components/ui/table/VTable.vue';

    export default {
        components: {
            Layout,
            Modal,
            PrimaryBtn,
            UiTable,
            Icon,
            GhostBtn,
            CircularBtn,
            FieldSelect,
            Popper,
            VTable,
        },
        setup() {
            useTitle('Forklifts <> Sandflow');
            const fDB = ref([]);
            const store = useStore();
            const router = useRouter();
            const loading = ref(false);
            const notificationModalvisible = ref(false);
            const toggleNotificationModal = () => (notificationModalvisible.value = !notificationModalvisible.value);
            const errorMessage = ref('');
            const forkliftId = ref(-1);
            const selectedForklift = ref(null);
            const showModal = ref(false);

            const pagination = ref({
                sortKey: 'id',
                sortDir: 'asc',
                // currentPage: 1,
                // perPage: 10,
            });

            const columns = [
                { title: 'Nombre', key: 'name', sortable: true },
                { title: 'Observaciones', key: 'observations', sortable: false },
                { title: 'Acciones', style: 'asd' },
            ];

            const actions = [
                {
                    label: 'Ver más',
                    onlyMobile: true,
                    callback: () => {
                        console.log('Ver más');
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

            const filteredForklifts = computed(() => {
                if (forkliftId.value > -1) {
                    return fDB.value.filter((forklift) => forklift.id == forkliftId.value);
                }

                return fDB.value;
            });

            const clearFilters = () => {
                forkliftId.value = -1;
            };

            const openModalVisibility = async (forklift) => {
                selectedForklift.value = forklift;

                if (forklift.visible) {
                    showModal.value = true;

                    return;
                }
                await updateVisibility(selectedForklift.value);
            };

            const confirmModal = async () => {
                await updateVisibility(selectedForklift.value);
                showModal.value = false;
            };

            const updateVisibility = async (forklift) => {
                const payload = {
                    ...forklift,
                    visible: !forklift.visible,
                };
                delete payload.owned;
                await store.dispatch('forklift_update', payload);
            };

            const getForklifts = async () => {
                await useStoreLogic(router, store, 'forklift', 'getAll').then((res) => {
                    if (res.type == 'failed') {
                        errorMessage.value = res.message;
                        toggleNotificationModal();
                    }

                    if (res.type == 'success') {
                        fDB.value = res.res;
                    }
                });
            };

            onMounted(async () => {
                loading.value = true;
                await getForklifts();
                loading.value = false;
            });

            return {
                fDB,
                loading,
                notificationModalvisible,
                toggleNotificationModal,
                errorMessage,
                forkliftId,
                filteredForklifts,
                clearFilters,
                showModal,
                openModalVisibility,
                confirmModal,
                pagination,
                actions,
                columns,
            };
        },
    };
</script>

<style lang="scss" scoped>
    @import '@/assets/table.scss';
    .closeButton {
        @apply inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-200 sm:bg-transparent text-base font-medium text-second-400 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:text-sm mt-3;
    }

    .outline-none {
        outline: 0;
    }
</style>
