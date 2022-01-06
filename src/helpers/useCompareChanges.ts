interface CompareActionables {
    create: Array<any>;
    changed: Array<any>;
    deleted: Array<any>;
    unchanged: Array<any>;
}

export function useCompareChanges(original: Array<any>, backup: Array<any>): CompareActionables {
    const result: CompareActionables = {
        create: [],
        changed: [],
        deleted: [],
        unchanged: [],
    };

    if (original.length === 0 && backup.length === 0) {
        return result;
    }

    const isGlobalSame = deepCompare(original, backup);

    if (isGlobalSame) {
        result.unchanged.push(original);

        return result;
    }

    for (let i = 0; i < original.length; i++) {
        const originalEle = original[i];
        const foundEle = backup.find((ele) => ele.id === originalEle.id);

        if (foundEle && deepCompare(originalEle, foundEle)) {
            result.unchanged.push(originalEle);
        } else if (foundEle) {
            result.changed.push(originalEle);
        } else {
            result.create.push(originalEle);
        }
    }

    for (let i = 0; i < backup.length; i++) {
        const backupEle = backup[i];
        const foundEle = original.find((ele) => ele.id === backupEle.id);

        if (!foundEle) {
            result.deleted.push(backupEle);
        }
    }

    return result;
}

const deepCompare = (a: any, b: any) => {
    return JSON.stringify(a) === JSON.stringify(b);
};
