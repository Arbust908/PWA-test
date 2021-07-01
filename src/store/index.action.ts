import {
  ActionContext,
  ActionTree,
} from "vuex";
import State from '@/store/index.state.ts'
import {Mutations, MutationTypes} from '@/store/index.mutation.ts';

export enum ActionTypes {
  INC_COUNTER = "SET_COUNTER"
}
//actions
type AugmentedActionContext = {
  commit<K extends keyof Mutations>(
    key: K,
    payload: Parameters<Mutations[K]>[1]
  ): ReturnType<Mutations[K]>;
} & Omit<ActionContext<State, State>, "commit">;

// actions interface
export interface Actions {
  [ActionTypes.INC_COUNTER](
    { commit }: AugmentedActionContext,
    payload: number
  ): void;
}

export const actions: ActionTree<State, State> & Actions = {
  [ActionTypes.INC_COUNTER]({ commit }, payload: number) {
    commit(MutationTypes.INC_COUNTER, payload);
  }
};