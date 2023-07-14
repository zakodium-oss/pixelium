import { Draft } from 'immer';

import {
  PreferenceActionType,
  SET_ROIS_COLUMNS,
} from '../PreferenceActionTypes';
import { PreferencesState, RoiColumn } from '../PreferencesReducer';

export type SetROIsColumnsAction = PreferenceActionType<
  typeof SET_ROIS_COLUMNS,
  RoiColumn[]
>;

export function setROIsColumns(
  draft: Draft<PreferencesState>,
  columns: SetROIsColumnsAction['payload'],
) {
  draft.rois.columns = columns;
}
