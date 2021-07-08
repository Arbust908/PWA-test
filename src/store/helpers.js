/*** DEPRECO POR QUE VAMOS A USAR vuex-composition-helpers
 * Tambien hay que quedar atentos al issue en el repo de VUEX https://github.com/vuejs/vuex/issues/1725

import { computed } from 'vue';
import { useStore } from 'vuex';

export function useState(arr) {
  const store = useStore();
  const keypair = arr.map((s) => [s, computed(() => store.state[s])]);
  return Object.fromEntries(keypair);
}
export function useGetters(arr) {
  const store = useStore();
  const keypair = arr.map((g) => [g, computed(() => store.getters[g])]);
  return Object.fromEntries(keypair);
}
export function useMutations(arr) {
  const store = useStore();
  const keypair = arr.map((m) => [m, (input) => store.commit(m, input)]);
  return Object.fromEntries(keypair);
}
export function useActions(arr) {
  const store = useStore();
  const keypair = arr.map((a) => [a, (input) => store.dispatch(a, input)]);
  return Object.fromEntries(keypair);
}
 */
