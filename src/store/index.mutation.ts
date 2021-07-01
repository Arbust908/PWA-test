import {
  MutationTree,
} from "vuex";

import State from '@/store/index.state'
export enum MutationTypes {
  INC_COUNTER = "SET_COUNTER"
}

//Mutation Types
export type Mutations<S = State> = {
  [MutationTypes.INC_COUNTER](state: S, payload: number): void;
};

//define mutations
export const mutations: MutationTree<State> & Mutations = {
  [MutationTypes.INC_COUNTER](state: State, payload: number) {
    state.counter += payload;
  }
};
