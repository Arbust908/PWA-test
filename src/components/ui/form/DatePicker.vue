<template>
    <div class="flex p-1 items-center rounded border border-second-300" :class="errorBorder">
        <input
            v-model="localDate"
            v-maska="'##/##/####'"
            type="text"
            placeholder="--/--/----"
            class="sel w-40"
            @blur="
                getDate();
                checkDate();
                formatDate();
                usedInput();
            "
        />
    </div>
    <InvalidInputLabel v-if="localDate.length === 0 && used === true" validation-type="empty" class="text-xs" />
    <div v-if="error && localDate.length > 0">
        <span class="label-wrapper">
            <div class="icon-wrapper">
                <Icon icon="ExclamationCircle" type="solid" class="icon" />
            </div>
            <div class="message-wrapper text-xs">Fecha Incorrecta</div>
        </span>
    </div>
</template>

<script lang="ts">
    import { ref, computed } from 'vue';
    import { maska } from 'maska';
    import Icon from '@/components/icon/TheAllIcon.vue';
    import InvalidInputLabel from '@/components/ui/InvalidInputLabel.vue';
    export default {
        name: 'DatePicker',

        components: {
            Icon,
            InvalidInputLabel,
        },

        directives: { maska },

        props: {
            modelValue: {
                type: String,
                required: true,
            },
            error: {
                type: Boolean,
            },
            validationType: {
                type: String,
            },
        },

        emits: ['update:modelValue', 'date-object'],

        setup(props: any, { emit }: any) {
            const localDate = computed({
                get: () => props.modelValue,
                set: (value) => emit('update:modelValue', value),
            });

            let date = '';
            let leap: boolean;
            let dayLimit = 0;
            let dateSplit = [];
            let day = 0;
            let month = 0;
            let year = 0;

            const error = ref(false);
            const used = ref(false);

            const usedInput = () => {
                used.value = true;
            };

            const errorBorder = computed(() => {
                return (used.value && localDate.value.length === 0) || error.value ? 'border-red-500' : null;
            });

            function getDate() {
                date = props.modelValue;
                dateSplit = date.split('/');
                day = parseInt(dateSplit[0]);
                month = parseInt(dateSplit[1]);
                year = parseInt(dateSplit[2]);
            }

            function leapYear(year: number) {
                //Determina año bisiesto
                leap = (year % 4 == 0 && year % 100 != 0) || year % 400 == 0;
            }

            function monthLength(month: number) {
                switch (month) {
                    case 1:
                    case 3:
                    case 5:
                    case 7:
                    case 8:
                    case 10:
                    case 12:
                        dayLimit = 31;
                        break;
                    case 2:
                        dayLimit = 28;
                        break;
                    case 4:
                    case 6:
                    case 9:
                    case 11:
                        dayLimit = 30;
                        break;
                    default:
                        dayLimit = 1;
                        break;
                }
            }

            function checkDate() {
                if (localDate.value.length > 0) {
                    error.value = false;
                    let currentYear = new Date();
                    leapYear(year);
                    monthLength(month);

                    if (year > currentYear.getFullYear() + 10 || year < currentYear.getFullYear()) {
                        error.value = true;
                    }

                    if (month < 1 || month > 12) {
                        error.value = true;
                    }

                    if (
                        day < 1 ||
                        (dayLimit === 31 && day > 31) ||
                        (dayLimit === 30 && day > 30) ||
                        (dayLimit === 28 && day > 28 && leap == false) ||
                        (dayLimit === 28 && day > 29 && leap == true) ||
                        dayLimit === 1
                    ) {
                        error.value = true;
                    }
                }
            }
            let dateObject = {};

            function formatDate() {
                dateObject = { year: year, month: month - 1, day: day };
                emit('date-object', dateObject);
            }

            return {
                date,
                getDate,
                localDate,
                checkDate,
                formatDate,
                error,
                Icon,
                used,
                usedInput,
                errorBorder,
            };
        },
    };
</script>

<style lang="scss" scoped>
    .sel {
        @apply h-8 rounded bg-transparent border-none;
    }
    .selecThor {
        @apply pl-1 pr-1 py-0 text-right;
    }
    select {
        @apply bg-none;
    }
    .selecTime {
        @apply px-2 flex relative gap-2;
        .marker-wrapper {
            @apply absolute inset-0 z-0 p-1;
        }
        .marker {
            @apply bg-main-200 text-transparent rounded py-1 px-1 transition duration-700 ease-in-out transform h-6 w-8 inline-block;
            &.am {
                @apply translate-x-0;
            }
            &.pm {
                @apply translate-x-full;
            }
        }
        button {
            @apply relative z-10;
        }
    }
    @keyframes enter {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }
    .label-wrapper {
        animation: enter 500ms;
        @apply flex mt-2 items-center;
    }
    .message-wrapper {
        @apply text-red-700 ml-1;
    }
    .icon-wrapper {
        .icon {
            @apply h-5 w-5 text-red-700;
        }
    }
</style>
