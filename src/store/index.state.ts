import User from '@/interfaces/User';
//declare state
export type State = { counter: number, current_user: User };
//set state
export const state: State = { counter: 0 };