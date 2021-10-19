<template>
    <Layout>
        <header class="flex justify-start space-x-4 items-center mb-4 px-3">
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
                placeholder="Seleccionar forklift"
                class="col-span-full sm:col-span-4"
                field-name="name"
                endpoint-key="name"
                endpoint="/forklift"
                :data="forkliftId"
                @update:data="forkliftId = $event"
            />

            <div class="col-span-4 mt-7">
                <GhostBtn size="sm" @click="clearFilters()"> Borrar filtros </GhostBtn>
            </div>
        </div>
        <UiTable class="mt-5">
            <template #header>
                <tr>
                    <th scope="col">Nombre</th>
                    <th class="w-1/5" scope="col">Observaciones</th>
                    <th scope="col">
                        <span class="sr-olny">Acciones</span>
                    </th>
                </tr>
            </template>
            <template #body>
                <tr
                    v-for="(f, fKey) in filteredForklifts"
                    :key="f.id"
                    :class="fKey % 2 === 0 ? 'even' : 'odd'"
                    class="body-row"
                >
                    <td :class="f.name ? null : 'empty'">
                        {{ f.name || 'Sin nombre' }}
                    </td>
                    <td :class="f.observations ? null : 'empty'">
                        <p class="w-52 truncate">
                            {{ f.observations || 'Sin observaciones' }}
                        </p>
                    </td>
                    <td>
                        <div class="btn-panel">
                            <router-link :to="`/forklift/${f.id}`">
                                <CircularBtn size="xs" class="bg-blue-500">
                                    <Icon icon="PencilAlt" type="outlined" class="w-6 h-6 icon text-white" />
                                </CircularBtn>
                            </router-link>

                            <CircularBtn
                                size="xs"
                                :class="f.visible ? 'bg-red-500' : 'bg-blue-500'"
                                @click="updateVisibility(f)"
                            >
                                <Icon :icon="f.visible ? 'EyeOff' : 'Eye'" type="outlined" class="w-6 h-6 text-white" />
                            </CircularBtn>
                        </div>
                    </td>
                </tr>
                <tr v-if="fDB.length <= 0">
                    <td colspan="5" class="emptyState">
                        <p>No hay proveedores de transporte</p>
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

            const deleteTP = async (tpID) => {
                await useStoreLogic(router, store, 'forklift', 'delete', tpID).then((res) => {
                    if (res.type == 'failed') {
                        errorMessage.value = res.message;
                        toggleNotificationModal();
                    }

                    if (res.type == 'success') {
                        fDB.value = store.getters['getForklifts'];
                    }
                });
            };

            const filteredForklifts = computed(() => {
                if (forkliftId.value > -1) {
                    return fDB.value.filter((forklift) => forklift.id == forkliftId.value);
                }

                return fDB.value;
            });

            const clearFilters = () => {
                forkliftId.value = -1;
            };

            const updateVisibility = async (forklift) => {
                const payload = {
                    ...forklift,
                    visible: !forklift.visible,
                };

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
                deleteTP,
                loading,
                notificationModalvisible,
                toggleNotificationModal,
                errorMessage,
                forkliftId,
                filteredForklifts,
                clearFilters,
                updateVisibility,
            };
        },
    };
</script>

<style lang="scss" scoped>
    @import '@/assets/table.scss';
    .closeButton {
        @apply inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-200 sm:bg-transparent text-base font-medium text-second-400 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:text-sm mt-3;
    }
</style>
