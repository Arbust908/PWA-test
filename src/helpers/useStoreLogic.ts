declare global {
    interface String {
        capitalize(): string;
    }
}
export enum StoreLogicMethods {
    CREATE = 'create',
    GET = 'get',
    GET_ALL = 'getAll',
    DELETE = 'delete',
    UPDATE = 'update',
}

export async function useStoreLogic(router: any, store: any, entity: string, method: StoreLogicMethods, payload?: any) {
    return await store.dispatch(`${entity}DataHandler`, { method, payload }).then((res: any) => {
        String.prototype.capitalize = function () {
            return this.charAt(0).toUpperCase() + this.slice(1);
        };
        const routeName = entity.capitalize();

        // const redirectHandler = (responseNumber: any) => {
        //     if (responseNumber == 200) {
        //         router.push({ name: routeName });
        //     } else if (responseNumber == 500) {
        //         router.push({ name: 'Error-500' });
        //     } else if (responseNumber == 503) {
        //         router.push({ name: 'Error-503' });
        //     } else if (responseNumber == 504) {
        //         router.push({ name: 'Error-504' });
        //     }
        // };

        if (res && method === StoreLogicMethods.CREATE) {
            // redirectHandler(res.status);

            return { type: 'success', res };
        }

        if (!res.createdAt && method === StoreLogicMethods.CREATE) {
            const message = store.getters[`${entity}Message`](method);
            // redirectHandler(res.status);

            return { type: 'failed', message };
        }

        if (method === StoreLogicMethods.GET || method === StoreLogicMethods.GET_ALL) {
            if (res.status !== 'failed') {
                // redirectHandler(res.status);

                return { type: 'success', res };
            } else {
                const message = store.getters[`${entity}Message`](method);
                // redirectHandler(res.status);

                return { type: 'failed', message };
            }
        }

        if (method === StoreLogicMethods.DELETE) {
            if (res.status !== 'failed') {
                // redirectHandler(res.status);

                return { type: 'success', res };
            } else {
                const message = store.getters[`${entity}Message`](method);
                // redirectHandler(res.status);

                return { type: 'failed', message };
            }
        }

        if (method === StoreLogicMethods.UPDATE) {
            if (res.status !== 'failed') {
                // redirectHandler(res.status);

                return { type: 'success', res };
            } else {
                const message = store.getters[`${entity}Message`](method);
                // redirectHandler(res.status);

                return { type: 'failed', message };
            }
        }
    });
}
