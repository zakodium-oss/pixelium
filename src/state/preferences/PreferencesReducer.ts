import { Draft, produce } from 'immer';
import { Reducer } from 'react';

import * as Type from './PreferenceActionTypes';
import * as InitActions from './actions/InitActions';
import type { InitializePreferenceAction } from './actions/InitActions';
import * as RoiPreferenceActions from './actions/RoiPreferenceActions';
import {
  SetROIsAnnotationsAction,
  SetROIsColumnsAction,
} from './actions/RoiPreferenceActions';

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

export const availableAnnotations = [
  'convexHull',
  'minimalBoundingRectangle',
  'feretDiameters',
] as const;

export type RoiColumn = (typeof availableRoiColumns)[number];
export type AnnotationType = (typeof availableAnnotations)[number];
export type AnnotationsPreferences = {
  [key in AnnotationType]: {
    enabled: boolean;
    color: string;
  };
};

interface RoiPreferences {
  columns: RoiColumn[];
  annotations: AnnotationsPreferences;
}

export interface PreferencesState {
  rois: RoiPreferences;
}

export const initialPreferencesState: PreferencesState = {
  rois: {
    columns: [...availableRoiColumns],
    annotations: {
      convexHull: {
        enabled: true,
        color: '#ff0000',
      },
      minimalBoundingRectangle: {
        enabled: true,
        color: '#0000ff',
      },
      feretDiameters: {
        enabled: true,
        color: '#000000',
      },
    },
  },
};

export type PreferencesActions =
  | InitializePreferenceAction
  | SetROIsColumnsAction
  | SetROIsAnnotationsAction;

function innerPreferencesReducer(
  draft: Draft<PreferencesState>,
  action: PreferencesActions,
) {
  switch (action.type) {
    case Type.INITIALIZE_PREFERENCES:
      return InitActions.initializePreferences(draft, action.payload);
    case Type.SET_ROIS_COLUMNS:
      return RoiPreferenceActions.setROIsColumns(draft, action.payload);
    case Type.SET_ROIS_ANNOTATIONS:
      return RoiPreferenceActions.setROIsAnnotations(draft, action.payload);
    default:
      throw new Error('Unknown action type in preferences reducer.');
  }
}

export const preferencesReducer: Reducer<PreferencesState, any> = produce(
  innerPreferencesReducer,
);
