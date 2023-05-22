import { v4 as uuid } from '@lukeed/uuid';
import { Draft } from 'immer';

import { DataActionType } from '../DataActionTypes';
import { DataState, ImageWithMetadata } from '../DataReducer';

export type SetLoadingAction = DataActionType<'SET_LOADING', boolean>;
export type LoadDropAction = DataActionType<'LOAD_DROP', ImageWithMetadata[]>;

export function setLoading(draft: Draft<DataState>, payload: boolean) {
  draft.isLoading = payload;
}

export function loadDrop(
  draft: Draft<DataState>,
  payload: ImageWithMetadata[],
) {
  for (const file of payload) {
    draft.files[uuid()] = file;
  }
}
