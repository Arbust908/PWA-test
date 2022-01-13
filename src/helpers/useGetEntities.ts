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

export const getWorkOrders = async () => {
    return await axios
        .get(`${apiUrl}/workOrder`)
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
