import {
  Image,
  GreyOptions,
  Mask,
  ThresholdOptionsAlgorithm,
  BlurOptions,
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
} from './actions/PipelineActions';

interface PipelineOperation<
  T extends string,
  O,
  R extends T extends 'MASK' ? Mask : Image,
> {
  type: T;
  options: O;
  isActive: boolean;
  result?: R;
  identifier: string;
}

export type PipelineOperations =
  | PipelineOperation<'GREY_FILTER', GreyOptions, Image>
  | PipelineOperation<'BLUR', BlurOptions, Image>
  | PipelineOperation<'MASK', ThresholdOptionsAlgorithm, Mask>;

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
    case Type.ADD_MASK:
      return PipelineActions.addMask(draft, action.payload);
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
