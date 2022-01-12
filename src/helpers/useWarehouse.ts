import { useClone } from '@/helpers/useClone';

export const formatDeposit = (deposit: any) => {
    const deposito = useClone(deposit);
    const dimensions = Object.keys(deposito).reduce(
        (dims, currentCell) => {
            const proxy = currentCell.split('|');
            const [floor, row, col] = proxy;
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

// {
//     "1|1|1": {
//         "id": "SDG85",
//         "category": "fina"
//     },
//     "1|1|2": {
//         "category": "empty"
//     },
//     "1|1|3": {
//         "category": "gruesa"
//     },
//     "1|1|4": {
//         "category": "empty"
//     },
//     "1|1|5": {
//         "category": "cortada"
//     },
//     "1|2|1": {
//         "category": "fina"
//     },
//     "1|2|2": {
//         "category": "empty"
//     },
//     "1|2|3": {
//         "category": "gruesa"
//     },
//     "1|2|4": {
//         "category": "empty"
//     },
//     "1|2|5": {
//         "category": "cortada"
//     },
//     "1|3|1": {
//         "category": "fina"
//     },
//     "1|3|2": {
//         "category": "empty"
//     },
//     "1|3|3": {
//         "category": "gruesa"
//     },
//     "1|3|4": {
//         "category": "empty"
//     },
//     "1|3|5": {
//         "category": "cortada"
//     }
// }
export const boxesByFloor = (location: any) => {
    console.log('boxesByFloor', location);
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
    console.log(boxes);

    return boxes;
};
