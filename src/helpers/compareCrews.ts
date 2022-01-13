interface CompareActionables {
    new: Array<any>;
    changed: Array<any>;
    deleted: Array<any>;
    unchanged: Array<any>;
}

// Deberia ser el mismo compareThings o el generico :D

import { HumanResource, Crew } from '@/interfaces/sandflow';

export function compareCrews(original: Array<Crew>, backup: Array<Crew>): CompareActionables {
    const result: CompareActionables = {
        new: [],
        changed: [],
        deleted: [],
        unchanged: [],
    };
    const isGlobalSame = deepCompare(original, backup);

    if (isGlobalSame) {
        result.unchanged = [...original];

        return result;
    }

    if (original.length === 0 && backup.length === 0) {
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
            result.new.push(originalEle);
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

export function compareResource(original: Array<HumanResource>, backup: Array<HumanResource>): CompareActionables {
    const result: CompareActionables = {
        new: [],
        changed: [],
        deleted: [],
        unchanged: [],
    };
    const isGlobalSame = deepCompare(original, backup);

    if (isGlobalSame) {
        result.unchanged = [...original];

        return result;
    }

    if (original.length === 0 && backup.length === 0) {
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
            result.new.push(originalEle);
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
