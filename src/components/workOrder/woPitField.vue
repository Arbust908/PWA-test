<template>
    <template v-for="(pit, pitI) in pits" :key="pitI">
        <FieldInput
            :class="pits.length > 1 ? 'col-span-10' : 'col-span-12'"
            field-name="name"
            placeholder="Nombre del pozo"
            :data="pit.name"
            @update:data="pit.name = $event"
        />
        <CircularBtn v-if="pits.length > 1" class="btn__delete mt-2" @click="removePit(pit.id)">
            <Icon icon="Trash" class="w-6 h-6" />
        </CircularBtn>
    </template>
</template>

<script lang="ts">
    import { defineComponent, computed } from 'vue';
    import FieldInput from '@/components/ui/form/FieldInput.vue';
    import Icon from '@/components/icon/TheAllIcon.vue';
    import CircularBtn from '@/components/ui/buttons/CircularBtn.vue';
    import { useVModel } from '@vueuse/core';

    export default defineComponent({
        name: 'WoPitField',
        components: {
            FieldInput,
            Icon,
            CircularBtn,
        },
        props: {
            pits: {
                type: Array,
                required: true,
            },
        },
        emits: ['removePit'],
        setup(props, { emit }) {
            const pits = useVModel(props, 'pits', emit);
            const lastPitIndex = computed(() => {
                return props.pits.length - 1;
            });
            const firstPitIndex = 0;
            const removePit = (pitId) => {
                emit('removePit', pitId);
            };

            return {
                pits,
                lastPitIndex,
                firstPitIndex,
                removePit,
            };
        },
    });
</script>

<style lang="scss" scoped>
    @import '@/assets/button.scss';
    .icon {
        @apply w-5 h-5;
    }
    .ghost {
        @apply border-none shadow-none;
        & > .icon {
            @apply text-transparent;
        }
    }
</style>
