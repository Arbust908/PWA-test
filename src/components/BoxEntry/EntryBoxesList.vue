<template>
    <fieldset class="w-full pt-1 pb-5 px-2">
        <section v-if="boxes.length > 0" class="space-y-4">
            <transition-group
                v-if="boxes.length > 0"
                tag="section"
                class="space-y-4"
                @before-enter="beforeEnter"
                @enter="enter"
                @leave="leave"
            >
                <BoxIdCard
                    v-for="(box, index) in definedBoxes"
                    :key="box.id"
                    :box="box"
                    :data-stagger-index="index"
                    :is-active-box="isActiveBox(box?.boxId || null)"
                    @select-box="$emit('select-box', $event)"
                />
            </transition-group>
            <transition
                v-if="undefinedBoxes.length > 0"
                tag="div"
                @before-enter="beforeEnter"
                @enter="enter"
                @before-leave="beforeLeave"
                @leave="leave"
            >
                <span class="text-xs text-green-600"> *Complete los ids de caja faltantes </span>
            </transition>
            <transition-group
                v-if="boxes.length > 0"
                tag="section"
                class="space-y-4"
                @before-enter="beforeEnter"
                @enter="enter"
                @before-leave="beforeLeave"
                @leave="leave"
            >
                <BoxIdCard
                    v-for="(box, index) in undefinedBoxes"
                    :key="box.id"
                    :box="box"
                    :data-stagger-index="index"
                    @update:box="box = $event"
                    @select-box="$emit('select-box', $event)"
                />
            </transition-group>
        </section>
        <section v-else class="px-2 py-6">No hay cajas asociadas.</section>
    </fieldset>
    <ErrorModal
        :open="noIdModal"
        title="La caja no tiene ID"
        text="Para poder ingresar la caja necesitas completar el ID de la misma."
        @close="toggleNIM"
        @main="toggleNIM"
    />
</template>

<script setup lang="ts">
    import BoxIdCard from './BoxIdCard.vue';
    import ErrorModal from '@/components/modal/ErrorModal.vue';
    import gsap from 'gsap';

    const props = defineProps({
        boxes: {
            type: Array,
            required: true,
        },
        selectedBox: {
            type: Object,
            required: true,
        },
    });
    defineEmits(['select-box']);

    const definedBoxes = computed(() => {
        return props.boxes.filter((box) => {
            return box.boxId && box.boxId.length > 0;
        });
    });
    const undefinedBoxes = computed(() => {
        return props.boxes.filter((box) => {
            return !box.boxId || box.boxId.length === 0;
        });
    });

    const noIdModal = ref(false);
    const toggleNIM = useToggle(noIdModal);

    const isActiveBox = (boxId: string) => {
        return props.selectedBox.boxId === boxId;
    };

    const beforeEnter = (el) => {
        el.style.opacity = 0;
        el.style.transform = 'scaleY(50%)';
    };
    const enter = (el, done) => {
        const staggerIndex = el.dataset.staggerIndex;
        gsap.to(el, {
            opacity: 1,
            scaleY: 1,
            duration: 0.5,
            delay: 0.1 * staggerIndex,
            onComplete: done,
        });
    };
    const beforeLeave = (el) => {
        el.style.opacity = 1;
        el.style.transform = 'scaleY(100%)';
    };
    const leave = (el, done) => {
        const staggerIndex = el.dataset.staggerIndex;
        gsap.to(el, {
            opacity: 0,
            scaleY: 0.5,
            duration: 0.5,
            delay: 0.1 * staggerIndex,
            onComplete: done,
        });
    };
</script>
