import {
  createStore,
  Store as VuexStore,
  CommitOptions,
  DispatchOptions,
  createLogger
} from "vuex";

import {Actions, actions} from '@/store/index.action.ts';
import {Getters, getters} from '@/store/index.getter.ts';
import {Mutations, mutations} from '@/store/index.mutation.ts';
import {State, state} from '@/store/index.state.ts';

//setup store type
export type Store = Omit<
  VuexStore<State>,
  "commit" | "getters" | "dispatch"
> & {
  commit<K extends keyof Mutations, P extends Parameters<Mutations[K]>[1]>(
    key: K,
    payload: P,
    options?: CommitOptions
  ): ReturnType<Mutations[K]>;
} & {
  getters: {
    [K in keyof Getters]: ReturnType<Getters[K]>;
  };
} & {
  dispatch<K extends keyof Actions>(
    key: K,
    payload: Parameters<Actions[K]>[1],
    options?: DispatchOptions
  ): ReturnType<Actions[K]>;
};

export const store = createStore({
  state,
  mutations,
  actions,
  getters,
  plugins: [createLogger()]
});

export function useStore() {
  return store as Store;
}