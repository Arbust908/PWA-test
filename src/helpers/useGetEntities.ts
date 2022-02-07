import {
    Cradle,
    PurchaseOrder,
    Sand,
    SandOrder,
    SandPlan,
    SandStage,
    Warehouse,
    WorkOrder,
} from '@/interfaces/sandflow';
import axios from 'axios';
const apiUrl = import.meta.env.VITE_API_URL || '/api';

export const getPurchaseOrders = async () => {
    return await axios
        .get(`${apiUrl}/purchaseOrder`)
        .then((res) => {
            return res.data.data as PurchaseOrder[];
        })
        .catch((err) => console.error(err));
};
export const getSandOrders = async () => {
    return await axios
        .get(`${apiUrl}/sandOrder`)
        .then((res) => {
            return res.data.data as SandOrder[];
        })
        .catch((err) => console.error(err));
};

export const getWarehouses = async () => {
    return await axios
        .get(`${apiUrl}/warehouse`)
        .then((res) => {
            return res.data.data as Warehouse[];
        })
        .catch((err) => console.error(err));
};

export const getCradles = async () => {
    return await axios
        .get(`${apiUrl}/cradle`)
        .then((res) => {
            return res.data.data as Cradle[];
        })
        .catch((err) => console.error(err));
};
export const getCradle = async (cradleId: number) => {
    return await axios
        .get(`${apiUrl}/cradle/${cradleId}`)
        .then((res) => {
            return res.data.data as Cradle;
        })
        .catch((err) => console.error(err));
};

export const getWorkOrders = async (queries = '') => {
    return await axios
        .get(`${apiUrl}/workOrder${queries}`)
        .then((res) => {
            return res.data.data as WorkOrder[];
        })
        .catch((err) => console.error(err));
};

export const getSand = async () => {
    return await axios
        .get(`${apiUrl}/sand`)
        .then((res) => {
            return res.data.data as Sand[];
        })
        .catch((err) => console.error(err));
};
export const getSandPlan = async () => {
    return await axios
        .get(`${apiUrl}/sandPlan`)
        .then((res) => {
            return res.data.data as SandPlan[];
        })
        .catch((err) => console.error(err));
};
export const updateCradle = async (cradleData: Cradle) => {
    const { id } = cradleData;

    return await axios
        .put(`${apiUrl}/cradle/${id}`, cradleData)
        .then((response) => {
            return response.data.data;
        })
        .catch((err) => console.error(err));
};
export const updateStage = async (stageData: SandStage) => {
    const { id } = stageData;

    return await axios
        .put(`${apiUrl}/sandStage/${id}`, stageData)
        .then((response) => {
            return response.data.data;
        })
        .catch((err) => console.error(err));
};
export const updateWorkOrder = async (workOrderData: WorkOrder) => {
    const { id } = workOrderData;

    return await axios
        .put(`${apiUrl}/workOrder/${id}`, workOrderData)
        .then((response) => {
            return response.data.data;
        })
        .catch((err) => console.error(err));
};
