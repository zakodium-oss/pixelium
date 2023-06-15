import { Image, MaskOptions, GreyOptions } from 'image-js';
import { Draft, produce } from 'immer';
import { Reducer } from 'react';

import * as Type from './DataActionTypes';
import * as LoadActions from './actions/LoadActions';
import type { SetLoadingAction, LoadDropAction } from './actions/LoadActions';
import * as PipelineActions from './actions/PipelineActions';
import {
  MovePipelineOperationUpAction,
  MovePipelineOperationDownAction,
  PipelineAddGreyFilterAction,
  RemovePipelineOperationAction,
} from './actions/PipelineActions';

export interface DataFile {
  image: Image;
  pipeline: PipelineOperations[];
  metadata: { name: string; relativePath: string };
}

interface PipelineOperation<T extends string, O> {
  type: T;
  options: O;
  order: number;
  identifier: string;
}

type PipelineOperations =
  | PipelineOperation<'GREY_FILTER', GreyOptions>
  | PipelineOperation<'MASK', MaskOptions>;

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
  | RemovePipelineOperationAction
  | MovePipelineOperationUpAction
  | MovePipelineOperationDownAction;

function innerDataReducer(draft: Draft<DataState>, action: DataActions) {
  switch (action.type) {
    case Type.SET_LOADING:
      return LoadActions.setLoading(draft, action.payload);
    case Type.LOAD_DROP:
      return LoadActions.loadDrop(draft, action.payload);
    case Type.ADD_GREY_FILTER:
      return PipelineActions.addGreyFilter(draft, action.payload);
    case Type.REMOVE_PIPELINE_OPERATION:
      return PipelineActions.removePipelineOperation(draft, action.payload);
    case Type.MOVE_PIPELINE_OPERATION_UP:
      return PipelineActions.movePipelineOperationUp(draft, action.payload);
    case Type.MOVE_PIPELINE_OPERATION_DOWN:
      return PipelineActions.movePipelineOperationDown(draft, action.payload);
    default:
      throw new Error('Unknown action type in data reducer.');
  }
}

export const dataReducer: Reducer<DataState, DataActions> =
  produce(innerDataReducer);
