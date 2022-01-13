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
                <td :class="item?.sandOrder.boxId ? null : 'empty'">
                    {{ item?.sandOrder.boxId || 'Sin definir' }}
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
                        field-name="status"
                        :data="item.status !== 0"
                        @update:data="toggleQueueItemStatus(item, $event)"
                    />
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

                <td :class="item.status ? '!text-main-600' : 'empty'">
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

    const mockQueueItem: QueueItem = {
        id: 1,
        sandOrderId: 1,
        sandOrder: {
            id: 1,
            amount: 10,
            boxId: '4602',
            purchaseOrderId: 1,
            sandProviderId: 1,
            sandTypeId: 1,
            status: 0,
            location: null,
            createdAt: '2021-12-20T19:23:47.000Z',
            updatedAt: '2021-12-20T19:24:21.000Z',
            deletedAt: null,
            providerNotifications: [],
            sandType: {
                id: 1,
                categoryId: null,
                observations: '',
                type: '40/70',
                visible: true,
                createdAt: '2021-12-20T19:08:20.000Z',
                updatedAt: '2021-12-20T19:08:20.000Z',
                deletedAt: null,
            },
            purchaseOrder: {
                id: 1,
                companyId: 1,
                pitId: 1,
                sandProviderId: 1,
                transportProviderId: 1,
                deliveryTime: '2021-12-29T13:00:00.000Z',
                packageObservations: 'Observaciones',
                driverId: 1,
                isFullyAllocated: 1,
                cancelled: false,
                createdAt: '2021-12-20T19:23:47.000Z',
                updatedAt: '2021-12-20T19:24:21.000Z',
                deletedAt: null,
            },
            sandProvider: {
                id: 1,
                name: 'Arena Santa Fe SRL',
                address: 'Calle 100',
                legalId: 30715043420,
                meshType: [
                    {
                        id: 1,
                        type: '40/70',
                    },
                ],
                observations: '',
                companyRepresentativeId: 2,
                visible: true,
                createdAt: '2021-12-20T19:09:56.000Z',
                updatedAt: '2021-12-21T19:00:59.000Z',
                deletedAt: null,
            },
        },
        pitId: 1,
        pit: {
            id: 1,
            name: 'VC2',
            companyId: 1,
            workOrderId: 1,
            createdAt: '2021-12-20T19:11:43.000Z',
            updatedAt: '2021-12-21T14:27:53.000Z',
            deletedAt: null,
            sandPlans: [
                {
                    id: 1,
                    pitId: 1,
                    companyId: 1,
                    visible: true,
                    createdAt: '2021-12-20T19:12:20.000Z',
                    updatedAt: '2022-01-03T21:37:02.000Z',
                    deletedAt: null,
                },
                {
                    id: 4,
                    pitId: 1,
                    companyId: 1,
                    visible: true,
                    createdAt: '2021-12-23T14:57:29.000Z',
                    updatedAt: '2021-12-23T14:57:29.000Z',
                    deletedAt: null,
                },
                {
                    id: 7,
                    pitId: 1,
                    companyId: 1,
                    visible: true,
                    createdAt: '2021-12-23T16:43:15.000Z',
                    updatedAt: '2021-12-23T16:43:15.000Z',
                    deletedAt: null,
                },
                {
                    id: 9,
                    pitId: 1,
                    companyId: 1,
                    visible: true,
                    createdAt: '2022-01-03T19:05:44.000Z',
                    updatedAt: '2022-01-03T19:05:44.000Z',
                    deletedAt: null,
                },
            ],
            warehouses: [
                {
                    id: 1,
                    clientCompanyId: 1,
                    pitId: 1,
                    layout: {
                        '1|1|1': {
                            category: 'fina',
                        },
                        '1|1|2': {
                            category: 'gruesa',
                        },
                        '1|1|3': {
                            category: 'cortada',
                        },
                        '1|1|4': {},
                        '1|2|1': {
                            category: 'fina',
                        },
                        '1|2|2': {
                            category: 'gruesa',
                        },
                        '1|2|3': {
                            category: 'cortada',
                        },
                        '1|2|4': {},
                        '1|3|1': {
                            category: 'fina',
                        },
                        '1|3|2': {
                            category: 'gruesa',
                        },
                        '1|3|3': {
                            category: 'cortada',
                        },
                        '1|3|4': {},
                        '1|4|1': {},
                        '1|4|2': {},
                        '1|4|3': {},
                        '1|4|4': {},
                    },
                    visible: true,
                    createdAt: '2021-12-20T19:22:37.000Z',
                    updatedAt: '2021-12-21T14:29:00.000Z',
                    deletedAt: null,
                },
            ],
            stageSheets: [],
            purchaseOrders: [
                {
                    id: 10,
                    companyId: 1,
                    pitId: 1,
                    sandProviderId: 1,
                    transportProviderId: 1,
                    deliveryTime: '2023-12-12T09:00:00.000Z',
                    packageObservations: '',
                    driverId: 1,
                    isFullyAllocated: 0,
                    cancelled: false,
                    createdAt: '2021-12-21T14:28:05.000Z',
                    updatedAt: '2021-12-21T14:28:05.000Z',
                    deletedAt: null,
                },
                {
                    id: 1,
                    companyId: 1,
                    pitId: 1,
                    sandProviderId: 1,
                    transportProviderId: 1,
                    deliveryTime: '2021-12-29T13:00:00.000Z',
                    packageObservations: 'Observaciones',
                    driverId: 1,
                    isFullyAllocated: 1,
                    cancelled: false,
                    createdAt: '2021-12-20T19:23:47.000Z',
                    updatedAt: '2021-12-20T19:24:21.000Z',
                    deletedAt: null,
                },
            ],
            company: {
                id: 1,
                name: 'Cliente test 1',
                legalId: 20349768491,
                address: 'Calle 123',
                isOperator: true,
                childId: null,
                observations: '',
                companyRepresentativeId: 1,
                visible: true,
                createdAt: '2021-12-20T19:09:31.000Z',
                updatedAt: '2021-12-20T19:09:31.000Z',
                deletedAt: null,
            },
            workOrder: {
                id: 1,
                client: '2',
                serviceCompany: '1',
                pad: '50',
                operativeCradle: '1',
                backupCradle: '1',
                operativeForklift: '2',
                backupForklift: '1',
                rigmats: 5,
                conex: 5,
                generators: 5,
                tower: 5,
                cabin: 5,
                draft: true,
                visible: true,
                createdAt: '2021-12-20T19:11:43.000Z',
                updatedAt: '2021-12-21T14:27:53.000Z',
                deletedAt: null,
            },
        },
        origin: 'Estación 1',
        destination: 'Camión AJC896',
        status: 0,
        order: 99, // Cuanto mas alto, antes aparece en la cola
        created_at: '2020-01-01',
        updated_at: '2020-01-01',
    };
    const mockQueueItem2: QueueItem = {
        id: 2,
        sandOrderId: 1,
        sandOrder: {
            id: 1,
            amount: 10,
            boxId: 'SF-203',
            purchaseOrderId: 1,
            sandProviderId: 1,
            sandTypeId: 1,
            status: 0,
            location: null,
            createdAt: '2021-12-20T19:23:47.000Z',
            updatedAt: '2021-12-20T19:24:21.000Z',
            deletedAt: null,
            providerNotifications: [],
            sandType: {
                id: 1,
                categoryId: null,
                observations: '',
                type: '40/70',
                visible: true,
                createdAt: '2021-12-20T19:08:20.000Z',
                updatedAt: '2021-12-20T19:08:20.000Z',
                deletedAt: null,
            },
            purchaseOrder: {
                id: 1,
                companyId: 1,
                pitId: 1,
                sandProviderId: 1,
                transportProviderId: 1,
                deliveryTime: '2021-12-29T13:00:00.000Z',
                packageObservations: 'Observaciones',
                driverId: 1,
                isFullyAllocated: 1,
                cancelled: false,
                createdAt: '2021-12-20T19:23:47.000Z',
                updatedAt: '2021-12-20T19:24:21.000Z',
                deletedAt: null,
            },
            sandProvider: {
                id: 1,
                name: 'Arena Santa Fe SRL',
                address: 'Calle 100',
                legalId: 30715043420,
                meshType: [
                    {
                        id: 1,
                        type: '40/70',
                    },
                ],
                observations: '',
                companyRepresentativeId: 2,
                visible: true,
                createdAt: '2021-12-20T19:09:56.000Z',
                updatedAt: '2021-12-21T19:00:59.000Z',
                deletedAt: null,
            },
        },
        pitId: 1,
        pit: {
            id: 1,
            name: 'VC2',
            companyId: 1,
            workOrderId: 1,
            createdAt: '2021-12-20T19:11:43.000Z',
            updatedAt: '2021-12-21T14:27:53.000Z',
            deletedAt: null,
            sandPlans: [
                {
                    id: 1,
                    pitId: 1,
                    companyId: 1,
                    visible: true,
                    createdAt: '2021-12-20T19:12:20.000Z',
                    updatedAt: '2022-01-03T21:37:02.000Z',
                    deletedAt: null,
                },
                {
                    id: 4,
                    pitId: 1,
                    companyId: 1,
                    visible: true,
                    createdAt: '2021-12-23T14:57:29.000Z',
                    updatedAt: '2021-12-23T14:57:29.000Z',
                    deletedAt: null,
                },
                {
                    id: 7,
                    pitId: 1,
                    companyId: 1,
                    visible: true,
                    createdAt: '2021-12-23T16:43:15.000Z',
                    updatedAt: '2021-12-23T16:43:15.000Z',
                    deletedAt: null,
                },
                {
                    id: 9,
                    pitId: 1,
                    companyId: 1,
                    visible: true,
                    createdAt: '2022-01-03T19:05:44.000Z',
                    updatedAt: '2022-01-03T19:05:44.000Z',
                    deletedAt: null,
                },
            ],
            warehouses: [
                {
                    id: 1,
                    clientCompanyId: 1,
                    pitId: 1,
                    layout: {
                        '1|1|1': {
                            category: 'fina',
                        },
                        '1|1|2': {
                            category: 'gruesa',
                        },
                        '1|1|3': {
                            category: 'cortada',
                        },
                        '1|1|4': {},
                        '1|2|1': {
                            category: 'fina',
                        },
                        '1|2|2': {
                            category: 'gruesa',
                        },
                        '1|2|3': {
                            category: 'cortada',
                        },
                        '1|2|4': {},
                        '1|3|1': {
                            category: 'fina',
                        },
                        '1|3|2': {
                            category: 'gruesa',
                        },
                        '1|3|3': {
                            category: 'cortada',
                        },
                        '1|3|4': {},
                        '1|4|1': {},
                        '1|4|2': {},
                        '1|4|3': {},
                        '1|4|4': {},
                    },
                    visible: true,
                    createdAt: '2021-12-20T19:22:37.000Z',
                    updatedAt: '2021-12-21T14:29:00.000Z',
                    deletedAt: null,
                },
            ],
            stageSheets: [],
            purchaseOrders: [
                {
                    id: 10,
                    companyId: 1,
                    pitId: 1,
                    sandProviderId: 1,
                    transportProviderId: 1,
                    deliveryTime: '2023-12-12T09:00:00.000Z',
                    packageObservations: '',
                    driverId: 1,
                    isFullyAllocated: 0,
                    cancelled: false,
                    createdAt: '2021-12-21T14:28:05.000Z',
                    updatedAt: '2021-12-21T14:28:05.000Z',
                    deletedAt: null,
                },
                {
                    id: 1,
                    companyId: 1,
                    pitId: 1,
                    sandProviderId: 1,
                    transportProviderId: 1,
                    deliveryTime: '2021-12-29T13:00:00.000Z',
                    packageObservations: 'Observaciones',
                    driverId: 1,
                    isFullyAllocated: 1,
                    cancelled: false,
                    createdAt: '2021-12-20T19:23:47.000Z',
                    updatedAt: '2021-12-20T19:24:21.000Z',
                    deletedAt: null,
                },
            ],
            company: {
                id: 1,
                name: 'Cliente test 1',
                legalId: 20349768491,
                address: 'Calle 123',
                isOperator: true,
                childId: null,
                observations: '',
                companyRepresentativeId: 1,
                visible: true,
                createdAt: '2021-12-20T19:09:31.000Z',
                updatedAt: '2021-12-20T19:09:31.000Z',
                deletedAt: null,
            },
            workOrder: {
                id: 1,
                client: '2',
                serviceCompany: '1',
                pad: '50',
                operativeCradle: '1',
                backupCradle: '1',
                operativeForklift: '2',
                backupForklift: '1',
                rigmats: 5,
                conex: 5,
                generators: 5,
                tower: 5,
                cabin: 5,
                draft: true,
                visible: true,
                createdAt: '2021-12-20T19:11:43.000Z',
                updatedAt: '2021-12-21T14:27:53.000Z',
                deletedAt: null,
            },
        },
        origin: 'Camión AJC896',
        destination: 'F4 C2 N2',
        status: 0,
        order: 10, // Cuanto mas alto, antes aparece en la cola
        created_at: '2020-01-01',
        updated_at: '2020-01-01',
    };
    const mockQueueItem3: QueueItem = {
        id: 3,
        sandOrderId: 1,
        sandOrder: {
            id: 1,
            amount: 10,
            boxId: 'SF-099',
            purchaseOrderId: 1,
            sandProviderId: 1,
            sandTypeId: 1,
            status: 0,
            location: null,
            createdAt: '2021-12-20T19:23:47.000Z',
            updatedAt: '2021-12-20T19:24:21.000Z',
            deletedAt: null,
            providerNotifications: [],
            sandType: {
                id: 1,
                categoryId: null,
                observations: '',
                type: '40/70',
                visible: true,
                createdAt: '2021-12-20T19:08:20.000Z',
                updatedAt: '2021-12-20T19:08:20.000Z',
                deletedAt: null,
            },
            purchaseOrder: {
                id: 1,
                companyId: 1,
                pitId: 1,
                sandProviderId: 1,
                transportProviderId: 1,
                deliveryTime: '2021-12-29T13:00:00.000Z',
                packageObservations: 'Observaciones',
                driverId: 1,
                isFullyAllocated: 1,
                cancelled: false,
                createdAt: '2021-12-20T19:23:47.000Z',
                updatedAt: '2021-12-20T19:24:21.000Z',
                deletedAt: null,
            },
            sandProvider: {
                id: 1,
                name: 'Arena Santa Fe SRL',
                address: 'Calle 100',
                legalId: 30715043420,
                meshType: [
                    {
                        id: 1,
                        type: '40/70',
                    },
                ],
                observations: '',
                companyRepresentativeId: 2,
                visible: true,
                createdAt: '2021-12-20T19:09:56.000Z',
                updatedAt: '2021-12-21T19:00:59.000Z',
                deletedAt: null,
            },
        },
        pitId: 1,
        pit: {
            id: 1,
            name: 'VC2',
            companyId: 1,
            workOrderId: 1,
            createdAt: '2021-12-20T19:11:43.000Z',
            updatedAt: '2021-12-21T14:27:53.000Z',
            deletedAt: null,
            sandPlans: [
                {
                    id: 1,
                    pitId: 1,
                    companyId: 1,
                    visible: true,
                    createdAt: '2021-12-20T19:12:20.000Z',
                    updatedAt: '2022-01-03T21:37:02.000Z',
                    deletedAt: null,
                },
                {
                    id: 4,
                    pitId: 1,
                    companyId: 1,
                    visible: true,
                    createdAt: '2021-12-23T14:57:29.000Z',
                    updatedAt: '2021-12-23T14:57:29.000Z',
                    deletedAt: null,
                },
                {
                    id: 7,
                    pitId: 1,
                    companyId: 1,
                    visible: true,
                    createdAt: '2021-12-23T16:43:15.000Z',
                    updatedAt: '2021-12-23T16:43:15.000Z',
                    deletedAt: null,
                },
                {
                    id: 9,
                    pitId: 1,
                    companyId: 1,
                    visible: true,
                    createdAt: '2022-01-03T19:05:44.000Z',
                    updatedAt: '2022-01-03T19:05:44.000Z',
                    deletedAt: null,
                },
            ],
            warehouses: [
                {
                    id: 1,
                    clientCompanyId: 1,
                    pitId: 1,
                    layout: {
                        '1|1|1': {
                            category: 'fina',
                        },
                        '1|1|2': {
                            category: 'gruesa',
                        },
                        '1|1|3': {
                            category: 'cortada',
                        },
                        '1|1|4': {},
                        '1|2|1': {
                            category: 'fina',
                        },
                        '1|2|2': {
                            category: 'gruesa',
                        },
                        '1|2|3': {
                            category: 'cortada',
                        },
                        '1|2|4': {},
                        '1|3|1': {
                            category: 'fina',
                        },
                        '1|3|2': {
                            category: 'gruesa',
                        },
                        '1|3|3': {
                            category: 'cortada',
                        },
                        '1|3|4': {},
                        '1|4|1': {},
                        '1|4|2': {},
                        '1|4|3': {},
                        '1|4|4': {},
                    },
                    visible: true,
                    createdAt: '2021-12-20T19:22:37.000Z',
                    updatedAt: '2021-12-21T14:29:00.000Z',
                    deletedAt: null,
                },
            ],
            stageSheets: [],
            purchaseOrders: [
                {
                    id: 10,
                    companyId: 1,
                    pitId: 1,
                    sandProviderId: 1,
                    transportProviderId: 1,
                    deliveryTime: '2023-12-12T09:00:00.000Z',
                    packageObservations: '',
                    driverId: 1,
                    isFullyAllocated: 0,
                    cancelled: false,
                    createdAt: '2021-12-21T14:28:05.000Z',
                    updatedAt: '2021-12-21T14:28:05.000Z',
                    deletedAt: null,
                },
                {
                    id: 1,
                    companyId: 1,
                    pitId: 1,
                    sandProviderId: 1,
                    transportProviderId: 1,
                    deliveryTime: '2021-12-29T13:00:00.000Z',
                    packageObservations: 'Observaciones',
                    driverId: 1,
                    isFullyAllocated: 1,
                    cancelled: false,
                    createdAt: '2021-12-20T19:23:47.000Z',
                    updatedAt: '2021-12-20T19:24:21.000Z',
                    deletedAt: null,
                },
            ],
            company: {
                id: 1,
                name: 'Cliente test 1',
                legalId: 20349768491,
                address: 'Calle 123',
                isOperator: true,
                childId: null,
                observations: '',
                companyRepresentativeId: 1,
                visible: true,
                createdAt: '2021-12-20T19:09:31.000Z',
                updatedAt: '2021-12-20T19:09:31.000Z',
                deletedAt: null,
            },
            workOrder: {
                id: 1,
                client: '2',
                serviceCompany: '1',
                pad: '50',
                operativeCradle: '1',
                backupCradle: '1',
                operativeForklift: '2',
                backupForklift: '1',
                rigmats: 5,
                conex: 5,
                generators: 5,
                tower: 5,
                cabin: 5,
                draft: true,
                visible: true,
                createdAt: '2021-12-20T19:11:43.000Z',
                updatedAt: '2021-12-21T14:27:53.000Z',
                deletedAt: null,
            },
        },
        origin: 'F1 C2 N1',
        destination: 'Estación 4',
        status: 0,
        order: 0, // Cuanto mas alto, antes aparece en la cola
        created_at: '2020-01-01',
        updated_at: '2020-01-01',
    };

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

    const queue: Ref<Array<QueueItem>> = ref([]);
    queue.value.push(mockQueueItem);
    queue.value.push(mockQueueItem2);
    queue.value.push(mockQueueItem3);
    queue.value.push(mockQueueItem);
    queue.value.push(mockQueueItem2);
    queue.value.push(mockQueueItem3);
    queue.value.push(mockQueueItem);
    queue.value.push(mockQueueItem2);
    queue.value.push(mockQueueItem3);

    const toggleQueueItemStatus = (item: QueueItem, newVal: boolean) => {
        item.status = newVal ? 1 : 0;
        setTimeout(() => {
            updateLists();
        }, 1000);
    };

    const toDoQueue = ref([]);
    const finishedQueue = ref([]);

    const filterNotDone = () => {
        toDoQueue.value = queue.value.filter((item) => item.status === 0).sort((a, b) => a.order - b.order);
    };
    const filterFinished = () => {
        finishedQueue.value = queue.value.filter((item) => item.status > 0);
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
