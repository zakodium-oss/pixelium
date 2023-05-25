import { Draft, produce } from 'immer';
import { Reducer } from 'react';

import * as Type from './ViewActionTypes';
import { SetPanAction } from './actions/ImageViewerActions';
import * as ImageViewerActions from './actions/ImageViewerActions';
import * as TabActions from './actions/TabActions';
import { OpenTabAction } from './actions/TabActions';

export interface ViewState {
  currentTab?: string;
  imageViewerProps: Map<string, { pan: { x: number; y: number } }>;
}

export const initialViewState: ViewState = {
  currentTab: undefined,
  imageViewerProps: new Map(),
};

type ViewActions = OpenTabAction | SetPanAction;

function innerViewReducer(draft: Draft<ViewState>, action: ViewActions) {
  switch (action.type) {
    case Type.OPEN_TAB:
      return TabActions.openTab(draft, action.payload);
    case Type.SET_PAN:
      return ImageViewerActions.setPan(draft, action.payload);
    default:
      throw new Error('Unknown action type in view reducer.');
  }
}

export const viewReducer: Reducer<any, any> = produce(innerViewReducer);
