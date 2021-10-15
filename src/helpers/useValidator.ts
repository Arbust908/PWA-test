export async function useValidator(store: Object, entity: String) {
  const validations = store.getters[`${entity}Validation`]
  const isValid = Object.values(validations).every(item => item)

  return isValid
}