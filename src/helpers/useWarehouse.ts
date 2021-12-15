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

export const formatLocation = (location: string) => {
    const proxy = location.split('|');
    const [floor, row, col] = proxy;

    return { floor, row, col };
};
