<template>
    <Layout>
        <header class="flex justify-between items-center mb-4 px-3">
            <h2 class="text-2xl font-semibold text-gray-900">Forklift</h2>
            <router-link to="/forklift/nuevo">
                <PrimaryBtn>Nuevo</PrimaryBtn>
            </router-link>
        </header>
        <UiTable>
            <template #header>
                <tr>
                    <th scope="col">Nombre</th>
                    <th scope="col">Observaciones</th>
                    <th scope="col">
                        <span class="sr-olny">Acciones</span>
                    </th>
                </tr>
            </template>
            <template #body>
                <tr v-for="(f, fKey) in fDB" :key="f.id" :class="fKey % 2 === 0 ? 'even' : 'odd'" class="body-row">
                    <td :class="f.name ? null : 'empty'">
                        {{ f.name || 'Sin nombre' }}
                    </td>
                    <td :class="f.observations ? null : 'empty'">
                        {{ f.observations || 'Sin observaciones' }}
                    </td>
                    <td>
                        <div class="btn-panel">
                            <router-link :to="`/forklift/${f.id}`" class="edit">
                                <Icon icon="PencilAlt" class="w-5 h-5" />
                                <span> Editar </span>
                            </router-link>
                            <button class="delete" @click="deleteTP(f.id)">
                                <Icon icon="Trash" class="w-5 h-5" />
                                <span> Eliminar </span>
                            </button>
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
    import { onMounted, ref } from 'vue';
    import { useStore } from 'vuex';
    import { useTitle } from '@vueuse/core';
    import Layout from '@/layouts/Main.vue';
    import PrimaryBtn from '@/components/ui/buttons/PrimaryBtn.vue';
    import UiTable from '@/components/ui/TableWrapper.vue';
    import Icon from '@/components/icon/TheAllIcon.vue';
    import { useStoreLogic } from '@/helpers/useStoreLogic';
    import { useRouter } from 'vue-router';
    import Modal from '@/components/modal/General.vue';

    export default {
        components: {
            Layout,
            Modal,
            PrimaryBtn,
            UiTable,
            Icon,
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

            onMounted(async () => {
                loading.value = true;
                await useStoreLogic(router, store, 'forklift', 'getAll').then((res) => {
                    if (res.type == 'failed') {
                        errorMessage.value = res.message;
                        toggleNotificationModal();
                    }

                    if (res.type == 'success') {
                        fDB.value = res.res;
                    }
                });
                loading.value = false;
            });

            return {
                fDB,
                deleteTP,
                loading,
                notificationModalvisible,
                toggleNotificationModal,
                errorMessage,
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
