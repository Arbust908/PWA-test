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
    console.groupCollapsed('formatCell');
    const proxy = cell.split('|');
    console.log(proxy);
    const [floor, row, col] = proxy;
    console.log(floor, row, col);
    console.groupEnd();

    return { floor, row, col };
};

const DEFAULT_DIMENSIONS = { floor: 0, row: 0, col: 0, dimensions: '' };

const getMax = (maxDimensions, newCell) => {
    console.groupCollapsed('getMax');
    console.log(maxDimensions);
    console.log(newCell);
    const { floor, row, col } = formatCell(newCell);
    console.log(floor, row, col);
    console.log(Number(floor), Number(row), Number(col));
    console.log(Math.max(maxDimensions.floor, Number(floor)));
    console.log(Math.max(maxDimensions.row, Number(row)));
    console.log(Math.max(maxDimensions.col, Number(col)));
    maxDimensions.floor = Math.max(maxDimensions.floor, Number(floor));
    maxDimensions.row = Math.max(maxDimensions.row, Number(row));
    maxDimensions.col = Math.max(maxDimensions.col, Number(col));
    console.groupEnd();

    return maxDimensions;
};

export const formatLocation = (location: any) => {
    console.groupCollapsed('formatLocation');
    console.log(location);

    if (!location || typeof location !== 'object') {
        console.groupEnd();

        return DEFAULT_DIMENSIONS;
    }
    const dimensions = Object.keys(location).reduce(getMax, DEFAULT_DIMENSIONS);
    console.groupEnd();

    return dimensions;
};
