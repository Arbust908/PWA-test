!
<template>
    <div>
        <h3 class="text-lg mb-2 font-bold">{{ info.type }}</h3>
        <dl>
            <dt>Observaciones:</dt>
            <dd>{{ info.observations }}</dd>
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
