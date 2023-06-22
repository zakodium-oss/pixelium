export type DataActionType<Action, Payload = void> = Payload extends void
  ? { type: Action }
  : { type: Action; payload: Payload };

export const INCREMENT = 'INCREMENT';
export const SET_LOADING = 'SET_LOADING';

export const LOAD_DROP = 'LOAD_DROP';

export const ADD_GREY_FILTER = 'ADD_GREY_FILTER';
export const ADD_BLUR = 'ADD_BLUR';
export const ADD_MASK = 'ADD_MASK';
export const REMOVE_PIPELINE_OPERATION = 'REMOVE_PIPELINE_OPERATION';
export const MOVE_PIPELINE_OPERATION_UP = 'MOVE_PIPELINE_OPERATION_UP';
export const MOVE_PIPELINE_OPERATION_DOWN = 'MOVE_PIPELINE_OPERATION_DOWN';
