<template>
    <template v-for="(pit, pitI) in pts" :key="pitI">
        <FieldInput
            :class="pts.length > 1 ? 'col-span-10' : 'col-span-12'"
            field-name="name"
            placeholder="Nombre del pozo"
            :data="pit.name"
            @update:data="pit.name = $event"
        />
        <AddDeleteBtn v-if="pits.length > 1" class="mt-2" purpose="remove" @click.prevent="removePit(pit.innerId)" />
    </template>
</template>

<script lang="ts">
    import FieldInput from '@/components/ui/form/FieldInput.vue';
    import AddDeleteBtn from '@/components/ui/buttons/AddDeleteBtn.vue';

    export default defineComponent({
        name: 'WoPitField',
        components: {
            FieldInput,
            AddDeleteBtn,
        },
        props: {
            pits: {
                type: Array,
                required: true,
            },
        },
        emits: ['removePit'],
        setup(props, { emit }) {
            const pts = useVModel(props, 'pits', emit);
            const lastPitIndex = computed(() => {
                return props.pits.length - 1;
            });
            const firstPitIndex = 0;
            const removePit = (pitId: number) => {
                emit('removePit', pitId);
            };

            return {
                pts,
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
