import { SandOrder, SandOrderBox } from '@/interfaces/sandflow';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL || '/api';

export const updateSandOrder = async (order: SandOrder | SandOrderBox) => {
    const { id } = order;

    return await axios
        .put(`${apiUrl}/sandOrder/${id}`, order)
        .then((response) => {
            return response.data.data;
        })
        .catch((err) => console.error(err));
};

export const finishSandOrder = async (order: SandOrder | SandOrderBox) => {
    order.status = 99;

    return updateSandOrder(order);
};
