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

export { addGreyFilter, SET_GREY_FILTER } from './filter/greyFilter';
export { addBlur, SET_BLUR } from './filter/blur';
export { addGaussianBlur, SET_GAUSSIAN_BLUR } from './filter/gaussianBlur';
export { addInvert, SET_INVERT } from './filter/invert';
export { addFlip, SET_FLIP } from './filter/flip';
export { addLevel, SET_LEVEL } from './filter/level';
export { addPixelate, SET_PIXELATE } from './filter/pixelate';
export { addMedianFilter, SET_MEDIAN_FILTER } from './filter/medianFilter';
export { addMask, SET_MASK } from './mask';
export { addDilate, SET_DILATE } from './morphology/dilate';
export { addErode, SET_ERODE } from './morphology/erode';
export { addOpen, SET_OPEN } from './morphology/open';
export { addClose, SET_CLOSE } from './morphology/close';
export { toggleOperation, TOGGLE_PIPELINE_OPERATION } from './meta';
export { removeOperation, REMOVE_PIPELINE_OPERATION } from './meta';

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
