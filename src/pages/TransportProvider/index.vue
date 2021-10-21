<template>
    <Layout>
        <header class="flex justify-start space-x-4 items-center mb-4 px-3">
            <h2 class="text-2xl font-semibold text-gray-900">Proveedores de transporte</h2>
            <router-link to="/proveedores-de-transporte/nuevo">
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
                class="col-span-full sm:col-span-4"
                field-name="name"
                placeholder="Seleccionar proveedor"
                endpoint="/transportProvider"
                :data="transportProviderId"
                @update:data="transportProviderId = $event"
            />
            <div class="col-span-4 mt-7">
                <GhostBtn size="sm" @click="clearFilters()"> Borrar filtros </GhostBtn>
            </div>
        </div>
        <UiTable class="mt-5">
            <template #header>
                <tr>
                    <th scope="col">Proveedor</th>
                    <th scope="col">Domicilio</th>
                    <th scope="col">Representante</th>
                    <th scope="col">Teléfono</th>
                    <th scope="col">Acciones</th>
                </tr>
            </template>
            <template #body>
                <tr
                    v-for="(tp, tpKey) in filteredTransportProviders"
                    :key="tp.id"
                    :class="tpKey % 2 === 0 ? 'even' : 'odd'"
                    class="body-row"
                >
                    <td :class="tp.name ? null : 'empty'">
                        {{ tp.name || 'Sin cliente' }}
                    </td>
                    <td :class="tp.address ? null : 'empty'">
                        {{ tp.address || 'Sin Direccion' }}
                    </td>
                    <td :class="tp.companyRepresentative !== null ? null : 'empty'">
                        {{ tp.companyRepresentative?.name || 'Sin Representante' }}
                    </td>
                    <td :class="tp.observations ? null : 'empty'">
                        {{ tp.companyRepresentative?.phone || 'Sin observaciones' }}
                    </td>
                    <td>
                        <div class="btn-panel">
                            <router-link :to="`/proveedores-de-transporte/${tp.id}`">
                                <CircularBtn size="xs" class="bg-blue-500">
                                    <Icon icon="PencilAlt" type="outlined" class="w-5 h-5 icon text-white" />
                                </CircularBtn>
                            </router-link>

                            <CircularBtn v-if="tp.visible" class="bg-red-500" size="xs" @click="updateVisibility(tp)">
                                <Icon icon="EyeOff" type="outlined" class="w-6 h-6 text-white" />
                            </CircularBtn>

                            <CircularBtn v-else class="bg-blue-500" size="xs" @click="openModalVisibility(tp)">
                                <Icon icon="Eye" type="outlined" class="w-6 h-6 text-white" />
                            </CircularBtn>
                        </div>
                    </td>
                </tr>
                <tr v-if="tpDB.length <= 0">
                    <td colspan="5" class="emptyState">
                        <p>No hay proveedores de transporte</p>
                    </td>
                </tr>
            </template>
        </UiTable>

        <Modal title="¿Desea inhabilitar este proveedor de transporte?" type="error" :open="showModal">
            <template #body>
                <div>
                    Una vez inhabilitado, no podrá utilizar este proveedor de transporte en ninguna otra sección de la
                    aplicación
                </div>
                <div></div>
            </template>
            <template #btn>
                <div class="flex justify-center gap-5 btn">
                    <GhostBtn size="sm" class="outline-none" @click="showModal = false"> Volver </GhostBtn>
                    <PrimaryBtn btn="btn__warning" size="sm" @click="confirm">Inhabilitar proveedor </PrimaryBtn>
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
    import GhostBtn from '@/components/ui/buttons/GhostBtn.vue';
    import CircularBtn from '@/components/ui/buttons/CircularBtn.vue';
    import UiTable from '@/components/ui/TableWrapper.vue';
    import Icon from '@/components/icon/TheAllIcon.vue';
    import FieldSelect from '@/components/ui/form/FieldSelect.vue';
    import Modal from '@/components/modal/General.vue';

    import axios from 'axios';
    const api = import.meta.env.VITE_API_URL || '/api';

    export default {
        components: {
            Layout,
            PrimaryBtn,
            CircularBtn,
            UiTable,
            Icon,
            GhostBtn,
            FieldSelect,
            Modal,
        },
        setup() {
            useTitle('Proveedores de Transporte <> Sandflow');
            const tpDB = ref([]);
            const store = useStore();
            const transportProviders = JSON.parse(JSON.stringify(store.state.transportProviders.all));
            const loading = ref(false);
            const transportProviderId = ref(-1);
            const selectedtransportProvider = ref(null);
            const showModal = ref(false);

            const filteredTransportProviders = computed(() => {
                if (transportProviderId.value > -1) {
                    return tpDB.value.filter((tp) => tp.id == transportProviderId.value);
                }

                return tpDB.value;
            });

            const clearFilters = () => {
                transportProviderId.value = -1;
            };

            const getTP = async () => {
                loading.value = true;
                tpDB.value = await axios
                    .get(`${api}/transportProvider`)
                    .catch((err) => {
                        console.log(err);
                    })
                    .then((res) => {
                        if (res.status === 200) {
                            return res.data.data;
                        }

                        return [];
                    });
                store.dispatch('setTransportProviders', tpDB.value);
            };

            const deleteTP = async (tpID) => {
                let response = await axios
                    .delete(`${api}/transportProvider/${tpID}`)

                    .then((res) => {
                        if (res.status === 200) {
                            return res.data.data;
                        }

                        return [];
                    })
                    .catch((err) => {
                        console.log(err);

                        return;
                    })
                    .finally(() => {
                        store.dispatch('deleteTransportProvider', tpID);
                        getTP();
                    });

                return {
                    response,
                };
            };

            onMounted(async () => {
                loading.value = true;
                await getTP();
                loading.value = false;
            });

            const openModalVisibility = (transportProvider) => {
                selectedtransportProvider.value = transportProvider;
                showModal.value = true;
            };

            const confirm = async () => {
                await updateVisibility(selectedtransportProvider.value);
                showModal.value = false;
            };

            const updateVisibility = async (tp) => {
                const payload = {
                    ...tp,
                    visible: !tp.visible,
                };

                await store.dispatch('updateTransportProvider', payload);
            };

            return {
                tpDB,
                deleteTP,
                loading,
                filteredTransportProviders,
                clearFilters,
                transportProviderId,
                updateVisibility,
                showModal,
                openModalVisibility,
                confirm,
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
