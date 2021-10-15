export function useClone(original: any): any {
    const clone = JSON.parse(JSON.stringify(original));

    return {
        clone,
    };
}
