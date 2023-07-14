import { Draft } from 'immer';

import {
  PreferenceActionType,
  SET_ROIS_ANNOTATIONS,
  SET_ROIS_COLUMNS,
} from '../PreferenceActionTypes';
import {
  AnnotationsPreferences,
  PreferencesState,
  RoiColumn,
} from '../PreferencesReducer';

export type SetROIsColumnsAction = PreferenceActionType<
  typeof SET_ROIS_COLUMNS,
  RoiColumn[]
>;

export type SetROIsAnnotationsAction = PreferenceActionType<
  typeof SET_ROIS_ANNOTATIONS,
  AnnotationsPreferences
>;

export function setROIsColumns(
  draft: Draft<PreferencesState>,
  columns: SetROIsColumnsAction['payload'],
) {
  draft.rois.columns = columns;
}

export function setROIsAnnotations(
  draft: Draft<PreferencesState>,
  annotations: SetROIsAnnotationsAction['payload'],
) {
  draft.rois.annotations = annotations;
}
