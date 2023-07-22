import { v4 as uuid } from '@lukeed/uuid';
import { Draft } from 'immer';

import {
  CLOSE_IMAGE,
  DataActionType,
  LOAD_DROP,
  LOAD_PIXELIUM,
  SET_LOADING,
} from '../DataActionTypes';
import { DataState, DataFile } from '../DataReducer';

export type SetLoadingAction = DataActionType<typeof SET_LOADING, boolean>;
export type LoadDropAction = DataActionType<typeof LOAD_DROP, DataFile[]>;
export type LoadPixeliumAction = DataActionType<
  typeof LOAD_PIXELIUM,
  DataState
>;
export type CloseImageAction = DataActionType<typeof CLOSE_IMAGE, string>;

export function setLoading(
  draft: Draft<DataState>,
  payload: SetLoadingAction['payload'],
) {
  draft.isLoading = payload;
}

export function loadDrop(draft: Draft<DataState>, payload: DataFile[]) {
  for (const file of payload) {
    draft.images[uuid()] = file;
  }
}

export function loadPixelium(draft: Draft<DataState>, payload: DataState) {
  draft.isLoading = payload.isLoading;
  draft.images = payload.images;
}

export function closeImage(draft: Draft<DataState>, payload: string) {
  // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
  delete draft.images[payload];
}
