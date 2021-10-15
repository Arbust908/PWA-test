export function useLocalStorage(keys: Array<string>) {
    const storage = keys.reduce((stored: { [key: string]: any }, key: string) => {
        stored[key] = {
            key,
            value: JSON.parse(localStorage.getItem(key) || ''),
            get() {
                return JSON.parse(localStorage.getItem(key) || '') || null;
            },
            set(value: string) {
                return localStorage.setItem(key, JSON.stringify(value));
            },
            remove() {
                return localStorage.removeItem(key);
            },
        };

        return stored;
    }, {});

    return {
        keys,
        storage,
    };
}
