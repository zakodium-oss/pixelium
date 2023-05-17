import { Draft, produce } from 'immer';
import { Reducer } from 'react';

export interface PreferencesState {
  // TODO define data
}

export const initialPreferencesState: PreferencesState = {};

function innerPreferencesReducer(draft: Draft<PreferencesState>, action) {
  switch (action.type) {
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
}

export const preferencesReducer: Reducer<PreferencesState, any> = produce(
  innerPreferencesReducer,
);
