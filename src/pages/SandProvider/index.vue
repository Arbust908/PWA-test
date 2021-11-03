<template>
    <Layout>
        <header class="flex justify-start space-x-4 items-center mb-4">
            <h2 class="text-2xl font-semibold text-gray-900">Centro de carga de arena</h2>
            <router-link :to="{ name: 'NewSandProvider' }">
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
                placeholder="Seleccionar centro de carga"
                class="col-span-full sm:col-span-5 md:col-span-3 lg:col-span-4 xl:col-span-3"
                field-name="name"
                endpoint-key="name"
                endpoint="/sandProvider"
                :data="sandProviderId"
                @update:data="sandProviderId = $event"
            />
            <div class="col-span-4 mt-7">
                <GhostBtn size="sm" @click="clearFilters()"> Borrar filtros </GhostBtn>
            </div>
        </div>

        <UiTable class="mt-6">
            <template #header>
                <tr>
                    <th v-for="column in tableColumns" :key="column" scope="col">
                        <div class="flex justify-center">
                            {{ column }}
                            <Icon icon="ArrowUp" class="w-4 h-4" />
                            <Icon icon="ArrowDown" class="w-4 h-4" />
                        </div>
                    </th>
                    <th scope="col">Acciones</th>
                </tr>
            </template>
            <template #body>
                <tr
                    v-for="(sandProvider, spKey) in filteredSandProviders"
                    :key="sandProvider.id"
                    :class="spKey % 2 === 0 ? 'even' : 'odd'"
                    class="body-row"
                >
                    <td :class="sandProvider.name ? null : 'empty'" class="text-center">
                        {{ sandProvider?.name || 'Sin nombre' }}
                    </td>
                    <td :class="sandProvider.address ? null : 'empty'">
                        {{ sandProvider?.address || 'Sin dirección' }}
                    </td>
                    <td :class="sandProvider.meshType ? null : 'empty'">
                        <p v-for="meshType in sandProvider.meshType" :key="meshType">
                            {{ meshType?.type || '-' }}
                        </p>
                    </td>
                    <td :class="sandProvider.companyRepresentative ? null : 'empty'">
                        {{ sandProvider.companyRepresentative?.name || 'Sin definir' }}
                    </td>
                    <td :class="sandProvider.companyRepresentative ? null : 'empty'">
                        {{ sandProvider.companyRepresentative?.phone || 'Sin definir' }}
                    </td>
                    <td class="text-center">
                        <div class="btn-panel">
                            <router-link :to="`/proveedores-de-arena/${sandProvider.id}`">
                                <Popper hover content="Editar">
                                    <CircularBtn size="xs" class="bg-blue-500">
                                        <Icon icon="PencilAlt" type="outlined" class="w-6 h-6 icon text-white" />
                                    </CircularBtn>
                                </Popper>
                            </router-link>

                            <Popper hover :content="sandProvider.visible ? 'Inhabilitar' : 'Habilitar'">
                                <CircularBtn
                                    class="ml-4"
                                    :class="sandProvider.visible ? 'bg-red-500' : 'bg-blue-500'"
                                    size="xs"
                                    @click="openModalVisibility(sandProvider)"
                                >
                                    <Icon
                                        v-if="sandProvider.visible"
                                        icon="EyeOff"
                                        type="outlined"
                                        class="w-6 h-6 text-white"
                                    />
                                    <Icon v-else icon="Eye" type="outlined" class="w-6 h-6 text-white" />
                                </CircularBtn>
                            </Popper>
                        </div>
                    </td>
                </tr>
                <tr v-if="sandProviders.length <= 0">
                    <td colspan="5" class="emptyState">
                        <p>No hay proveedores de arena</p>
                    </td>
                </tr>
            </template>
        </UiTable>
        <Modal type="off" :open="notificationModalvisible" @close="toggleNotificationModal">
            <template #body>
                <p>{{ errorMessage }}</p>
                <button class="closeButton" @click.prevent="toggleNotificationModal">Cerrar</button>
            </template>
        </Modal>

        <Modal title="¿Desea inhabilitar este centro de carga de arena?" type="error" :open="showModal">
            <template #body>
                <div>
                    Una vez inhabilitado, no podrá utilizar este centro de carga de arena en ninguna otra sección de la
                    aplicación
                </div>
                <div></div>
            </template>
            <template #btn>
                <div class="flex justify-center gap-5 btn">
                    <GhostBtn class="outline-none" @click="showModal = false"> Volver </GhostBtn>
                    <PrimaryBtn btn="btn__warning" @click="confirmModal">Inhabilitar centro de carga </PrimaryBtn>
                </div>
            </template>
        </Modal>
    </Layout>
</template>

<script>
    import { onMounted, ref, computed } from 'vue';
    import { useStore } from 'vuex';
    import { useTitle } from '@vueuse/core';
    import { useRouter } from 'vue-router';
    import { useStoreLogic } from '@/helpers/useStoreLogic';
    import Layout from '@/layouts/Main.vue';
    import PrimaryBtn from '@/components/ui/buttons/PrimaryBtn.vue';
    import GhostBtn from '@/components/ui/buttons/GhostBtn.vue';
    import CircularBtn from '@/components/ui/buttons/CircularBtn.vue';
    import UiTable from '@/components/ui/TableWrapper.vue';
    import Icon from '@/components/icon/TheAllIcon.vue';
    import Modal from '@/components/modal/General.vue';
    import FieldSelect from '@/components/ui/form/FieldSelect.vue';
    import Popper from 'vue3-popper';

    export default {
        components: {
            Layout,
            PrimaryBtn,
            GhostBtn,
            UiTable,
            Icon,
            Modal,
            FieldSelect,
            CircularBtn,
            Popper,
        },
        setup() {
            useTitle(`Centro de carga de Arena <> Sandflow`);
            const sandProviders = ref([]);
            const store = useStore();
            const router = useRouter();
            const loading = ref(false);
            const notificationModalvisible = ref(false);
            const toggleNotificationModal = () => (notificationModalvisible.value = !notificationModalvisible.value);
            const errorMessage = ref('');
            const sandProviderId = ref(-1);
            const selectedsandProvider = ref(null);
            const showModal = ref(false);
            const tableColumns = ['Proveedor', 'Domicilio', 'Tipo de Malla', 'Representante', 'Teléfono'];

            onMounted(async () => {
                loading.value = true;
                await useStoreLogic(router, store, 'sandProvider', 'getAll').then((res) => {
                    if (res.type == 'failed') {
                        errorMessage.value = res.message;
                        toggleNotificationModal();
                    }

                    if (res.type == 'success') {
                        sandProviders.value = store.getters['getSandProviders'];
                    }
                });
                loading.value = false;
            });

            const filteredSandProviders = computed(() => {
                if (sandProviderId.value > -1) {
                    return sandProviders.value.filter((sandProvider) => sandProvider.id == sandProviderId.value);
                }

                return sandProviders.value;
            });

            const clearFilters = () => {
                sandProviderId.value = -1;
            };

            const openModalVisibility = async (sandProvider) => {
                selectedsandProvider.value = sandProvider;

                if (sandProvider.visible) {
                    showModal.value = true;

                    return;
                }
                await updateVisibility(selectedsandProvider.value);
            };

            const confirmModal = async () => {
                await updateVisibility(selectedsandProvider.value);
                showModal.value = false;
            };

            const updateVisibility = async (sandProvider) => {
                const payload = {
                    ...sandProvider,
                    visible: !sandProvider.visible,
                };

                await store.dispatch('sandProvider_update', payload);
            };

            return {
                sandProviders,
                loading,
                notificationModalvisible,
                toggleNotificationModal,
                errorMessage,
                filteredSandProviders,
                sandProviderId,
                clearFilters,
                showModal,
                openModalVisibility,
                confirmModal,
                tableColumns,
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
