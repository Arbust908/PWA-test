import { QueueItem, SandOrder } from '@/interfaces/sandflow';

export const detailTitle = (index: number) => {
    const titleChar = String.fromCharCode(index + 65);

    return `Total Arena ${titleChar}`;
};

export const queueDetailFormated = (info: any) => {
    if (info) {
        return info + ' toneladas';
    }

    return '-';
};

export const isStageSelected = (stage: number, selected: number): boolean => {
    return selected === stage;
};

export const getPorcentage = (total: number, value = 0) => {
    const result = (value * 100) / total;

    return result === Infinity ? 0 : (value * 100) / total;
};

export const filterEmptyQueueBox = (queueBox: any) => {
    return typeof queueBox !== 'number';
};

export const filterJustToAddBox = (queueBox: any) => {
    console.log('queueBox', queueBox);
    console.log('queueBox', queueBox.toAdd);

    return queueBox.toAdd;
};

export const extractOrderInfo = (item: QueueItem) => {
    const { sandOrder } = item;
    const { boxId, amount, sandTypeId } = sandOrder as SandOrder;

    return { ...item, boxId, amount, sandTypeId };
};
