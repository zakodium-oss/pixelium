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
  'surface',
] as const;

export type RoiColumn = (typeof availableRoiColumns)[number];
export type AnnotationType = (typeof availableAnnotations)[number];
export type AnnotationsPreferences = {
  [key in AnnotationType]: {
    enabled: boolean;
    color: string;
    fontColor: string;
    fontSize: number;
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
        fontColor: '#ff0000',
        fontSize: 2,
      },
      minimalBoundingRectangle: {
        enabled: true,
        color: '#0000ff',
        fontColor: '#0000ff',
        fontSize: 2,
      },
      feretDiameters: {
        enabled: true,
        color: '#000000',
        fontColor: '#ff00ff',
        fontSize: 2,
      },
      surface: {
        enabled: false,
        color: '#00ff00',
        fontColor: '#00ff00',
        fontSize: 2,
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
