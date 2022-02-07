import { BoxLocation, QueueItem, SandOrder, SandOrderBox, SandStage } from '@/interfaces/sandflow';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL || '/api';

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

export const isStageSelected = (stage: number | null, selected: number): boolean => {
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
    return queueBox.toAdd;
};

export const extractOrderInfo = (item: QueueItem) => {
    const { sandOrder } = item;
    const { boxId, amount, sandTypeId } = sandOrder as SandOrder;

    return { ...item, boxId, amount, sandTypeId };
};
export const extractBoxInfo = (item: SandOrderBox) => {
    const sandOrder = item;
    const { boxId, amount, sandTypeId } = sandOrder as SandOrder;

    return { ...item, boxId, amount, sandTypeId };
};

export const moveBoxes = (boxes: SandOrderBox[], to: any = null) => {
    const movedBoxes = boxes.map((box: SandOrderBox) => {
        const { location } = box;

        if (location) {
            console.log(location);
            let { where, where_id, where_origin } = location as BoxLocation;

            if (to) {
                where = to.where;
                where_id = to.where_id;
                where_origin = to.where_origin;
            } else {
                where = '';
                where_id = -1;
            }
            location.where = where;
            location.where_id = where_id;
            location.where_origin = where_origin;
        }

        box.location = location;

        return box;
    });

    return updateAllItems(movedBoxes);
};

export const updateSandOrder = async (order: SandOrder | SandOrderBox) => {
    const { id } = order;

    return await axios
        .put(`${apiUrl}/sandOrder/${id}`, order)
        .then((response) => {
            return response.data.data;
        })
        .catch((err) => console.error(err));
};

export const updateAllItems = async (orders: Array<SandOrder | SandOrderBox>) => {
    const orderList = orders.map((order) => {
        return updateSandOrder(order);
    });

    return Promise.all(orderList);
};

export const updateSandStage = async (stage: SandStage) => {
    const { id } = stage;

    return await axios
        .put(`${apiUrl}/sandStage/${id}`, stage)
        .then((response) => {
            return response.data.data;
        })
        .catch((err) => console.error(err));
};
export const finishSandStage = async (stage: SandStage) => {
    const { id } = stage;
    stage.status = 2;

    return await axios
        .put(`${apiUrl}/sandStage/${id}`, stage)
        .then((response) => {
            return response.data.data;
        })
        .catch((err) => console.error(err));
};
