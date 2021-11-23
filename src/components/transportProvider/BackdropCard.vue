!
<template>
    <div>
        <h3 class="text-lg mb-2 font-bold">{{ info.name }}</h3>
        <dl>
            <template v-if="info.drivers.length">
                <dt>Trnasportistas:</dt>
                <dd>{{ info.drivers.length }}</dd>
                <br class="w-full" />
            </template>
            <template v-if="info.address">
                <dt>Dirección:</dt>
                <dd>{{ info.address }}</dd>
                <br class="w-full" />
            </template>
            <template v-if="info.companyRepresentative.name">
                <dt>Representante:</dt>
                <dd>{{ info.companyRepresentative.name }}</dd>
                <br class="w-full" />
            </template>
            <template v-if="info.companyRepresentative.phone">
                <dt>Teléfono:</dt>
                <dd>{{ info.companyRepresentative.phone }}</dd>
                <br class="w-full" />
            </template>
            <template v-if="info.observations">
                <dt>Observaciones:</dt>
                <dd>{{ info.observations }}</dd>
            </template>
        </dl>
    </div>
</template>

<script lang="ts">
    // address: "Calle Falsa 123"
    // companyRepresentative: {id: 1, name: 'Orlan Gash', email: 'ogash@molis.inc', phone: '11123213123', createdAt: '2021-11-23T15:19:03.000Z', …}
    // companyRepresentativeId: 1
    // createdAt: "2021-11-23T15:19:04.000Z"
    // deletedAt: null
    // drivers: []
    // id: 1
    // legalId: 23363528279
    // name: "Moils Inc"
    // observations: ""
    // providerNotification: null
    // providerNotificationId: null
    // purchaseOrders: []
    // updatedAt: "2021-11-23T15:19:04.000Z"
    // visible: true
    import { defineComponent } from 'vue';
    export default defineComponent({
        props: {
            info: {
                type: Object,
                default: () => ({}),
            },
        },
        setup() {
            return {};
        },
    });
</script>

<style lang="scss" scoped>
    dt,
    dd {
        @apply inline-block text-sm;
    }
    dt {
        @apply mr-2 font-semibold;
    }
</style>
