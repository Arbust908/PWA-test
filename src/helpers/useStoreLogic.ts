declare global {
    interface String {
        capitalize(): string;
    }
}

export async function useStoreLogic(router: any, store: any, entity: string, method: string, payload?: any) {
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

        if (res && method == 'create') {
            // redirectHandler(res.status);

            return { type: 'success', res };
        }

        if (!res.createdAt && method == 'create') {
            const message = store.getters[`${entity}Message`](method);
            // redirectHandler(res.status);

            return { type: 'failed', message };
        }

        if (method == 'get' || method == 'getAll') {
            if (res.status !== 'failed') {
                // redirectHandler(res.status);

                return { type: 'success', res };
            } else {
                const message = store.getters[`${entity}Message`](method);
                // redirectHandler(res.status);

                return { type: 'failed', message };
            }
        }

        if (method == 'delete') {
            if (res.status !== 'failed') {
                // redirectHandler(res.status);

                return { type: 'success', res };
            } else {
                const message = store.getters[`${entity}Message`](method);
                // redirectHandler(res.status);

                return { type: 'failed', message };
            }
        }

        if (method == 'update') {
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
