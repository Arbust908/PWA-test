<template>
    <Layout>
        <ABMFormTitle title="Operación en forklift" />
        <FieldGroup class="max-w-2xl">
            <ClientPitCombo v-model:client-id="clientId" v-model:pit-id="pitId" />
        </FieldGroup>
        <h2>Tareas pendientes</h2>
        <VTable :columns="columns" :pagination="pagination" :items="toDoQueue" empty-text="No tareas pendientes">
            <template #item="{ item }">
                <!-- Desktop -->
                <td :class="item?.sandOrder?.boxId ? null : 'empty'" :order="item?.order">
                    {{ item?.sandOrder?.boxId || 'Sin definir' }} ({{ item?.order }})
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
        updateQueueItem,
        itemIsFinished,
        itemIsNotDone,
        itemIsNotToEmpty,
        removeQueueItems,
    } from '@/helpers/useQueueItem';
    import { finishSandOrder, updateSandOrder } from '@/helpers/useSandOrder.service';
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

    // La onda con esto es que los que ya estaban terminados se van aa "Borrar" despues de una session en Finished
    const itemToDelete = ref([] as QueueItem[]);

    const onPitUpdate = async () => {
        if (clientId.value === -1 || pitId.value === -1) {
            return;
        }

        queue.value = queueBackup.value.filter((item: QueueItem) => item.pitId === pitId.value);
        const workOrders = await getWorkOrders(`?client=${clientId.value}`);
        const cradleId = workOrders[0]?.operativeCradle;
        currentCradle.value = await getCradle(Number(cradleId));
        updateLists();
        itemToDelete.value = finishedQueue.value;
    };

    watch(clientId, await onPitUpdate);
    watch(pitId, await onPitUpdate);

    const queueBackup = ref([] as QueueItem[]);
    const queue = ref([] as QueueItem[]);

    onMounted(async () => {
        const fullQueue = await getQueueItems();
        queueBackup.value = fullQueue
            .filter((item: QueueItem) => itemIsNotToEmpty(item))
            .filter((item: QueueItem) => item.order >= 0);
    });

    const toggleQueueItemStatus = (item: QueueItem) => {
        item.status = item.status === 0 ? 99 : 0;
        setTimeout(() => {
            updateLists();
            commitTransition(item);
            updateQueueItem(item);
        }, 1000);
    };

    const toDoQueue = ref([] as QueueItem[]);
    const finishedQueue = ref([] as QueueItem[]);

    const filterNotDone = () => {
        toDoQueue.value = queue.value.filter((item: QueueItem) => itemIsNotDone(item));
        const hasNoDestinations = toDoQueue.value.filter(({ destination }: QueueItem) => !destination);

        if (hasNoDestinations.length) {
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
        if (items.length <= 0) {
            console.log('No hay items');

            return;
        }

        if (availableSlots.length <= 0) {
            console.log('No hay lugares disponibles');

            return;
        }
        console.log(items);
        console.log(availableSlots);
        const amountOfSlots = availableSlots.length;

        for (let i = 0; i < amountOfSlots; i++) {
            const item = items[i];
            const slot = availableSlots[i];
            const station = `Estación ${slot.station + 1}`;

            if (slot) {
                item.destination = station;
            }
        }
    };

    // Cuando se completa la tarea deberia impactar en el where del SandOrder
    const commitTransition = async (item: QueueItem) => {
        const { sandOrder, origin, destination } = item;

        if (sandOrder !== undefined) {
            return;
        }
        const { location } = sandOrder;

        console.log(JSON.parse(location));

        if (JSON.parse(location)) {
            sandOrder.location = JSON.parse(location);
        }

        console.groupCollapsed('Commiting transition');
        console.log(sandOrder);
        console.log(origin);
        console.log(destination);
        console.log(sandOrder.location);
        console.groupEnd();
        // Preguntar de donde viene
        const originType = origin.split(' ')[0];
        const destinationType = destination.split(' ')[0];
        console.log('originType ' + originType);
        console.log('destinationType ' + destinationType);
        let msg = '';
        switch (originType) {
            case 'Camion':
                msg += 'Soy Camion => ';
                switch (destinationType) {
                    case 'Camion':
                        // No deberia ir nunca de macion a camino
                        msg += 'Camion';
                        break;
                    case 'Estación':
                        // No pareciera que hacemos nada
                        msg += 'Estación';
                        break;
                    default:
                        // No parecier que hacemos nada
                        msg += 'Deposito';
                        break;
                }
                console.log(msg);
                break;
            case 'Estación':
                msg += 'Soy Estación => ';
                switch (destinationType) {
                    case 'Camion':
                        // Matar SO con id = 99
                        await finishSandOrder(sandOrder);
                        msg += 'Camion';
                        break;
                    case 'Estación':
                        // Nunca deberia ir de estacion a estacion
                        msg += 'Estación';
                        break;
                    default:
                        // Pareciera que lo hace Destino de Cajas Vacias
                        msg += 'Deposito';
                        break;
                }
                console.log(msg);
                break;
            default:
                msg += 'Soy Deposito => ';
                switch (destinationType) {
                    case 'Camion':
                        // Matar SO con id = 99
                        await finishSandOrder(sandOrder);
                        msg += 'Camion';
                        break;
                    case 'Estación': {
                        // Mover la SO a la estacion
                        const { id } = currentCradle.value;
                        const cradleStation = Number(destination.split(' ')[1]);
                        const slot = cradleStation - 1;

                        const newLocation = {
                            where: 'cradle',
                            where_id: id,
                            where_slot: slot,
                            where_origin: destination,
                        };

                        sandOrder.location = JSON.stringify(newLocation);

                        await updateSandOrder(sandOrder);

                        msg += 'Estación';
                        break;
                    }
                    default:
                        // Nunca deberia ir de deposito a deposito
                        msg += 'Deposito';
                        break;
                }
                console.log(msg);
                break;
        }
    };

    updateLists();

    watch(finishedQueue, (newVal) => {
        console.log(newVal);

        if (newVal && newVal.length > 10) {
            console.log(itemToDelete.value);
        }
    });
    // onUnmounted(async () => {
    //     await removeQueueItems(itemToDelete.value);
    //     console.log('Unmounted');
    // });
</script>

<style lang="scss" scoped>
    @import '@/assets/table.scss';

    h2 {
        @apply mb-8 font-bold text-gray-900 text-2xl mt-10;
    }
</style>
