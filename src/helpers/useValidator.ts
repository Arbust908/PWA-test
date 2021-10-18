export async function useValidator(store: any, entity: string) {
    const validations = store.getters[`${entity}Validation`];
    const isValid = Object.values(validations).every((item) => item);

    return isValid;
}
