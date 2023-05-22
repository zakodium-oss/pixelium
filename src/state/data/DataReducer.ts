import { Image } from 'image-js';
import { Draft, produce } from 'immer';
import { Reducer } from 'react';

import * as Type from './DataActionTypes';
import * as LoadActions from './actions/LoadActions';
import type { SetLoadingAction, LoadDropAction } from './actions/LoadActions';

export interface ImageWithMetadata {
  image: Image;
  metadata: { name: string; relativePath: string };
}

export interface DataState {
  isLoading?: boolean;
  files: { [identifier: string]: ImageWithMetadata };
}

export const initialDataState: DataState = {
  isLoading: false,
  files: {},
};

type DataActions = SetLoadingAction | LoadDropAction;

function innerDataReducer(draft: Draft<DataState>, action: DataActions) {
  switch (action.type) {
    case Type.SET_LOADING:
      return LoadActions.setLoading(draft, action.payload);
    case Type.LOAD_DROP:
      return LoadActions.loadDrop(draft, action.payload);
    default:
      throw new Error('Unknown action type in data reducer.');
  }
}

export const dataReducer: Reducer<any, any> = produce(innerDataReducer);
