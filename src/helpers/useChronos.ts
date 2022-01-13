import { ref, Ref } from 'vue';

export function createFromDate(datetime: number) {
    const dateFormat = new Date(datetime);
    const minute: Ref<number> = ref(dateFormat.getMinutes());
    const hour: Ref<number> = ref(dateFormat.getHours());
    const time: Ref<boolean> = ref(true); //isAm

    if (hour.value === 0) {
        time.value = true;
        hour.value = 12;
    } else if (hour.value < 12) {
        time.value = true;
    } else if (hour.value === 12) {
        time.value = false;
    } else {
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

export const formatHour = ({ hour, minute, time }: { hour: Ref<number>; minute: Ref<number>; time: Ref<boolean> }) => {
    const isAM = time.value;
    hour.value = isAM ? hour.value : hour.value + 12;
    const hourString = hour.value < 10 ? `0${hour.value}` : `${hour.value}`;
    const minuteString = minute.value < 10 ? `0${minute.value}` : `${minute.value}`;
    const formated = `${hourString}:${minuteString}hs`;

    return formated;
};

export function createToDate(hour: number, minute: number, isAM: boolean) {
    const hours: Ref<number> = ref(hour);

    if (!isAM) {
        hours.value = hour === 12 ? hour : hour + 12;
    } else {
        hours.value = hour === 12 ? 0 : hour;
    }

    const date = Date.parse(new Date(2020, 11, 31, hours.value, minute).toString());

    return {
        date,
    };
}
