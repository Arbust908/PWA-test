import axios, { AxiosInstance } from 'axios';
import { Ldb } from './dexie';

class Funes {
    outloud = false; // Si logeamos o no;
    localDB: any; // Base de datos local
    server: AxiosInstance; // Intancia de comunica con la api
    constructor() {
        console.log('FUNES');
        this.localDB = Ldb;
        this.server = axios.create({
            baseURL: import.meta.env.VITE_API_URL || '/api',
            timeout: 10000,
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
        });
        this.outloud = Boolean(import.meta.env.VITE_DEV);
        console.log('FUNES::', this);
    }

    think(...thought: any) {
        if (this.outloud) {
            console.log(thought);
        }
    }

    async remember(enity: string) {
        // Chequea si Vuex/Pinia tiene la info que necesitamos
        this.think(`Remembering ${enity}`);
        // Si esta se devuelve
        // Si no esta ... chequeamos el online
        const isOnline = useOnline();
        this.think(isOnline.value);
        // ONLINE:: Pedimos a la api y guardamos en Ldb y en Vuex/Pinia
        // OFFLINE:: Buscamos en Ldb
        this.think('FUNES::remember', this.localDB);
        const colletion = this.localDB.table(enity);
        this.think('FUNES::remember', colletion);
        this.think('FUNES::remember', await colletion.toArray());

        return await colletion.toArray();
    }

    getTable(table: string) {
        if (table === 'forklifts') {
            return this.localDB.forklifts.toArray();
        }

        return;
    }

    act() {
        // Se le pasan las consultas no GET para que ejecute
        // chequeamos si esta online
        const isOnline = useOnline();
        this.think(isOnline.value);
        // ONLINE:: Se actua en la api y se actualiza Ldb y Vuex/Pinia
        // OFFLINE:: Se crea el OBJ Memo y se actua sobre Ldb y actualiza Vuex/Pinia
        console.log('FUNES::act');
    }

    greet() {
        // Busca todas transacciones pendientes del al Ldb
        // y las dispara
        console.log('FUNES::greet');
    }
}

export const FUNES = new Funes();
