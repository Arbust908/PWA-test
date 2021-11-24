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
