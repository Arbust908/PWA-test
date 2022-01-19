<template>
    <Layout>
        <ABMFormTitle title="Operación en forklift" />
        <FieldGroup class="max-w-2xl">
            <ClientPitCombo v-model:client-id="clientId" v-model:pit-id="pitId" validation-type="empty" />
        </FieldGroup>
        <h2>Tareas pendientes</h2>
        <VTable :columns="columns" :pagination="pagination" :items="toDoQueue" empty-text="No tareas pendientes">
            <template #item="{ item }">
                <!-- Desktop -->
                <td :class="item?.sandOrder?.boxId ? null : 'empty'" :order="item?.order">
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
                        :data="item.status === 99"
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
        <VTable :columns="columns" :pagination="pagination" :items="finishedQueue" empty-text="No tareas finalizadas">
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
    import { QueueItem, SandOrder } from '@/interfaces/sandflow';
    import Layout from '@/layouts/Main.vue';
    import ABMFormTitle from '@/components/ui/ABMFormTitle.vue';
    import ClientPitCombo from '@/components/util/ClientPitCombo.vue';
    import FieldGroup from '@/components/ui/form/FieldGroup.vue';
    import VTable from '@/components/ui/table/VTable.vue';
    import FieldToggle from '@/components/ui/form/FieldToggle.vue';
    import {
        getQueueItems,
        updateQueueItems,
        itemIsFinished,
        itemIsNotDone,
        itemIsNotToEmpty,
    } from '@/helpers/useQueueItem';
    import { getCradle, getWorkOrders } from '@/helpers/useGetEntities';
    import { Cradle } from '@/interfaces/sandflow';

    const clientId = ref(-1);
    const pitId = ref(-1);
    const currentCradle = ref({} as Cradle);
    const columns = [
        { title: 'Caja Id', key: 'sandOrder.boxId' },
        { title: 'Origen', key: 'origin' },
        { title: 'Destino', key: 'destination' },
        { title: 'Finalizada', key: 'status' },
    ];

    const pagination = ref({
        sortKey: 'order',
        sortDir: 'desc',
    });

    const onPitUpdate = async () => {
        if (clientId.value === -1 || pitId.value === -1) {
            return;
        }

        queue.value = queueBackup.value.filter((item: QueueItem) => item.pitId === pitId.value);
        const workOrders = await getWorkOrders(`?client=${clientId.value}`);
        const cradleId = workOrders[0]?.operativeCradle;
        currentCradle.value = await getCradle(Number(cradleId));
        updateLists();
    };

    watch(clientId, await onPitUpdate);
    watch(pitId, await onPitUpdate);

    const queueBackup = ref([] as QueueItem[]);
    const queue = ref([] as QueueItem[]);

    onMounted(async () => {
        const fullQueue = await getQueueItems();
        queueBackup.value = fullQueue.filter((item: QueueItem) => itemIsNotToEmpty(item));
    });

    const toggleQueueItemStatus = (item: QueueItem) => {
        item.status = item.status === 0 ? 99 : 0;
        setTimeout(() => {
            updateLists();
            commitTransition(item);
            updateQueueItems(item);
        }, 1000);
    };

    const toDoQueue = ref([] as QueueItem[]);
    const finishedQueue = ref([] as QueueItem[]);

    const filterNotDone = () => {
        toDoQueue.value = queue.value.filter((item: QueueItem) => itemIsNotDone(item));
        const hasNoDestinations = toDoQueue.value.filter(({ destination }: QueueItem) => !destination);

        if (hasNoDestinations) {
            console.log('Hay Lugar en Cradle?');
            const availables = checkCradleSlots();
            availables && fillItemDestination(hasNoDestinations, availables);
        }
    };
    const filterFinished = () => {
        finishedQueue.value = queue.value.filter((item: QueueItem) => itemIsFinished(item));
    };
    const updateLists = () => {
        filterNotDone();
        filterFinished();
    };

    const checkCradleSlots = () => {
        const { slots } = currentCradle.value;

        return slots
            ?.map((slot: SandOrder, index: number) => {
                slot.station = index;

                return slot;
            })
            .filter(({ boxId }: SandOrder) => boxId === null);
    };

    const fillItemDestination = (items: QueueItem[], availableSlots: any[]) => {
        console.log(items);
        console.log(availableSlots);
        const amountOfSlots = availableSlots.length;

        for (let i = 0; i < amountOfSlots; i++) {
            const item = items[i];
            const slot = availableSlots[i];
            const station = `Estacion ${slot.station + 1}`;

            if (slot) {
                item.destination = station;
            }
        }
        // Cambiar el destino al Slot libre
    };

    // Cuando se completa la tarea deberia impactar en el where del SandOrder
    const commitTransition = async (item: QueueItem) => {
        const { sandOrder, origin, destination } = item;
        const { location } = sandOrder;

        console.log(JSON.parse(location));

        if (JSON.parse(location)) {
            sandOrder.location = JSON.parse(location);
        }
    };

    updateLists();
</script>

<style lang="scss" scoped>
    @import '@/assets/table.scss';

    h2 {
        @apply mb-8 font-bold text-gray-900 text-2xl mt-10;
    }
</style>
