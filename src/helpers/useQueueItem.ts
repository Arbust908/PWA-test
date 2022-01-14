import { QueueItem } from '@/interfaces/sandflow';
import { getLast } from './iteretionHelpers';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL || '/api';

export enum QueueTransactions {
    CradleATransporte = 'aTransporte',
    DepositoATransporte = 'aTranporte',
    CradleADeposito = 'Retiro',
    TransporteACradle = 'deTransporte',
    TransporteADeposito = 'deTransporte',
    DepositoACradle = 'aCradle',
}

export interface SteppedQueue {
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
    let number = getLast(queueNumbers) || max;
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
                    acc.aTransporte = [...new Set(acc.aTransporte)];
                } else if (order <= 99999 && order >= 90000) {
                    acc.Retiro.push(queueItem);
                    acc.Retiro = [...new Set(acc.Retiro)];
                } else if (order <= 9999 && order >= 9000) {
                    acc.deTransporte.push(queueItem);
                    acc.deTransporte = [...new Set(acc.deTransporte)];
                } else if (order <= 999 && order >= 500) {
                    acc.aCradle.push(queueItem);
                    acc.aCradle = [...new Set(acc.aCradle)];
                }

                return acc;
            },
            { ...defaultSteppedQueue } as SteppedQueue
        );

    return { ...steppedQueue };
};

export const defaultQueueItem: QueueItem = {
    sandOrderId: -1,
    pitId: -1,
    origin: '',
    destination: '',
    status: 0,
    order: -1,
};

export const getOrderPro = async (transition: QueueTransactions = QueueTransactions.DepositoACradle) => {
    const queue = await getQueueItems();

    return getOrder(queue, transition);
};

export const createQueueItem = async (queueItem: QueueItem) => {
    return await axios
        .post(`${apiUrl}/queueItem/`, queueItem)
        .then((response) => {
            return response;
        })
        .catch((err) => console.error(err));
};
export const getQueueItems = async () => {
    return await axios
        .get(`${apiUrl}/queueItem/`)
        .then((response) => {
            return response.data.data;
        })
        .catch((err) => console.error(err));
};
export const updateQueueItems = async (queueData) => {
    const { id } = queueData;

    return await axios
        .put(`${apiUrl}/queueItem/${id}`, queueData)
        .then((response) => {
            return response.data.data;
        })
        .catch((err) => console.error(err));
};
export const deleteQueueItems = async (queueItemId: number) => {
    return await axios
        .delete(`${apiUrl}/queueItem/${queueItemId}`)
        .then((response) => {
            return response;
        })
        .catch((err) => console.error(err));
};
