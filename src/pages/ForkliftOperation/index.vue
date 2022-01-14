<template>
    <Layout>
        <ABMFormTitle title="Operacíon en forklift" />
        <FieldGroup class="max-w-2xl">
            <ClientPitCombo v-model:client-id="clientId" v-model:pit-id="pitId" />
        </FieldGroup>
        <h2>Tareas pendientes</h2>
        <VTable :columns="columns" :items="toDoQueue" empty-text="No tareas pendientes">
            <template #item="{ item }">
                <!-- Desktop -->
                <td :class="item?.sandOrder?.boxId ? null : 'empty'">
                    {{ item?.sandOrder?.boxId || 'Sin definir' }}
                </td>

                <td :class="item.origin ? null : 'empty'">
                    {{ item.origin || 'Sin origen' }}
                </td>

                <td :class="item.destination ? null : 'empty'">
                    {{ item.destination || 'Sin destino' }}
                </td>

                <td :class="item.status ? null : 'empty'">
                    <FieldToggle
                        class="mx-auto"
                        :field-name="`status-${item.id}`"
                        :data="item.status !== 0"
                        @toggle="toggleQueueItemStatus(item)"
                    />
                </td>
            </template>

            <!-- Mobile -->
            <template #mobileTitle="{ item }">
                {{ item?.sandOrder?.boxId }}
            </template>

            <template #mobileSubtitle="{ item }">
                <dl>
                    <dt>Origen</dt>
                    <dd>{{ item.origin }}</dd>
                    <dt>Destino</dt>
                    <dd>{{ item.destination }}</dd>
                    <dt></dt>
                    <dd>{{ item.status }}</dd>
                </dl>
            </template>
        </VTable>
        <h2>Tareas finalizadas</h2>
        <VTable :columns="columns" :items="finishedQueue" empty-text="No tareas finalizadas">
            <template #item="{ item }">
                <!-- Desktop -->
                <td :class="item?.sandOrder.boxId ? null : 'empty'">
                    {{ item?.sandOrder.boxId || 'Sin definir' }}
                </td>

                <td :class="item.origin ? null : 'empty'">
                    {{ item.origin || 'Sin origen' }}
                </td>

                <td :class="item.destination ? null : 'empty'">
                    {{ item.destination || 'Sin destino' }}
                </td>

                <td :class="item.status ? '!text-main-500 !font-semibold' : 'empty'">
                    {{ item.status > 0 ? 'Finalizado' : 'Sin finalizar' }}
                </td>
            </template>

            <!-- Mobile -->
            <template #mobileTitle="{ item }">
                {{ item?.sandOrder.boxId }}
            </template>

            <template #mobileSubtitle="{ item }">
                <dl>
                    <dt>Origen</dt>
                    <dd>{{ item.origin }}</dd>
                    <dt>Destino</dt>
                    <dd>{{ item.destination }}</dd>
                    <dt></dt>
                    <dd>{{ item.status }}</dd>
                </dl>
            </template>
        </VTable>
    </Layout>
</template>

<script setup lang="ts">
    import { QueueItem } from '@/interfaces/sandflow';
    import Layout from '@/layouts/Main.vue';
    import ABMFormTitle from '@/components/ui/ABMFormTitle.vue';
    import ClientPitCombo from '@/components/util/ClientPitCombo.vue';
    import FieldGroup from '@/components/ui/form/FieldGroup.vue';
    import VTable from '@/components/ui/table/VTable.vue';
    import FieldToggle from '@/components/ui/form/FieldToggle.vue';
    import { getQueueItems, updateQueueItems } from '@/helpers/useQueueItem';
    import { wait } from '@/helpers/useWait';

    const clientId = ref(-1);
    const pitId = ref(-1);
    const columns = [
        { title: 'Caja Id', key: 'sandOrder.boxId', sortable: true },
        { title: 'Origen', key: 'origin', sortable: true },
        { title: 'Destino', key: 'destination', sortable: true },
        { title: 'Finalizada', key: 'status' },
    ];
    const status = {
        0: 'Pendiente',
        1: 'En proceso',
        2: 'Finalizada',
    };

    watch(clientId, () => {
        if (clientId.value === -1 || pitId.value === -1) {
            return;
        }
        console.log(queueBackup.value);

        queue.value = queueBackup.value.filter((item: QueueItem) => item.pitId === pitId.value);
        updateLists();
    });
    watch(pitId, () => {
        if (clientId.value === -1 || pitId.value === -1) {
            return;
        }
        console.log(queueBackup.value);

        queue.value = queueBackup.value.filter((item: QueueItem) => item.pitId === pitId.value);
        updateLists();
    });

    const queueBackup: Ref<Array<QueueItem>> = ref([]);
    const queue: Ref<Array<QueueItem>> = ref([]);

    onMounted(async () => {
        const fullQueue = await getQueueItems();
        console.log(fullQueue);
        queueBackup.value = fullQueue
            .sort((a: QueueItem, b: QueueItem) => a.order - b.order)
            .filter((item: QueueItem) => item.status !== 10);
        // SUPER SKRIPT PARA BORRAR UNAS QUE CREE ALOPA
        // console.log(queueBackup.value);
        // const toDelete = queueBackup.value.filter((item: QueueItem) => {
        //     const { origin, destination } = item;
        //     const array = ['Camion', 'Deposito'];
        //     console.log(array.includes(origin) && array.includes(destination));

        //     return array.includes(origin) && array.includes(destination);
        // });
        // console.log(toDelete);
        // await Promise.all(
        //     toDelete.map((item: QueueItem) => {
        //         item?.id && deleteQueueItems(item.id);
        //     })
        // );
    });

    const toggleQueueItemStatus = (item: QueueItem) => {
        console.log(item.status);
        item.status = item.status === 0 ? 99 : 0;
        console.log(item.status);
        setTimeout(() => {
            updateLists();
            console.log('cambiar estado');
            console.log(item);
            updateQueueItems(item);
        }, 1000);
    };

    const toDoQueue = ref([]);
    const finishedQueue = ref([]);

    const filterNotDone = () => {
        toDoQueue.value = queue.value.filter((item) => item.status === 0);
        // console.log('toDoQueue', toDoQueue.value);
    };
    const filterFinished = () => {
        finishedQueue.value = queue.value.filter((item) => item.status === 99);
        // console.log('finishedQueue', finishedQueue.value);
    };
    const updateLists = () => {
        filterNotDone();
        filterFinished();
    };

    updateLists();
</script>

<style lang="scss" scoped>
    @import '@/assets/table.scss';

    h2 {
        @apply mb-8 font-bold text-gray-900 text-2xl mt-10;
    }
</style>
