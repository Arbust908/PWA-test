// WIP
interface CompareActionables {
    new: Array<any>;
    changed: Array<any>;
    deleted: Array<any>;
    unchanged: Array<any>;
}

export function useCompareChanges(original: Array<any>, backup: Array<any>): CompareActionables {
    const result: CompareActionables = {
        new: [],
        changed: [],
        deleted: [],
        unchanged: [],
    };
    const isGlobalSame = deepCompare(original, backup);

    if (isGlobalSame) {
        result.unchanged.push(original);

        return result;
    }

    if (original.length === 0 && backup.length === 0) {
        return result;
    }

    for (let i = 0; i < original.length; i++) {
        const originalEle = original[i];
        for (let j = 0; j < backup.length; j++) {
            const backupEle = backup[j];
        }
    }

    return result;
}

const deepCompare = (a: any, b: any) => {
    return JSON.stringify(a) === JSON.stringify(b);
};
