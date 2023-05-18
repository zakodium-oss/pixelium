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
  // eslint-disable-next-line no-useless-return
  if (!action.payload?.preferences) return;
}
