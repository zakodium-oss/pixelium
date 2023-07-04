import type { PipelineSetBlurAction } from './filter/blur';
import type { PipelineSetFlipAction } from './filter/flip';
import type { PipelineSetGaussianBlurAction } from './filter/gaussianBlur';
import type { PipelineSetGradientFilterAction } from './filter/gradientFilter';
import type { PipelineSetGreyFilterAction } from './filter/greyFilter';
import type { PipelineSetInvertAction } from './filter/invert';
import type { PipelineSetLevelAction } from './filter/level';
import type { PipelineSetMedianFilterAction } from './filter/medianFilter';
import type { PipelineSetPixelateAction } from './filter/pixelate';
import type { PipelineSetMaskAction } from './mask';
import type {
  TogglePipelineOperationAction,
  RemovePipelineOperationAction,
} from './meta';
import type { PipelineSetCloseAction } from './morphology/close';
import type { PipelineSetDilateAction } from './morphology/dilate';
import type { PipelineSetErodeAction } from './morphology/erode';
import type { PipelineSetOpenAction } from './morphology/open';

export { setGreyFilter, SET_GREY_FILTER } from './filter/greyFilter';
export { setBlur, SET_BLUR } from './filter/blur';
export { setGaussianBlur, SET_GAUSSIAN_BLUR } from './filter/gaussianBlur';
export { setInvert, SET_INVERT } from './filter/invert';
export { setFlip, SET_FLIP } from './filter/flip';
export { setLevel, SET_LEVEL } from './filter/level';
export { setPixelate, SET_PIXELATE } from './filter/pixelate';
export { setMedianFilter, SET_MEDIAN_FILTER } from './filter/medianFilter';
export { setMask, SET_MASK } from './mask';
export { setDilate, SET_DILATE } from './morphology/dilate';
export { setErode, SET_ERODE } from './morphology/erode';
export { setOpen, SET_OPEN } from './morphology/open';
export { setClose, SET_CLOSE } from './morphology/close';
export { toggleOperation, TOGGLE_OPERATION } from './meta';
export { removeOperation, REMOVE_OPERATION } from './meta';
export {
  setGradientFilter,
  SET_GRADIENT_FILTER,
} from './filter/gradientFilter';

export type PipelineActionsTypes =
  | PipelineSetGreyFilterAction
  | PipelineSetBlurAction
  | PipelineSetGaussianBlurAction
  | PipelineSetInvertAction
  | PipelineSetFlipAction
  | PipelineSetLevelAction
  | PipelineSetPixelateAction
  | PipelineSetMedianFilterAction
  | PipelineSetMaskAction
  | PipelineSetDilateAction
  | PipelineSetErodeAction
  | PipelineSetOpenAction
  | PipelineSetCloseAction
  | TogglePipelineOperationAction
  | RemovePipelineOperationAction
  | PipelineSetGradientFilterAction;
