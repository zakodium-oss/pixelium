import { Draft, produce } from 'immer';
import { Reducer } from 'react';

import * as Type from './PreferenceActionTypes';
import * as InitActions from './actions/InitActions';
import type { InitializePreferenceAction } from './actions/InitActions';
import * as RoiPreferenceActions from './actions/RoiPreferenceActions';
import { SetROIsPreferencesAction } from './actions/RoiPreferenceActions';

export const availableRoiColumns = [
  'id',
  'column',
  'row',
  'width',
  'height',
  'surface',
  'feretAspectRatio',
  'feretMinDiameter',
  'feretMaxDiameter',
  'roundness',
  'solidity',
  'sphericity',
  'fillRatio',
] as const;

export type RoiColumn = (typeof availableRoiColumns)[number];

interface RoiPreferences {
  columns: RoiColumn[];
}

export interface PreferencesState {
  roisPreferences: Record<string, RoiPreferences>;
}

export const initialPreferencesState: PreferencesState = {
  roisPreferences: {},
};

export type PreferencesActions =
  | InitializePreferenceAction
  | SetROIsPreferencesAction;

function innerPreferencesReducer(
  draft: Draft<PreferencesState>,
  action: PreferencesActions,
) {
  switch (action.type) {
    case Type.INITIALIZE_PREFERENCES:
      return InitActions.initializePreferences(draft, action.payload);
    case Type.SET_ROIS_PREFERENCES:
      return RoiPreferenceActions.setROIsPreferences(draft, action.payload);
    default:
      throw new Error('Unknown action type in preferences reducer.');
  }
}

export const preferencesReducer: Reducer<PreferencesState, any> = produce(
  innerPreferencesReducer,
);
