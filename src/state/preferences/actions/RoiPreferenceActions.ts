import { Draft } from 'immer';

import {
  PreferenceActionType,
  SET_ROIS_PREFERENCES,
} from '../PreferenceActionTypes';
import { PreferencesState } from '../PreferencesReducer';

export type SetROIsPreferencesAction = PreferenceActionType<
  typeof SET_ROIS_PREFERENCES,
  {
    identifier: string;
    preferences: PreferencesState['roisPreferences'][string];
  }
>;

export function setROIsPreferences(
  draft: Draft<PreferencesState>,
  { identifier, preferences }: SetROIsPreferencesAction['payload'],
) {
  draft.roisPreferences[identifier] = preferences;
}
