import { ref, Ref } from "vue";

export function useLocalStorage(keys: Array<string>) {
  const storage = keys.reduce((storage: {[key: string]: any}, key: string) => {
    storage[key] = {
      key,
      value: JSON.parse(localStorage.getItem(key)),
      get() {
        return JSON.parse(localStorage.getItem(key)) || null;
      },
      set(value: String) {
        return localStorage.setItem(key, JSON.stringify(value));
      },
      remove() {
        return localStorage.removeItem(key);
      }
    }
    return storage;
  }, {});
  return {
    keys,
    storage
  };
}