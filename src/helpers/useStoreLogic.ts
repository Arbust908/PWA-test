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

        if (res && method == 'create') {
            router.push({ name: routeName });

            return { type: 'success', res };
        }

        if (!res.createdAt && method == 'create') {
            const message = store.getters[`${entity}Message`](method);

            return { type: 'failed', message };
        }

        if (method == 'get' || method == 'getAll') {
            if (res.status !== 'failed') {
                return { type: 'success', res };
            } else {
                const message = store.getters[`${entity}Message`](method);

                return { type: 'failed', message };
            }
        }

        if (method == 'delete') {
            if (res.status !== 'failed') {
                return { type: 'success', res };
            } else {
                const message = store.getters[`${entity}Message`](method);

                return { type: 'failed', message };
            }
        }

        if (method == 'update') {
            if (res.status !== 'failed') {
                router.push({ name: routeName });

                return { type: 'success', res };
            } else {
                const message = store.getters[`${entity}Message`](method);

                return { type: 'failed', message };
            }
        }
    });
}
