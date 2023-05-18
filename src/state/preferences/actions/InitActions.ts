import { Draft } from 'immer';

import { PreferenceActionType } from '../PreferenceActionTypes';
import { PreferencesState } from '../PreferencesReducer';

export type InitializePreferenceAction = PreferenceActionType<
  'INITIALIZE_PREFERENCES',
  { preferences: PreferencesState }
>;

export function initializePreferences(
  draft: Draft<PreferencesState>,
  action: InitializePreferenceAction,
) {
  if (!action.payload || !action.payload.preferences) return;
  // TODO depend on the available preferences
}
