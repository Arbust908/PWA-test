<script setup lang="ts">
    import Layout from '@/layouts/Main.vue';
    import ABMFormTitle from '@/components/ui/ABMFormTitle.vue';
    import ClientPitCombo from '@/components/util/ClientPitCombo.vue';
    import FieldGroup from '@/components/ui/form/FieldGroup.vue';
    import PrimaryBtn from '@/components/ui/buttons/PrimaryBtn.vue';
    import TheAllIcon from '@/components/icon/TheAllIcon.vue';
    const clientId = ref(-1);
    const pitId = ref(-1);

    const _TABS = { PENDING: 0, COMPLETED: 1 };
    const selectedTab = ref(0);
    const setTab = (tab: number) => {
        selectedTab.value = tab;
    };
    const isTabSelected = (tab: number) => {
        return selectedTab.value === tab;
    };

    const selectedStage = ref(-1);
    const stages = ref([
        { stage: 1, weight: 100, done: 100 },
        { stage: 2, weight: 200, done: 70 },
        { stage: 3, weight: 100, done: 0 },
    ]);
    const setStage = (stage: number) => {
        selectedStage.value = selectedStage.value === stage ? -1 : stage;
    };
    const finalizedStages = computed(() => {
        return stages.value.filter((stage) => stage.done === stage.weight);
    });
    const pendingStages = computed(() => {
        return stages.value.filter((stage) => stage.done < stage.weight);
    });
    const calcPorcent = (done: number, total: number) => {
        return Math.round((done / total) * 100);
    };
</script>

<template>
    <Layout>
        <ABMFormTitle title="Stage sheet" />
        <FieldGroup class="max-w-4xl items-end">
            <ClientPitCombo :client-id="clientId" :pit-id="pitId" shared-classes="col-span-full md:col-span-4" />
            <PrimaryBtn class="col-span-6 md:col-span-3 max-h-12">Finalizar Stage</PrimaryBtn>
        </FieldGroup>
        <nav class="flex gap-8 mt-10">
            <button
                :class="isTabSelected(_TABS.PENDING) ? 'selected' : null"
                class="tab"
                @click="setTab(_TABS.PENDING)"
            >
                Etapas pendientes
            </button>
            <button
                :class="isTabSelected(_TABS.COMPLETED) ? 'selected' : null"
                class="tab"
                @click="setTab(_TABS.COMPLETED)"
            >
                Etapas finalizadas
            </button>
        </nav>
        <section class="mt-4 panel">
            <div v-if="isTabSelected(_TABS.PENDING)" class="stage--panel">
                <article v-for="{ stage, weight, done } in pendingStages" :key="`stage-${stage}`" class="stage--row">
                    <header class="flex justify-between">
                        <h2>Etapa {{ stage }}/20</h2>
                        <p>Total: {{ weight }} Toneladas</p>
                        <div class="flex gap-x-1 items-center">
                            <progress max="100" :value="calcPorcent(done, weight)">
                                {{ calcPorcent(done, weight) }}%
                            </progress>
                            <span>{{ calcPorcent(done, weight) }}%</span>
                        </div>
                        <i
                            :class="stage === selectedStage ? 'opened' : null"
                            class="expand-btn"
                            @click="setStage(stage)"
                        >
                            <svg
                                width="26"
                                height="12"
                                viewBox="0 0 26 12"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M13.13 8.22138L22.6186 0.764955C22.9257 0.521342 23.3476 0.377852 23.7938 0.36522C24.24 0.352588 24.675 0.471819 25.0057 0.697374L25.0956 0.764954C25.4213 1.03998 25.6013 1.3954 25.6013 1.76365C25.6013 2.1319 25.4213 2.48732 25.0956 2.76235L14.3984 11.2024C14.2441 11.3273 14.0585 11.4279 13.8522 11.4985C13.6459 11.5691 13.4231 11.6083 13.1965 11.6139C12.97 11.6195 12.7442 11.5913 12.5323 11.531C12.3203 11.4707 12.1262 11.3795 11.9614 11.2625L1.16436 2.76235C0.841374 2.4878 0.663086 2.13393 0.663086 1.76741C0.663086 1.40089 0.841374 1.04702 1.16436 0.772468C1.31783 0.642108 1.50477 0.536419 1.71394 0.461751C1.92312 0.387083 2.15021 0.344976 2.38158 0.337963C2.61295 0.330949 2.84382 0.359172 3.06031 0.420936C3.2768 0.4827 3.47445 0.576731 3.64138 0.697377L3.64138 0.772467L13.13 8.22138Z"
                                    fill="#808080"
                                />
                            </svg>
                        </i>
                    </header>
                    <div></div>
                </article>
            </div>
            <div v-else-if="isTabSelected(_TABS.COMPLETED)" class="stage--panel">
                <article v-for="{ stage, weight } in finalizedStages" :key="`stage-${stage}`" class="stage--row">
                    <header class="flex justify-between">
                        <h2>Etapa {{ stage }}/20</h2>
                        <p>Total: {{ weight }} Toneladas</p>
                        <div class="flex gap-x-1 items-center justify-center">
                            <span class="italic">Finalizada</span>
                        </div>
                        <i
                            :class="stage === selectedStage ? 'opened' : null"
                            class="expand-btn"
                            @click="setStage(stage)"
                        >
                            <svg
                                width="26"
                                height="12"
                                viewBox="0 0 26 12"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M13.13 8.22138L22.6186 0.764955C22.9257 0.521342 23.3476 0.377852 23.7938 0.36522C24.24 0.352588 24.675 0.471819 25.0057 0.697374L25.0956 0.764954C25.4213 1.03998 25.6013 1.3954 25.6013 1.76365C25.6013 2.1319 25.4213 2.48732 25.0956 2.76235L14.3984 11.2024C14.2441 11.3273 14.0585 11.4279 13.8522 11.4985C13.6459 11.5691 13.4231 11.6083 13.1965 11.6139C12.97 11.6195 12.7442 11.5913 12.5323 11.531C12.3203 11.4707 12.1262 11.3795 11.9614 11.2625L1.16436 2.76235C0.841374 2.4878 0.663086 2.13393 0.663086 1.76741C0.663086 1.40089 0.841374 1.04702 1.16436 0.772468C1.31783 0.642108 1.50477 0.536419 1.71394 0.461751C1.92312 0.387083 2.15021 0.344976 2.38158 0.337963C2.61295 0.330949 2.84382 0.359172 3.06031 0.420936C3.2768 0.4827 3.47445 0.576731 3.64138 0.697377L3.64138 0.772467L13.13 8.22138Z"
                                    fill="#808080"
                                />
                            </svg>
                        </i>
                    </header>
                    <div></div>
                </article>
            </div>
            <aside>
                <h3 class="text-3xl font-bold">Detalle</h3>
                <article class="px-4 py-6 border rounded-[10px]">
                    <span class="text-center">Desplegá una etapa para ver el detalle de la misma</span>
                </article>
            </aside>
        </section>
    </Layout>
</template>

<style scoped lang="scss">
    .tab {
        @apply text-lg border-b-4 border-transparent text-main-600 h-[48px];
        &.selected {
            @apply border-main-600 text-main-600 font-bold;
        }
    }
    .panel {
        @apply grid gap-x-6;
        grid-template-columns: minmax(320px, 1fr) 360px;
    }
    .stage {
        &--panel {
            @apply flex flex-col gap-y-2 pb-8;
        }
        &--row {
            @apply rounded-md border bg-white;
            & > header {
                @apply px-6 py-8;
            }
            h2,
            p,
            div {
                @apply w-40;
            }
            p {
                @apply text-center;
            }
        }
    }
    aside {
        @apply bg-white px-4 py-6 rounded-md border shadow self-start flex flex-col gap-6;
    }
    progress {
        @apply rounded-full h-2.5;
    }
    progress::-webkit-progress-bar {
        @apply bg-[#E5E7EB] rounded-full;
    }
    progress::-webkit-progress-value {
        @apply bg-main-500 rounded-full;
    }
    progress::-moz-progress-bar {
        @apply bg-gray-200 rounded-full;
    }
    .expand-btn {
        @apply flex justify-center items-center w-8 cursor-pointer transition duration-300 ease-in-out transform;
        &.opened {
            @apply rotate-180;
        }
    }
</style>
