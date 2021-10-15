import { ref, Ref } from 'vue';

export function createFromDate(datetime: number) {
    const dateFormat = new Date(datetime);
    const minute: Ref<number> = ref(dateFormat.getMinutes());
    const hour: Ref<number> = ref(dateFormat.getHours());
    const time: Ref<boolean> = ref(true); //isAm

    if (hour.value > 12) {
        time.value = false;
        hour.value = hour.value - 12;
    }

    if (minute.value % 5 !== 0) {
        minute.value = minute.value - (minute.value % 5);
    }

    return {
        hour,
        minute,
        time,
    };
}

export function createToDate(hour: number, minute: number, time: boolean) {
    const hours: Ref<number> = ref(hour);

    if (!time) {
        hours.value = hour + 12;
    }

    const date = Date.parse(new Date(2020, 11, 31, hours.value, minute).toString());

    return {
        date,
    };
}
