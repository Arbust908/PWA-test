import { Forklift } from '@/interfaces/sandflow';
import Dexie, { Table } from 'dexie';

export class LocalDB extends Dexie {
    // 'friends' is added by dexie when declaring the stores()
    // We just tell the typing system this is the case
    forklifts!: Table<Forklift>;

    constructor() {
        super('localDB');
        this.version(1).stores({
            forklifts: '++id, name', // Primary key and indexed props
        });
    }
}

export const Ldb = new LocalDB();
