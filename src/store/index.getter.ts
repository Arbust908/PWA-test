import {
  GetterTree,
} from "vuex";
import State from '@/store/index.state'

// Getters types
export type Getters = {
  doubleCounter(state: State): number;
};

//getters
export const getters: GetterTree<State, State> & Getters = {
  doubleCounter: state => {
    console.log("state", state.counter);
    return state.counter * 2;
  }
};