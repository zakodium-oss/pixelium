import { Draft, produce } from 'immer';
import { Reducer } from 'react';

import * as Type from './PreferenceActionTypes';
import * as InitActions from './actions/InitActions';
import type { InitializePreferenceAction } from './actions/InitActions';

export interface PreferencesState {}

export const initialPreferencesState: PreferencesState = {};

export type PreferencesActions = InitializePreferenceAction;

function innerPreferencesReducer(
  draft: Draft<PreferencesState>,
  action: PreferencesActions,
) {
  switch (action.type) {
    case Type.INITIALIZE_PREFERENCES:
      return InitActions.initializePreferences(draft, action);
    default:
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      throw new Error(`Type ${action.type} is not handled.`);
  }
}

export const preferencesReducer: Reducer<PreferencesState, any> = produce(
  innerPreferencesReducer,
);
