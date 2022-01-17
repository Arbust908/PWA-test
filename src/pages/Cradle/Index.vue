<template>
    <Layout>
        <ABMHeader title="Cradle" link="/cradle/nuevo" />
        <div class="relative grid grid-cols-12 col-span-full gap-4 mt-2">
            <FieldSelect
                title="Filtro"
                placeholder="Seleccionar cradle"
                class="col-span-full sm:col-span-5 md:col-span-3 lg:col-span-4 xl:col-span-3"
                field-name="name"
                endpoint="/cradle"
                :data="cradleId"
                @update:data="cradleId = $event"
            />
        </div>

        <VTable
            class="mt-5 min-w-full lg:min-w-min"
            :columns="columns"
            :pagination="pagination"
            :items="filteredCradles"
            :actions="actions"
            empty-text="No hay cradles cargados"
        >
            <template #item="{ item: cr }">
                <!-- Desktop -->
                <td :class="cr.name ? null : 'empty'">
                    {{ cr.name || 'Sin nombre' }}
                </td>
                <td class="sm:w-52">
                    <p class="w-52 truncate text-center">
                        {{ cr.observations || '-' }}
                    </p>
                </td>
            </template>

            <!-- Mobile -->
            <template #mobileTitle="{ item }">
                {{ item.name || 'Sin nombre' }}
            </template>

            <template #mobileSubtitle="{ item }">
                <span class="font-bold">Observaciones: </span>{{ item.observations || ' - ' }}
            </template>
        </VTable>

        <DisableModal
            :open="showModal"
            title="¿Desea inhabilitar este cradle?"
            text="Una vez inhabilitado, no podrá utilizarlo en ninguna otra sección de la aplicación."
            @close="showModal = false"
            @main="confirmModal"
        />

        <Backdrop :open="showBackdrop" title="Ver más" @close="showBackdrop = false">
            <template #body>
                <span class="!text-lg !text-black">{{ selectedCradle.name }}</span> <br />
                <span v-if="selectedCradle.observations">
                    Observaciones: {{ selectedCradle.observations || ' - ' }}
                </span>
            </template>
        </Backdrop>
    </Layout>
</template>

<script>
    import { onMounted, ref, computed } from 'vue';
    import { useStore } from 'vuex';
    import { useTitle } from '@vueuse/core';
    import Layout from '@/layouts/Main.vue';
    import PrimaryBtn from '@/components/ui/buttons/PrimaryBtn.vue';
    import VTable from '@/components/ui/table/VTable.vue';
    import Icon from '@/components/icon/TheAllIcon.vue';
    import FieldSelect from '@/components/ui/form/FieldSelect.vue';
    import GhostBtn from '@/components/ui/buttons/GhostBtn.vue';
    import Modal from '@/components/modal/General.vue';
    import { useRouter } from 'vue-router';
    import Backdrop from '@/components/modal/Backdrop.vue';
    import DisableModal from '@/components/modal/DisableModal.vue';
    import axios from 'axios';
    import ABMHeader from '@/components/ui/ABMHeader.vue';
    const apiUrl = import.meta.env.VITE_API_URL || '/api';

    export default {
        components: {
            Layout,
            PrimaryBtn,
            Icon,
            VTable,
            FieldSelect,
            GhostBtn,
            Modal,
            Backdrop,
            DisableModal,
            ABMHeader,
        },
        setup() {
            useTitle('Cradles <> Sandflow');
            const store = useStore();
            const router = useRouter();
            const crDB = ref([]);
            const loading = ref(false);
            let cradleId = ref(-1);
            const selectedCradle = ref(null);
            const showModal = ref(false);
            const showBackdrop = ref(false);

            const pagination = ref({
                sortKey: 'id',
                sortDir: 'asc',
                // currentPage: 1,
                // perPage: 10,
            });

            const columns = [
                { title: 'Nombre', key: 'name', sortable: true },
                { title: 'Observaciones', key: 'observations', sortable: true },
                { title: '', key: 'actions' },
            ];

            const actions = [
                {
                    label: 'Ver más',
                    onlyMobile: true,
                    callback: (item) => {
                        selectedCradle.value = item;
                        showBackdrop.value = true;
                    },
                },
                {
                    label: 'Editar',
                    callback: (item) => {
                        router.push(`/cradle/${item.id}`);
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

            const filteredCradles = computed(() => {
                if (cradleId.value > -1) {
                    return crDB.value.filter((cradle) => cradle.id == cradleId.value);
                }

                return crDB.value;
            });

            const getCradles = async () => {
                loading.value = true;

                const res = await axios.get(`${apiUrl}/cradle`).catch((err) => {
                    console.log(err);
                });

                if (res.status === 200) {
                    crDB.value = res.data.data;
                }

                store.dispatch('setCradles', crDB.value);
                loading.value = false;
            };

            const openModalVisibility = async (cradle) => {
                selectedCradle.value = cradle;

                if (cradle.visible) {
                    showModal.value = true;

                    return;
                }
                await updateVisibility(selectedCradle.value);
            };

            const confirmModal = async () => {
                await updateVisibility(selectedCradle.value);
                showModal.value = false;
            };

            const updateVisibility = async (cradle) => {
                const payload = {
                    ...cradle,
                    visible: !cradle.visible,
                };
                await store.dispatch('updateVisibilityCradle', payload);
                await getCradles();
            };

            const clearFilters = () => {
                cradleId.value = -1;
            };

            onMounted(async () => {
                await getCradles();
            });

            return {
                crDB,
                cradleId,
                clearFilters,
                filteredCradles,
                showModal,
                openModalVisibility,
                confirmModal,
                pagination,
                columns,
                actions,
                selectedCradle,
                showBackdrop,
            };
        },
    };
</script>

<style lang="scss" scoped>
    @import '@/assets/table.scss';
</style>
