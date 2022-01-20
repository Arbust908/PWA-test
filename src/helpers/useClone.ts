export function useClone(original: any): any {
    if (!original) {
        console.error('Original es ', original);
        console.error('No se pudo clonar');

        return original;
    }
    const clone = JSON.parse(JSON.stringify(original));

    return {
        clone,
    };
}
