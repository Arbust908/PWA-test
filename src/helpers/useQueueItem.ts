import { QueueItem } from '@/interfaces/sandflow';
import { getLast } from './iteretionHelpers';

enum QueueTransactions {
    CradleATransporte = 'aTransporte',
    DepositoATransporte = 'aTranporte',
    CradleADeposito = 'Retiro',
    TransporteACradle = 'deTransporte',
    TransporteADeposito = 'deTransporte',
    DepositoACradle = 'aCradle',
}

interface SteppedQueue {
    aTransporte: Array<QueueItem>;
    Retiro: Array<QueueItem>;
    deTransporte: Array<QueueItem>;
    aCradle: Array<QueueItem>;
}

const defaultSteppedQueue: SteppedQueue = {
    aTransporte: [],
    Retiro: [],
    deTransporte: [],
    aCradle: [],
};
const steppedQueueLimits: { [key: string]: { min: number; max: number } } = {
    aTransporte: { min: 900000, max: 999999 },
    Retiro: { min: 90000, max: 99999 },
    deTransporte: { min: 9000, max: 9999 },
    aCradle: { min: 500, max: 999 },
};

export const getOrder = (
    queue: Array<QueueItem>,
    transition: QueueTransactions | string = QueueTransactions.DepositoACradle
): number => {
    let newOrder = 0;
    const queues = separateQueues(queue);
    const transitionQueueOrders = queues[transition].map(({ order }: QueueItem) => order);
    const limits = steppedQueueLimits[transition];

    newOrder = getOrderNumber(transitionQueueOrders, limits);

    return newOrder;
};

const getOrderNumber = (queueNumbers: Array<number>, { min, max }: any) => {
    console.log(queueNumbers);
    let number = getLast(queueNumbers);
    number = number - 1;
    number = number < min ? max : number;

    return number;
};

export const separateQueues = (queue: Array<QueueItem>): SteppedQueue => {
    const steppedQueue = queue
        .filter(({ status }) => status !== 99)
        .sort((a, b) => b.order - a.order)
        .reduce(
            (acc, queueItem) => {
                const { order } = queueItem;

                if (order <= 999999 && order >= 900000) {
                    acc.aTransporte.push(queueItem);
                } else if (order <= 99999 && order >= 90000) {
                    acc.Retiro.push(queueItem);
                } else if (order <= 9999 && order >= 9000) {
                    acc.deTransporte.push(queueItem);
                } else if (order <= 999 && order >= 500) {
                    acc.aCradle.push(queueItem);
                }

                return acc;
            },
            { ...defaultSteppedQueue } as SteppedQueue
        );

    return steppedQueue;
};
