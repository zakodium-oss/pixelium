import { Draft, produce } from 'immer';
import { Reducer } from 'react';

import * as Type from './PreferenceActionTypes';
import * as InitActions from './actions/InitActions';
import type { InitializePreferenceAction } from './actions/InitActions';

interface RoiPreferences {
  columns: string[];
}

export interface PreferencesState {
  roisPreferences: Record<string, RoiPreferences>;
}

export const initialPreferencesState: PreferencesState = {
  roisPreferences: {},
};

export type PreferencesActions = InitializePreferenceAction;

function innerPreferencesReducer(
  draft: Draft<PreferencesState>,
  action: PreferencesActions,
) {
  switch (action.type) {
    case Type.INITIALIZE_PREFERENCES:
      return InitActions.initializePreferences(draft, action.payload);
    default:
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      throw new Error(`Type ${action.type} is not handled.`);
  }
}

export const preferencesReducer: Reducer<PreferencesState, any> = produce(
  innerPreferencesReducer,
);
