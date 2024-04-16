import { Draft } from 'immer';

import {
  INITIALIZE_PREFERENCES,
  PreferenceActionType,
} from '../PreferenceActionTypes';
import { PreferencesState } from '../PreferencesReducer';

export type InitializePreferenceAction = PreferenceActionType<
  typeof INITIALIZE_PREFERENCES,
  PreferencesState
>;

export function initializePreferences(
  draft: Draft<PreferencesState>,
  payload: InitializePreferenceAction['payload'],
) {
  draft.rois.columns = payload.rois.columns;
  draft.rois.annotations = payload.rois.annotations;
}
