import type { PipelineAddBlurAction } from './filter/blur';
import type { PipelineAddFlipAction } from './filter/flip';
import type { PipelineAddGaussianBlurAction } from './filter/gaussianBlur';
import type { PipelineAddGreyFilterAction } from './filter/greyFilter';
import type { PipelineAddInvertAction } from './filter/invert';
import type { PipelineAddLevelAction } from './filter/level';
import type { PipelineAddMedianFilterAction } from './filter/medianFilter';
import type { PipelineAddPixelateAction } from './filter/pixelate';
import type { PipelineAddMaskAction } from './mask';
import type {
  TogglePipelineOperationAction,
  RemovePipelineOperationAction,
} from './meta';
import type { PipelineAddCloseAction } from './morphology/close';
import type { PipelineAddDilateAction } from './morphology/dilate';
import type { PipelineAddErodeAction } from './morphology/erode';
import type { PipelineAddOpenAction } from './morphology/open';

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

export type PipelineActionsTypes =
  | PipelineAddGreyFilterAction
  | PipelineAddBlurAction
  | PipelineAddGaussianBlurAction
  | PipelineAddInvertAction
  | PipelineAddFlipAction
  | PipelineAddLevelAction
  | PipelineAddPixelateAction
  | PipelineAddMedianFilterAction
  | PipelineAddMaskAction
  | PipelineAddDilateAction
  | PipelineAddErodeAction
  | PipelineAddOpenAction
  | PipelineAddCloseAction
  | TogglePipelineOperationAction
  | RemovePipelineOperationAction;
