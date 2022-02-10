declare global {
    interface String {
        capitalize(): string;
    }
}
const online = useOnline();
import Localbase from 'localbase';

const db = new Localbase('db');
export enum StoreLogicMethods {
    CREATE = 'create',
    GET = 'get',
    GET_ALL = 'getAll',
    DELETE = 'delete',
    UPDATE = 'update',
}

export async function useStoreLogic(
    router: any,
    store: any,
    entity: string,
    method: StoreLogicMethods | string,
    payload?: any
) {
    console.log(online ? '🟢 Tamos Redy' : '🔴 No redy');
    const localDB = await db.collection(entity).get();
    console.log(localDB);

    if (!online) {
        console.log('Vamos por el LocalDB');
    }

    return await store.dispatch(`${entity}DataHandler`, { method, payload }).then((res: any) => {
        const { CREATE, GET, GET_ALL, DELETE, UPDATE } = StoreLogicMethods;
        String.prototype.capitalize = function () {
            return this.charAt(0).toUpperCase() + this.slice(1);
        };
        const routeName = entity.capitalize();
        console.log(`${routeName} ${method}`, res);

        if (res && method === CREATE) {
            return { type: 'success', res };
        }

        if (!res.createdAt && method === CREATE) {
            const message = store.getters[`${entity}Message`](method);

            return { type: 'failed', message };
        }

        if (method === GET || method === GET_ALL) {
            if (res.status !== 'failed') {
                return { type: 'success', res };
            } else {
                const message = store.getters[`${entity}Message`](method);

                return { type: 'failed', message };
            }
        }

        if (method === DELETE) {
            if (res.status !== 'failed') {
                return { type: 'success', res };
            } else {
                const message = store.getters[`${entity}Message`](method);

                return { type: 'failed', message };
            }
        }

        if (method === UPDATE) {
            if (res.status !== 'failed') {
                return { type: 'success', res };
            } else {
                const message = store.getters[`${entity}Message`](method);

                return { type: 'failed', message };
            }
        }
    });
}
