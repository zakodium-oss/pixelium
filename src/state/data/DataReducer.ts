import {
  Image,
  GreyOptions,
  Mask,
  ThresholdOptionsAlgorithm,
  BlurOptions,
  GaussianBlurXYOptions,
  FlipOptions,
} from 'image-js';
import { Draft, produce } from 'immer';
import { Reducer } from 'react';

import * as Type from './DataActionTypes';
import * as LoadActions from './actions/LoadActions';
import type { SetLoadingAction, LoadDropAction } from './actions/LoadActions';
import * as PipelineActions from './actions/PipelineActions';
import {
  PipelineAddGreyFilterAction,
  RemovePipelineOperationAction,
  PipelineAddMaskAction,
  PipelineAddBlurAction,
  TogglePipelineOperationAction,
  PipelineAddGaussianBlurAction,
  PipelineAddInvertAction,
  PipelineAddFlipAction,
} from './actions/PipelineActions';

interface InnerPipelineOperation<T extends string, R, O = undefined> {
  type: T;
  options: O;
  isActive: boolean;
  result?: R;
  identifier: string;
}

type PipelineOperation<T extends string, R, O> = O extends undefined
  ? Omit<InnerPipelineOperation<T, R>, 'options'>
  : InnerPipelineOperation<T, R, O>;

export type PipelineOperations =
  | PipelineOperation<'GREY_FILTER', Image, GreyOptions>
  | PipelineOperation<'BLUR', Image, BlurOptions>
  | PipelineOperation<'GAUSSIAN_BLUR', Image, GaussianBlurXYOptions>
  | PipelineOperation<'INVERT', Image | Mask, undefined>
  | PipelineOperation<'FLIP', Image, FlipOptions>
  | PipelineOperation<'MASK', Mask, ThresholdOptionsAlgorithm>;

export interface DataFile {
  image: Image;
  pipeline: PipelineOperations[];
  metadata: { name: string; relativePath: string };
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
  | PipelineAddGreyFilterAction
  | PipelineAddBlurAction
  | PipelineAddGaussianBlurAction
  | PipelineAddInvertAction
  | PipelineAddFlipAction
  | PipelineAddMaskAction
  | RemovePipelineOperationAction
  | TogglePipelineOperationAction;

function innerDataReducer(draft: Draft<DataState>, action: DataActions) {
  switch (action.type) {
    case Type.SET_LOADING:
      return LoadActions.setLoading(draft, action.payload);
    case Type.LOAD_DROP:
      return LoadActions.loadDrop(draft, action.payload);
    case Type.ADD_GREY_FILTER:
      return PipelineActions.addGreyFilter(draft, action.payload);
    case Type.ADD_BLUR:
      return PipelineActions.addBlur(draft, action.payload);
    case Type.ADD_GAUSSIAN_BLUR:
      return PipelineActions.addGaussianBlur(draft, action.payload);
    case Type.ADD_INVERT:
      return PipelineActions.addInvert(draft, action.payload);
    case Type.ADD_MASK:
      return PipelineActions.addMask(draft, action.payload);
    case Type.ADD_FLIP:
      return PipelineActions.addFlip(draft, action.payload);
    case Type.REMOVE_PIPELINE_OPERATION:
      return PipelineActions.removeOperation(draft, action.payload);
    case Type.TOGGLE_PIPELINE_OPERATION:
      return PipelineActions.toggleOperation(draft, action.payload);
    default:
      throw new Error('Unknown action type in data reducer.');
  }
}

export const dataReducer: Reducer<DataState, DataActions> =
  produce(innerDataReducer);
