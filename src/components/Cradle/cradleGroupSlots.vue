<template>
    <section v-if="cradleId" class="cradle-slots">
        <CradleSlot
            v-for="(slot, index) in cradleSlots"
            :key="index"
            class="slot"
            :index="index"
            :cradle-slots="cradleSlots"
            :box="slot"
            @change-cradle-slot-status="$emit('changeCradleSlotStatus', $event)"
        />
    </section>
</template>

<script lang="ts">
    import { ref, computed, onMounted, defineComponent } from 'vue';
    import CradleSlot from '@/components/Cradle/cradleSlot.vue';

    export default defineComponent({
        components: {
            CradleSlot,
        },
        props: {
            cradles: {
                type: Array,
                default: () => [],
            },
            cradleId: {
                type: Number,
                default: -1,
            },
            cradleSlots: {
                type: Array,
                default: () => [],
            },
        },
        emits: ['changeCradleSlotStatus'],
        setup() {},
    });
</script>
