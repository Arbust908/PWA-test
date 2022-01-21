import { useClone } from '@/helpers/useClone';
import { SandOrder, SandOrderBox } from '@/interfaces/sandflow';

import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL || '/api';

export const defaultBox = {
    floor: 1,
    col: 0,
    row: 0,
    category: '',
    id: '',
    boxId: '',
    location: '',
    wasOriginallyOnDeposit: false,
    wasOriginallyOnCradle: false,
};

export const formatDeposit = (deposit: any) => {
    const formatedDefault = { floor: 0, row: 0, col: 0, dimensions: '' };

    if (!deposit) {
        console.error('Deposit es ', deposit);

        return { ...formatedDefault };
    }
    const { clone: deposito } = useClone(deposit);
    const dimensions = Object.keys(deposito).reduce(
        (dims, currentCell) => {
            const cellNameArray = currentCell.split('|');
            const [floor, row, col] = cellNameArray;
            dims.floor = Math.max(dims.floor, Number(floor));
            dims.row = Math.max(dims.row, Number(row));
            dims.col = Math.max(dims.col, Number(col));

            return dims;
        },
        { ...formatedDefault }
    );
    dimensions.dimensions = `${dimensions.row} x ${dimensions.col}`;

    return dimensions;
};

export const formatCell = (cell: string) => {
    const proxy = cell.split('|');
    const [floor, row, col] = proxy;

    return { floor, row, col };
};

const DEFAULT_DIMENSIONS = { floor: 0, row: 0, col: 0, dimensions: '' };

const getMax = (maxDimensions, newCell) => {
    const { floor, row, col } = formatCell(newCell);
    maxDimensions.floor = Math.max(maxDimensions.floor, Number(floor));
    maxDimensions.row = Math.max(maxDimensions.row, Number(row));
    maxDimensions.col = Math.max(maxDimensions.col, Number(col));

    return maxDimensions;
};

export const formatLocation = (location: any) => {
    if (!location || typeof location !== 'object') {
        return DEFAULT_DIMENSIONS;
    }
    const dimensions = Object.keys(location).reduce(getMax, DEFAULT_DIMENSIONS);

    return dimensions;
};

export const boxesByFloor = (location: any, queueItemSort = false) => {
    if (queueItemSort) {
        const boxes = location.reduce((allFloors: Array<any>, box: any) => {
            const { location: wheres } = box;

            if (wheres.where !== 'warehouse') {
                return;
            }
            const { floor, col, row } = wheres;

            box.floor = floor;
            box.col = col;
            box.row = row;

            const floorIndex = Number(box.floor) - 1;

            if (!allFloors[floorIndex]) {
                allFloors[floorIndex] = [];
            }
            allFloors[floorIndex].push(box);

            return allFloors;
        }, []);

        return boxes;
    }

    const boxes = Object.keys(location).reduce((bxs: any, currentCell) => {
        const box = location[currentCell];

        if (box && !box.id) {
            return bxs;
        }
        const { floor, row, col } = formatCell(currentCell);
        box.floor = floor;
        box.row = row;
        box.col = col;
        const floorIndex = Number(floor) - 1;

        if (!bxs[floorIndex]) {
            bxs[floorIndex] = [];
        }
        bxs[floorIndex].push(box);

        return bxs;
    }, []);

    return boxes;
};

export const getBoxClasses = (category: string, status: number) => {
    if (status === 11) {
        return 'mesh-type__empty boxCard';
    } else if (status === null) {
        return 'notDesignated';
    } else {
        switch (category) {
            case '1':
                return 'mesh-type__1 boxCard';
            case '2':
                return 'mesh-type__2 boxCard';
            case '3':
                return 'mesh-type__3 boxCard';
            case '4':
                return 'mesh-type__4 boxCard';
            case '5':
                return 'mesh-type__5 boxCard';
            case 'empty':
                return 'mesh-type__empty boxCard';
            case 'aisle':
                return 'mesh-type__taken aisle';
            case 'cradle':
                return 'mesh-type__taken cradle';
            case null:
                return '';
            default:
                if (parseInt(category) > 5) {
                    return 'mesh-type__extra boxCard';
                } else {
                    return '';
                }
        }
    }

    return '';
};

export const getInDepoBoxes = (boxes: Array<any>, depoId: number) => {
    // console.groupCollapsed('getInDepoBoxes');
    // console.log('boxes', boxes);
    // console.log('boxes', [...boxes]);
    // console.log('depoId', depoId);
    const boxy = boxes.filter((box) => {
        const { location } = box;

        return location && location.where === 'warehouse' && location.where_id === depoId;
    });
    // console.log('boxy', boxy);
    // console.groupEnd();

    return [...new Set(boxy)];
};

export const searchInDepoBoxes = async (depoId: number) => {
    let allBoxes = await getSandOrders();
    allBoxes = allBoxes.filter((box: SandOrder) => box.location).map(formatBoxLocation);

    return getInDepoBoxes(allBoxes, depoId);
};

export const getSandOrders = async () => {
    return await axios
        .get(`${apiUrl}/sandOrder`)
        .then((response) => {
            return response.data.data;
        })
        .catch((err) => console.error(err));
};
export const formatBoxLocation = (box: SandOrder): SandOrderBox => {
    const { location } = box;
    box.location = JSON.parse(location);
    box.row = box.location.row;
    box.col = box.location.col;
    box.floor = box.location.floor;

    return box as SandOrderBox;
};
