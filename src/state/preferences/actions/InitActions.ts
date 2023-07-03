import { Draft } from 'immer';

import { PreferenceActionType } from '../PreferenceActionTypes';
import { PreferencesState } from '../PreferencesReducer';

export type InitializePreferenceAction = PreferenceActionType<
  'INITIALIZE_PREFERENCES',
  { preferences: PreferencesState }
>;

export function initializePreferences(
  draft: Draft<PreferencesState>,
  payload: InitializePreferenceAction['payload'],
) {
  // eslint-disable-next-line no-useless-return
  if (!payload.preferences) return;
}
