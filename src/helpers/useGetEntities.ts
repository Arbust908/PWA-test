import axios from 'axios';
const apiUrl = import.meta.env.VITE_API_URL || '/api';

export const getPurchaseOrders = async () => {
    return await axios
        .get(`${apiUrl}/purchaseOrder`)
        .then((res) => {
            return res.data.data;
        })
        .catch((err) => console.error(err));
};
export const getSandOrders = async () => {
    return await axios
        .get(`${apiUrl}/sandOrder`)
        .then((res) => {
            return res.data.data;
        })
        .catch((err) => console.error(err));
};

export const getWarehouses = async () => {
    return await axios
        .get(`${apiUrl}/warehouse`)
        .then((res) => {
            return res.data.data;
        })
        .catch((err) => console.error(err));
};

export const getCradles = async () => {
    return await axios
        .get(`${apiUrl}/cradle`)
        .then((res) => {
            return res.data.data;
        })
        .catch((err) => console.error(err));
};
export const getCradle = async (cradleId: number) => {
    return await axios
        .get(`${apiUrl}/cradle/${cradleId}`)
        .then((res) => {
            return res.data.data;
        })
        .catch((err) => console.error(err));
};

export const getWorkOrders = async (queries = '') => {
    return await axios
        .get(`${apiUrl}/workOrder${queries}`)
        .then((res) => {
            return res.data.data;
        })
        .catch((err) => console.error(err));
};

export const getSand = async () => {
    return await axios
        .get(`${apiUrl}/sand`)
        .then((res) => {
            return res.data.data;
        })
        .catch((err) => console.error(err));
};
export const getSandPlan = async () => {
    return await axios
        .get(`${apiUrl}/sandPlan`)
        .then((res) => {
            return res.data.data;
        })
        .catch((err) => console.error(err));
};
