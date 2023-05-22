export type DataActionType<Action, Payload = void> = Payload extends void
  ? { type: Action }
  : { type: Action; payload: Payload };

export const INCREMENT = 'INCREMENT';
export const SET_LOADING = 'SET_LOADING';

export const LOAD_DROP = 'LOAD_DROP';
