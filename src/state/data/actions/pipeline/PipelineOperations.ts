import type { PipelineBlurOperation } from './filter/blur';
import type { FlipOperation } from './filter/flip';
import type { GaussianBlurOperation } from './filter/gaussianBlur';
import type { GreyFilterOperation } from './filter/greyFilter';
import type { InvertOperation } from './filter/invert';
import type { LevelOperation } from './filter/level';
import type { MedianFilterOperation } from './filter/medianFilter';
import type { PixelateOperation } from './filter/pixelate';
import type { MaskOperation } from './mask';
import type { CloseOperation } from './morphology/close';
import type { DilateOperation } from './morphology/dilate';
import type { ErodeOperation } from './morphology/erode';
import type { OpenOperation } from './morphology/open';

interface InnerPipelineOperation<T extends string, O = undefined> {
  type: T;
  options: O;
  isActive: boolean;
  identifier: string;
}

export type PipelineOperation<T extends string, O> = O extends undefined
  ? Omit<InnerPipelineOperation<T>, 'options'>
  : InnerPipelineOperation<T, O>;

export type PipelineOperations =
  | GreyFilterOperation
  | PipelineBlurOperation
  | FlipOperation
  | GaussianBlurOperation
  | InvertOperation
  | LevelOperation
  | MedianFilterOperation
  | PixelateOperation
  | CloseOperation
  | DilateOperation
  | ErodeOperation
  | OpenOperation
  | MaskOperation;
