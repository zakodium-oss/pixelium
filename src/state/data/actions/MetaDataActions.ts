import { Draft } from 'immer';

import { EDIT_METADATA, DataActionType } from '../DataActionTypes';
import { DataState } from '../DataReducer';

export type EditMetaDataAction = DataActionType<
  typeof EDIT_METADATA,
  { identifier: string; label: string; value: string }
>;

export function editMetaData(
  draft: Draft<DataState>,
  { identifier, label, value }: EditMetaDataAction['payload'],
) {
  draft.images[identifier].metadata[label] = value;
}
