export type DataActionType<Action, Payload = void> = Payload extends void
  ? { type: Action }
  : { type: Action; payload: Payload };

export const INCREMENT = 'INCREMENT';
export const SET_LOADING = 'SET_LOADING';

export const LOAD_DROP = 'LOAD_DROP';

export const SET_GREY_FILTER = 'SET_GREY_FILTER';
export const SET_BLUR = 'SET_BLUR';
export const SET_GAUSSIAN_BLUR = 'SET_GAUSSIAN_BLUR';
export const SET_INVERT = 'SET_INVERT';
export const SET_FLIP = 'SET_FLIP';
export const SET_LEVEL = 'SET_LEVEL';
export const SET_PIXELATE = 'SET_PIXELATE';
export const SET_MEDIAN_FILTER = 'SET_MEDIAN_FILTER';
export const SET_MASK = 'SET_MASK';
export const REMOVE_PIPELINE_OPERATION = 'REMOVE_PIPELINE_OPERATION';
export const TOGGLE_PIPELINE_OPERATION = 'TOGGLE_PIPELINE_OPERATION';
