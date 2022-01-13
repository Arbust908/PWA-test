export const notLonly = (array: any[]): boolean => array.length > 1;
export const isFirst = (key: number): boolean => key === 0;
export const isLast = (key: number, array: any[]): boolean => key === array.length - 1;
export const isNotLast = (key: number, array: any[]): boolean => !isLast(key, array);
export const isNotFirst = (key: number): boolean => !isFirst(key);
export const isNotLastAndNotLonly = (key: number, array: any[]): boolean => {
    return !isLast(key, array) && notLonly(array);
};
export const isEven = (key: number): boolean => key % 2 === 0;
/**
 * useOnFirst se fija si el elemento es el primero de la lista
 * y devuelev algo. No se si es lo mas util
 */
export const useOnFirst = (key: number, ifFirst: any): any => {
    return isFirst(key) ? ifFirst : null;
};

export const useIfNotLonly = (array: any[]): boolean => {
    return notLonly(array);
};

/**
 * El último del Array
 *
 * @param array El array del que queremos la última posición
 * @returns La ultima posición
 */
export function getLast(array: Array<any>) {
    return array[array.length - 1];
}

export default {
    useOnFirst,
    useIfNotLonly,
    notLonly,
    isFirst,
    isLast,
    isEven,
    getLast,
};
