import {
  Image,
  GreyOptions,
  ThresholdOptionsAlgorithm,
  BlurOptions,
  GaussianBlurXYOptions,
  FlipOptions,
  LevelOptions,
  PixelateOptions,
  MedianFilterOptions,
  Roi,
  DilateOptions,
  ErodeOptions,
  OpenOptions,
  CloseOptions,
} from 'image-js';
import { Draft, produce } from 'immer';
import { Reducer } from 'react';

import * as Type from './DataActionTypes';
import * as LoadActions from './actions/LoadActions';
import type { SetLoadingAction, LoadDropAction } from './actions/LoadActions';
import * as RoiActions from './actions/RoiActions';
import { SetROIAction } from './actions/RoiActions';
import * as PipelineActions from './actions/pipeline/PipelineActions';
import type { PipelineActionsTypes } from './actions/pipeline/PipelineActions';

interface InnerPipelineOperation<T extends string, O = undefined> {
  type: T;
  options: O;
  isActive: boolean;
  identifier: string;
}

type PipelineOperation<T extends string, O> = O extends undefined
  ? Omit<InnerPipelineOperation<T>, 'options'>
  : InnerPipelineOperation<T, O>;

export type PipelineOperations =
  | PipelineOperation<'GREY_FILTER', GreyOptions>
  | PipelineOperation<'BLUR', BlurOptions>
  | PipelineOperation<'GAUSSIAN_BLUR', GaussianBlurXYOptions>
  | PipelineOperation<'INVERT', undefined>
  | PipelineOperation<'FLIP', FlipOptions>
  | PipelineOperation<'LEVEL', LevelOptions>
  | PipelineOperation<'PIXELATE', PixelateOptions>
  | PipelineOperation<'MEDIAN_FILTER', MedianFilterOptions>
  | PipelineOperation<'MASK', ThresholdOptionsAlgorithm>
  | PipelineOperation<'DILATE', DilateOptions>
  | PipelineOperation<'ERODE', ErodeOptions>
  | PipelineOperation<'OPEN', OpenOptions>
  | PipelineOperation<'CLOSE', CloseOptions>;

export interface DataFile {
  image: Image;
  pipeline: PipelineOperations[];
  metadata: { name: string; relativePath: string };
  rois: Roi[];
}

export interface DataState {
  isLoading?: boolean;
  images: Record<string, DataFile>;
}

export const initialDataState: DataState = {
  isLoading: false,
  images: {},
};

export type DataActions =
  | SetLoadingAction
  | LoadDropAction
  | SetROIAction
  | PipelineActionsTypes;

function innerDataReducer(draft: Draft<DataState>, action: DataActions) {
  switch (action.type) {
    case Type.SET_LOADING:
      return LoadActions.setLoading(draft, action.payload);
    case Type.LOAD_DROP:
      return LoadActions.loadDrop(draft, action.payload);
    case Type.SET_GREY_FILTER:
      return PipelineActions.setGreyFilter(draft, action.payload);
    case Type.SET_BLUR:
      return PipelineActions.setBlur(draft, action.payload);
    case Type.SET_GAUSSIAN_BLUR:
      return PipelineActions.setGaussianBlur(draft, action.payload);
    case Type.SET_INVERT:
      return PipelineActions.setInvert(draft, action.payload);
    case Type.SET_MASK:
      return PipelineActions.setMask(draft, action.payload);
    case Type.SET_FLIP:
      return PipelineActions.setFlip(draft, action.payload);
    case Type.SET_LEVEL:
      return PipelineActions.setLevel(draft, action.payload);
    case Type.SET_PIXELATE:
      return PipelineActions.setPixelate(draft, action.payload);
    case Type.SET_MEDIAN_FILTER:
      return PipelineActions.setMedianFilter(draft, action.payload);
    case Type.REMOVE_OPERATION:
      return PipelineActions.removeOperation(draft, action.payload);
    case Type.TOGGLE_OPERATION:
      return PipelineActions.toggleOperation(draft, action.payload);
    case Type.SET_ROI:
      return RoiActions.setROIs(draft, action.payload);
    case Type.SET_DILATE:
      return PipelineActions.setDilate(draft, action.payload);
    case Type.SET_ERODE:
      return PipelineActions.setErode(draft, action.payload);
    case Type.SET_OPEN:
      return PipelineActions.setOpen(draft, action.payload);
    case Type.SET_CLOSE:
      return PipelineActions.setClose(draft, action.payload);
    default:
      throw new Error('Unknown action type in data reducer.');
  }
}

export const dataReducer: Reducer<DataState, DataActions> =
  produce(innerDataReducer);
