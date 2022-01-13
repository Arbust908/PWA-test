<template>
    <div class="flex flex-wrap">
        <CradleCard
            :id="id"
            class="max-w-[260px]"
            :cradle="cradle"
            :selected="selected"
            @click="handleSelectedCradle"
        />
        <CradleSlots v-if="selected" :cradle="cradle" :box="choosedBox" @clear-box-in-deposit="clearBoxInDeposit" />
    </div>
</template>

<script lang="ts">
    import CradleCard from '@/components/depositDesign/CradleCard.vue';
    import CradleSlots from '@/components/depositDesign/CradleSlots.vue';

    export default {
        components: {
            CradleCard,
            CradleSlots,
        },
        props: {
            cradle: {
                type: Object,
                required: true,
            },
            choosedBox: {
                type: Object,
                required: true,
            },
            selected: {
                type: Boolean,
                required: true,
            },
            id: {
                type: Number,
                required: true,
            },
        },
        setup(props, { emit }) {
            const cradle = ref(props.cradle);
            const choosedBox = ref(props.choosedBox);
            const selected = ref(props.selected);
            const id = ref(props.id);

            const handleSelectedCradle = () => {
                emit('handle-selected-cradle');
            };

            const clearBoxInDeposit = (id) => {
                emit('clear-box-in-deposit', id);
            };

            watchEffect(() => {
                choosedBox.value = props.choosedBox;
                selected.value = props.selected;
            });

            return {
                selected,
                choosedBox,
                cradle,
                id,
                handleSelectedCradle,
                clearBoxInDeposit,
            };
        },
    };
</script>

<style lang="scss" scoped></style>
