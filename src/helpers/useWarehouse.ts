import { useClone } from '@/helpers/useClone';

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
        { floor: 0, row: 0, col: 0, dimensions: '' }
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

export const boxesByFloor = (location: any) => {
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

export const getBoxClasses = (category: string) => {
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
    }

    return 'mesh-type__empty boxCard';
};

export const getInDepoBoxes = (boxes: Array<any>, depoId: number) => {
    const boxy = boxes.filter((box) => {
        const { location } = box;

        return location && location.where_id === depoId;
    });

    return [...new Set(boxy)];
};
