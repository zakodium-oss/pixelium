export type DataActionType<Action, Payload = void> = Payload extends void
  ? { type: Action }
  : { type: Action; payload: Payload };

export const SET_LOADING = 'SET_LOADING';

export const LOAD_DROP = 'LOAD_DROP';

export {
  SET_GREY_FILTER,
  SET_BLUR,
  SET_FLIP,
  SET_GAUSSIAN_BLUR,
  SET_INVERT,
  SET_LEVEL,
  SET_PIXELATE,
  SET_MEDIAN_FILTER,
  SET_MASK,
  SET_DILATE,
  SET_ERODE,
  SET_OPEN,
  SET_CLOSE,
  REMOVE_PIPELINE_OPERATION,
  TOGGLE_PIPELINE_OPERATION,
} from './actions/pipeline/PipelineActions';

export const SET_ROI = 'SET_ROI';
